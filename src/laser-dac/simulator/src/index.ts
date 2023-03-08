import { Server as WebSocketServer } from 'ws';
import { Device, Scene, Point } from './../../core/src';

import { throttle } from './helpers';
import express from 'express';
import * as path from 'path';
import * as http from 'http';
// import the Node events module that will send data from the client to the server
import { EventEmitter } from 'events';

// When there is no real device, we fake an interval.
// We've measured how fast the real device streams, which was 4ms.
const STREAM_INTERVAL = 4;
// How many points are drawn at the same time.
// Increasing the number leads to a more stable image with less flickering.
// Only used for the simulator!
const REQUESTED_POINTS_COUNT = 500;
const PORT = 8080;

export class Simulator extends Device {
  server?: http.Server;
  wss?: WebSocketServer;
  interval?: NodeJS.Timer;
  // create a new instance of the events module
  events = new EventEmitter();

  start(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer();
      const app = express();
      app.use(express.static(path.join(__dirname, '..', 'public')));

      this.wss = new WebSocketServer({ server: this.server });

      this.server.on('request', app);

      this.wss.on('connection', (ws) => {
        // listen for the 'message' event from the server connection
        ws.on('message', (message: Buffer) => {
          try {
            const data = JSON.parse(message.toString());
            if (data.type === 'KEYDOWN') {
              // emit the keypress event to the server
              this.events.emit('KEYDOWN', data.data);
            } else if (data.type === 'KEYRELEASE') {
              // emit the keyrelease event to the server
              this.events.emit('KEYRELEASE', data.data);
            } else {
              console.log('nope', data);
            }
          } catch (e) {
            console.log('invalid input');
          }
        });
      });

      this.server.listen(PORT, function () {
        console.log(`started laser simulator on http://localhost:${PORT}`);
        resolve(true);
      });
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
    this.stopInterval();
  }

  private stopInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  stream(scene: Scene, pointsRate?: number) {
    this.stopInterval();
    const self = this;
    const frameBuffer: Point[] = [];

    function innerStream(
      numpoints: number,
      pointcallback: (points: Point[]) => void
    ) {
      if (frameBuffer.length < numpoints) {
        const points = scene.points;
        for (let i = 0; i < points.length; i++) {
          frameBuffer.push(points[i]);
        }
        // get another frame if we need to...
        setTimeout(innerStream.bind(self, numpoints, pointcallback), 0);
        self.sendPointInfoToSimulator(numpoints, points.length);
      } else {
        const points = frameBuffer.splice(0, numpoints);
        pointcallback(points);
      }
    }

    this.interval = setInterval(() => {
      innerStream(REQUESTED_POINTS_COUNT, (streamPoints) => {
        this.sendPointsToSimulator(streamPoints);
      });
    }, STREAM_INTERVAL);
  }

  private sendToSimulator(data: any) {
    this.wss!.clients.forEach((client) => {
      client.send(JSON.stringify(data), function () {
        // Ignore errors for now
      });
    });
  }

  private sendPointsToSimulator(data: any[]) {
    this.sendToSimulator({ type: 'POINTS', data });
  }

  // This method is called soo often, so throttle it!
  private sendPointInfoToSimulator = throttle(
    (numpoints: number, totalPoints: number) => {
      this.sendToSimulator({
        type: 'POINTS_INFO',
        data: { numpoints, totalPoints },
      });
    },
    400
  );
}

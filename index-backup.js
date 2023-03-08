import WebsocketClient from './websocket.js';
import dat from './dat.gui.js';

class SimulatorOptions {
  constructor() {
    this.positionDelay = 0;
    this.afterglowAmount = 30;
    this.xyResolution = 1;
    this.numberOfPoints = '';
    this.totalPoints = '';
    this.showBlanking = false;
    this.showDots = true;
    this.forceTotalRender = true;
  }
}

const options = new SimulatorOptions();
var gui = new dat.GUI();
gui.add(options, 'positionDelay', 0, 10).step(1);
gui.add(options, 'afterglowAmount', 0, 300);
gui.add(options, 'showBlanking');
gui.add(options, 'showDots');
gui.add(options, 'forceTotalRender');
gui.add(options, 'xyResolution', 0, 1);
gui.add(options, 'numberOfPoints').listen();
gui.add(options, 'totalPoints').listen();
gui.width = 300;

let points = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let lastRenderTime;

// add an event listener to the document that listens for a keydown event

document.addEventListener('keydown', function (event) {
  const key = event.key;
  try {
    let data;
    switch (key) {
      case 'ArrowLeft':
        data = { type: 'KEYDOWN', data: 'ArrowLeft' };
        break;
      case 'ArrowRight':
        data = { type: 'KEYDOWN', data: 'ArrowRight' };
        break;
      case 'ArrowUp':
        data = { type: 'KEYDOWN', data: 'ArrowUp' };
        break;
      case 'ArrowDown':
        data = { type: 'KEYDOWN', data: 'ArrowDown' };
        break;
      case ' ':
        data = { type: 'KEYDOWN', data: 'Space' };
        break;
    }
    ws.send(JSON.stringify(data));
  } catch (err) {
    console.error('Error sending message:', err);
  }
});

document.addEventListener('keyup', function (event) {
  try {
    let data;
    switch (event.key) {
      case 'ArrowLeft':
        data = { type: 'KEYRELEASE', data: 'ArrowLeft' };
        break;
      case 'ArrowRight':
        data = { type: 'KEYRELEASE', data: 'ArrowRight' };
        break;
      case 'ArrowUp':
        data = { type: 'KEYRELEASE', data: 'ArrowUp' };
        break;
      case 'ArrowDown':
        data = { type: 'KEYRELEASE', data: 'ArrowDown' };
        break;
      default:
        return;
    }
    ws.send(JSON.stringify(data));
  } catch (err) {
    console.error('error sending message:', err);
  }
});

function handleResize() {
  const pixelRatio = window.devicePixelRatio;

  ctx.scale(pixelRatio, pixelRatio);
  canvas.width = Math.floor(canvas.clientWidth * pixelRatio);
  canvas.height = Math.floor(canvas.clientHeight * pixelRatio);
  ctx.lineWidth = pixelRatio;
}
handleResize();
window.onresize = handleResize;

// Listen to changes in device pixel ratio.
window
  .matchMedia('screen and (min-resolution: 2dppx)')
  .addListener(handleResize);

function calculateRelativePosition(position) {
  return position / options.xyResolution;
}

function calculateColor(raw) {
  return Math.round(raw * 255);
}

function render() {
  const currentTime = new Date();
  if (lastRenderTime) {
    const frameInterval = currentTime - lastRenderTime;
    // We add variable afterglow depending on the time until the last render.
    ctx.fillStyle = `rgba(0, 0, 0, ${
      options.afterglowAmount ? frameInterval / options.afterglowAmount : 1
    })`;
  }
  lastRenderTime = currentTime;

  // This rectangle will use the afterglow style from the code above.
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  points.forEach(function (point, i) {
    // To simulate the behaviour of an actual laser, controlling the color
    // of the lasers is faster than moving the scanners to a position.
    // "Accurate and Efficient Drawing Method for Laser Projection" describes this as:
    // "... the command ‘turn on beam’ takes less time to execute than the actual ‘jump’ command."
    const colorIndex = i + options.positionDelay;
    const color =
      points[colorIndex < points.length ? colorIndex : points.length - 1];

    // Prevent drawing unnecessary lines.
    const isBlanking = !color || !(color.r || color.g || color.b);
    if ((!options.showBlanking && isBlanking) || i === 0) return;
    const previousPoint = points[i - 1];
    if (previousPoint.x === point.x && previousPoint.y === point.y) return;

    ctx.beginPath();
    ctx.moveTo(
      calculateRelativePosition(previousPoint.x) * canvas.width,
      calculateRelativePosition(previousPoint.y) * canvas.height
    );
    const canvasPointX = calculateRelativePosition(point.x) * canvas.width;
    const canvasPointY = calculateRelativePosition(point.y) * canvas.height;
    const canvasColor = `rgb(${calculateColor(color.r)}, ${calculateColor(
      color.g
    )}, ${calculateColor(color.b)})`;
    ctx.lineTo(canvasPointX, canvasPointY);

    if (isBlanking) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    } else {
      ctx.strokeStyle = canvasColor;
    }
    ctx.stroke();
    if (options.showDots && !isBlanking) {
      ctx.fillStyle = canvasColor;
      ctx.beginPath();
      ctx.arc(canvasPointX, canvasPointY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

// Get the hostname of the current page and remove the port number if it exists
const host = window.document.location.host.replace(/:.*/, '');

// Create a new instance of the WebsocketClient
const ws = new WebsocketClient();

// Open a new WebSocket connection to the server using the hostname and port number (8080)
ws.open('ws://' + host + ':8080');

// Set a function to be called when a message is received from the server
ws.onmessage = function (ev) {
  // Parse the message payload as JSON
  const payload = JSON.parse(event.data);
  // If the message type is "POINTS"
  if (payload.type === 'POINTS') {
    if (options.forceTotalRender) {
      // Add the new points to the existing points
      points = points.concat(payload.data);
      // Keep the last "totalPoints" number of points, discarding the rest
      points = points.slice(Math.max(points.length - options.totalPoints, 0));
    } else {
      // Replace the existing points with the new points
      points = payload.data;
    }
    return;
  }
  // If the message type is "POINTS_INFO"
  if (payload.type === 'POINTS_INFO') {
    // Update the numberOfPoints and totalPoints options with the received data
    options.numberOfPoints = String(payload.data.numpoints);
    options.totalPoints = String(payload.data.totalPoints);
  }
};

// webgl code that actually works!!

/* 

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');
canvas.width = canvas.height = 1500;

// Vertex shader program
const vsSource = `
attribute vec2 a_position;
attribute vec3 a_color;

uniform vec2 u_resolution;

varying vec3 v_color;

void main() {
  
    // Convert the position from NDC to pixels
    vec2 pixels = a_position * u_resolution;

    // Convert the position from pixels to clip space
    vec2 clipSpace = vec2((pixels.x / u_resolution.x) * 2.0 - 1.0, (pixels.y / u_resolution.y) * 2.0 - 1.0);
    clipSpace.x *= u_resolution.x / u_resolution.y;

    // Pass the color to the fragment shader
    v_color = a_color;
    // gl_PointSize = min(u_resolution.x, u_resolution.y) * 0.01;
    gl_PointSize = 100.0;
}

`;

// Fragment shader program
const fsSource = `
    precision mediump float;

    varying vec3 v_color;

    void main() {
        gl_FragColor = vec4(v_color, 1);
    }
`;

// Compile and link the shaders
const vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

const fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSource);
gl.compileShader(fs);

const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);

// Get the attribute and uniform locations
const positionLocation = gl.getAttribLocation(program, 'a_position');
const colorLocation = gl.getAttribLocation(program, 'a_color');
const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

// Create the buffer and bind it
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

// Set the vertex data
const vertexData = [0.5, 0.5, 1, 1, 0];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

// Set the viewport and clear the canvas
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// Use the shader program
gl.useProgram(program);

// Enable the vertex attribute arrays
gl.enableVertexAttribArray(positionLocation);
gl.enableVertexAttribArray(colorLocation);

// Set the vertex attribute pointers
const size = 2;
const type = gl.FLOAT;
const stride = 5 * Float32Array.BYTES_PER_ELEMENT;
const offset = 0;
gl.vertexAttribPointer(positionLocation, size, type, false, stride, offset);

const colorOffset = 2 * Float32Array.BYTES_PER_ELEMENT;
gl.vertexAttribPointer(colorLocation, 3, type, false, stride, colorOffset);

// Set the uniform values
gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

// Draw the points
gl.drawArrays(gl.POINTS, 0, vertexData.length / 5);






// stripped down version of the original simulator

import WebsocketClient from './websocket.js';

let points = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function handleResize() {
  const pixelRatio = window.devicePixelRatio;

  ctx.scale(pixelRatio, pixelRatio);
  canvas.width = Math.floor(canvas.clientWidth * pixelRatio);
  canvas.height = Math.floor(canvas.clientHeight * pixelRatio);
  ctx.lineWidth = pixelRatio;
}
handleResize();
window.onresize = handleResize;

window
  .matchMedia('screen and (min-resolution: 2dppx)')
  .addListener(handleResize);

function calculateRelativePosition(position) {
  return position;
}

function calculateColor(raw) {
  return Math.round(raw * 255);
}

function render() {
  points.forEach(function (point, i) {
    const colorIndex = i;
    const color =
      points[colorIndex < points.length ? colorIndex : points.length - 1];

    if (!color || !(color.r || color.g || color.b) || i === 0) return;
    const previousPoint = points[i - 1];
    if (previousPoint.x === point.x && previousPoint.y === point.y) return;

    ctx.beginPath();
    ctx.moveTo(
      calculateRelativePosition(previousPoint.x) * canvas.width,
      calculateRelativePosition(previousPoint.y) * canvas.height
    );
    const canvasPointX = calculateRelativePosition(point.x) * canvas.width;
    const canvasPointY = calculateRelativePosition(point.y) * canvas.height;
    const canvasColor = `rgb(${calculateColor(color.r)}, ${calculateColor(
      color.g
    )}, ${calculateColor(color.b)})`;
    ctx.lineTo(canvasPointX, canvasPointY);

    ctx.strokeStyle = canvasColor;

    ctx.stroke();
  });
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

// Get the hostname of the current page and remove the port number if it exists
const host = window.document.location.host.replace(/:.*/, '');

// Create a new instance of the WebsocketClient
const ws = new WebsocketClient();

// Open a new WebSocket connection to the server using the hostname and port number (8080)
ws.open('ws://' + host + ':8080');

// Set a function to be called when a message is received from the server
ws.onmessage = function (ev) {
  // Parse the message payload as JSON
  const payload = JSON.parse(ev.data);
  // If the message type is "POINTS"
  if (payload.type === 'POINTS') {
    // Add the new points to the existing points
    points = points.concat(payload.data);
    // Keep the last "totalPoints" number of points, discarding the rest
    points = points.slice(
      Math.max(points.length - payload.data.totalPoints, 0)
    );
    return;
  }
};


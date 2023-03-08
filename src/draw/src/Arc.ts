import { Shape } from './Shape';
import { Color, Point } from './Point';
import { Wait } from './Wait';

const BLANKING_AMOUNT = 24;

interface ArcOptions {
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  color: Color;
}

export class Arc extends Shape {
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  color: Color;

  constructor(options: ArcOptions) {
    super();
    this.x = options.x;
    this.y = options.y;
    this.radius = options.radius;
    this.startAngle = options.startAngle;
    this.endAngle = options.endAngle;
    this.color = options.color;
  }

  draw(resolution: number): Point[] {
    const circumference = 2.0 * this.radius * Math.PI;
    const pointCount = Math.round(circumference * resolution);

    const points: Point[] = new Wait({
      x: this.x + this.radius * Math.cos(this.startAngle),
      y: this.y + this.radius * Math.sin(this.startAngle),
      color: [0, 0, 0],
      amount: BLANKING_AMOUNT,
    }).draw();

    // If there are less then 3 points just return blank
    if (pointCount < 3) {
      return points;
    }

    const stepSize = (this.endAngle - this.startAngle) / pointCount;
    for (let i: number = this.startAngle; i < this.endAngle; i += stepSize) {
      points.push(
        new Point(
          this.x + this.radius * Math.cos(i),
          this.y + this.radius * Math.sin(i),
          this.color
        )
      );
    }

    // Close arc
    points.push(
      new Point(
        this.x + this.radius * Math.cos(this.endAngle),
        this.y + this.radius * Math.sin(this.endAngle),
        this.color
      )
    );

    // Blank after
    return points.concat(
      new Wait({
        x: this.x + this.radius * Math.cos(this.endAngle),
        y: this.y + this.radius * Math.sin(this.endAngle),
        color: [0, 0, 0],
        amount: BLANKING_AMOUNT,
      }).draw()
    );
  }
}

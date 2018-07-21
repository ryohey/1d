import _ from "lodash"

export default class Point {
  x: number = 0
  y: number = 0

  constructor(arg0, arg1) {
    if (_.isObject(arg0)) {
      if (_.has(arg0, "x")) {
        this.x = arg0.x
      }
      if (_.has(arg0, "y")) {
        this.x = arg0.y
      }
    } else if (_.isNumber(arg0)) {
      this.x = arg0
      this.y = _.isNumber(arg1) ? arg1 : arg0
    }
  }

  get width(): number {
    return this.x
  }

  set width(width: number) {
    this.x = width
  }

  get height(): number {
    return this.y
  }

  set height(height: number) {
    this.y = height
  }

  equals(point: Point): boolean {
    return this === point || point
      && (this.x === point.x && this.y === point.y)
  }

  clone(): Point {
    return new Point(this.x, this.y)
  }

  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  set length(length) {
    const scale = length / this.length
    this.x *= scale,
    this.y *= scale
  }

  get angle(): number {
    return Math.atan2(this.y, this.x)
  }

  set angle(angle) {
    const { length } = this
    this.x = Math.cos(angle) * length
    this.y = Math.sin(angle) * length
  }

  get distance(): number {
    const point = new Point(...arguments)
    const x = point.x - this.x
    const y = point.y - this.y
    return Math.sqrt(x * x + y * y)
  }

  normalize(): Point {
    const { x, y, length } = this
    return new Point(x / length, y / length)
  }

  add() {
    const point = new Point(...arguments)
    return new Point(this.x + point.x, this.y + point.y)
  }

  subtract() {
    const point = new Point(...arguments)
    return new Point(this.x - point.x, this.y - point.y);
  }

  multiply() {
    const point = new Point(...arguments)
    return new Point(this.x * point.x, this.y * point.y)
  }

  divide() {
    const point = new Point(...arguments)
    return new Point(this.x / point.x, this.y / point.y);
  }

  modulo() {
    const point = new Point(...arguments)
    return new Point(this.x % point.x, this.y % point.y)
  }

  negate() {
    return new Point(-this.x, -this.y)
  }

  isInside() {
    const rect = new Rectangle(...arguments)
    return rect.contains(this)
  }

  isCollinear() {
    const point = new Point(...arguments)
    return Point.isCollinear(this.x, this.y, point.x, point.y)
  }

  dot() {
    const point = new Point(...arguments)
    return this.x * point.x + this.y * point.y
  }

  cross() {
    const point = new Point(...arguments)
    return this.x * point.y - this.y * point.x;
  }
  
  round() {
    return new Point(Math.round(this.x), Math.round(this.y))
  }

  ceil() {
    return new Point(Math.ceil(this.x), Math.ceil(this.y))
  }

  floor() {
    return new Point(Math.floor(this.x), Math.floor(this.y))
  }

  abs() {
    return new Point(Math.abs(this.x), Math.abs(this.y))
  }

  static min(point1: Point, point2: Point): Point {
    return new Point(
      Math.min(point1.x, point2.x),
      Math.min(point1.y, point2.y)
    )
  }

  static max(point1: Point, point2: Point): Point {
    return new Point(
      Math.max(point1.x, point2.x),
      Math.max(point1.y, point2.y)
    )
  }
}

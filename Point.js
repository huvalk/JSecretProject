'use strict'

class Point {
  constructor(nx, ny) {
    this.x = nx;
    this.y = ny;
  }

  move(nx, ny) {
    this.x = nx;
    this.y = ny;
  }

  distanceTo(point) {
    return Math.hypot((point.x - this.x), (point.y - this.y));
  }

  addOffset(offset) {
    this.x += offset.x;
    this.y += offset.y;
    return this;
  }

  subOffset(offset) {
    this.x -= offset.x;
    this.y -= offset.y;
    return this;
  }

  mult(m) {
    this.x *= m;
    this.y *= m;
  }

  divide(d) {
    this.x /= d;
    this.y /= d;
    return this;
  }
}

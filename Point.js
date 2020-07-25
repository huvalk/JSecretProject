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
}

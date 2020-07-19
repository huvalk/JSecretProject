'use strict'

class Rectangle {
  constructor(nx, ny, nw, nh) {
    this.x1 = nx;
    this.y1 = ny;
    this.x2 = nx + nw;
    this.y2 = ny + nh;
  }

  pointInRect(x, y) {
    let result = ((x <= this.x1  && x >= this.x2) ||
    (x <= this.x2  && x >= this.x1)) &&
    ((y <= this.y1  && y >= this.y2) ||
    (y <= this.y2  && y >= this.y1));
    return result;
  }

  move(nx, ny) {
    this.x2 = nx - this.x1 + this.x2;
    this.y2 = ny - this.y1 + this.y2;
    this.x1 = nx;
    this.y1 = ny;
  }
}

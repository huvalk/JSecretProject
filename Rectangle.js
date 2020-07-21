'use strict'

class Rectangle {
  constructor(nx, ny, nw, nh) {
    //TODO зпдавать точки, а не ширину
    if (nw >= 0) {
      this.x1 = nx;
      this.x2 = nx + nw;
    } else {
      this.x1 = nx + nw;
      this.x2 = nx;
    }
    if (nh >= 0) {
      this.y1 = ny;
      this.y2 = ny + nh;
    } else {
      this.y1 = ny + nh;
      this.y2 = ny;
    }
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

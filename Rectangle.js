'use strict'

class Rectangle {
  constructor(nx, ny, nw, nh) {
    //TODO зпдавать точки, а не ширину
    // if (nx === undefined ||
    //   ny === undefined ||
    //   nw === undefined ||
    //   nh === undefined) {
    //   this.defined = false;
    // }
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

  pointInRect(x, y, accuracy = 0) {
    let result = ((x <= this.x1 + accuracy && x >= this.x2 - accuracy) ||
    (x <= this.x2 + accuracy  && x >= this.x1 - accuracy)) &&
    ((y <= this.y1 + accuracy  && y >= this.y2 - accuracy) ||
    (y <= this.y2 + accuracy  && y >= this.y1 - accuracy));
    return result;
  }

  move(nx, ny) {
    this.x2 = nx - this.x1 + this.x2;
    this.y2 = ny - this.y1 + this.y2;
    this.x1 = nx;
    this.y1 = ny;
  }

  expand(nRect) {
    if (!(nRect.x1 >= this.x1)) {
      this.x1 = nRect.x1;
    }
    if (!(nRect.y1 >= this.y1)) {
      this.y1 = nRect.y1;
    }
    if (!(nRect.x2 <= this.x2)) {
      this.x2 = nRect.x2;
    }
    if (!(nRect.y2 <= this.y2)) {
      this.y2 = nRect.y2;
    }
  }
}

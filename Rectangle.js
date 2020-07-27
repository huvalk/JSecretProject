'use strict'

class Rectangle {
  constructor(nx, ny, nw, nh, accuracy = 0) {
    //TODO зпдавать точки, а не ширину
    // if (nx === undefined ||
    //   ny === undefined ||
    //   nw === undefined ||
    //   nh === undefined) {
    //   this.defined = false;
    // }
    if (nw >= 0) {
      this.x1 = nx - accuracy;
      this.x2 = nx + nw + accuracy;
    } else {
      this.x1 = nx + nw - accuracy;
      this.x2 = nx + accuracy;
    }
    if (nh >= 0) {
      this.y1 = ny - accuracy;
      this.y2 = ny + nh + accuracy;
    } else {
      this.y1 = ny + nh - accuracy;
      this.y2 = ny + accuracy;
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

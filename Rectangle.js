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
      this.width = nw;
      this.x1 = nx - accuracy;
      this.x2 = nx + nw + accuracy;
    } else {
      this.width = -nw;
      this.x1 = nx + nw - accuracy;
      this.x2 = nx + accuracy;
    }
    if (nh >= 0) {
      this.height = nh;
      this.y1 = ny - accuracy;
      this.y2 = ny + nh + accuracy;
    } else {
      this.height = -nh;
      this.y1 = ny + nh - accuracy;
      this.y2 = ny + accuracy;
    }
  }

  pointInRect(x, y) {
    let result = ((x <= this.x1 && x >= this.x2) ||
    (x <= this.x2  && x >= this.x1)) &&
    ((y <= this.y1  && y >= this.y2) ||
    (y <= this.y2  && y >= this.y1));
    return result;
  }

  move(nx, ny) {
    this.x2 = nx + this.width;
    this.y2 = ny + this.height;
    this.x1 = nx;
    this.y1 = ny;
  }

  offset(xOffset, yOffset) {
    this.x2 += xOffset;
    this.y2 += yOffset;
    this.x1 += xOffset;
    this.y1 += yOffset;
  }

  mult(m) {
    this.x1 *= m;
    this.y1 *= m;
    this.width *= m;
    this.height *= m;
    this.x2 = this.x1 + this.width;
    this.y2 = this.y1 + this.height;
  }

  divide(d) {
    this.x1 /= d;
    this.y1 /= d;
    this.width /= d;
    this.height /= d;
    this.x2 = this.x1 + this.width;
    this.y2 = this.y1 + this.height;
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
    this.width = this.x2 - this.x1;
    this.height = this.y2 - this.y1;
  }
}

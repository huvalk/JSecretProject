'use strict'

class GraphicLine extends GraphicItem {
  constructor(nfirstPoint, nsecondPoint) {
    super();
    this.firstPoint = nfirstPoint;
    this.secondPoint = nsecondPoint;
    this.width = 3;
    this.visable = true;
    this.type = "GraphicLine";
    // Нужно добавить небольшую зону вокруг краев?
    this.boundingRect = new Rectangle(this.firstPoint.x,
      this.firstPoint.y,
      this.secondPoint.x - this.firstPoint.x,
      this.secondPoint.y - this.firstPoint.y);
  }

  pointInArea(x, y, accuracy = this.width) {
    return this.boundingRect.pointInRect(x, y, accuracy);
    // if ( this.boundingRect.pointInRect(x, y, accuracy) ) {
    //   //TODO Можно оптимизировать
    //   //TODO заменить на формулу расстояния?
    //   let pxLow = (x - accuracy - this.secondPoint.x) / (this.firstPoint.x - this.secondPoint.x);
    //   let pxHigh = (x + accuracy - this.secondPoint.x) / (this.firstPoint.x - this.secondPoint.x);
    //   let py = (y - this.secondPoint.y) / (this.firstPoint.y - this.secondPoint.y);
    //
    //   if (py >= 0 && py <= 1) {
    //     if (pxHigh < pxLow) {
    //       [pxHigh, pxLow] = [pxLow, pxHigh];
    //       if (py <= pxHigh && py >= pxLow) {
    //         return true;
    //       }
    //     }
    //   }
    //
    //   let pyLow = (y - accuracy - this.secondPoint.y) / (this.firstPoint.y - this.secondPoint.y);
    //   let pyHigh = (y + accuracy - this.secondPoint.y) / (this.firstPoint.y - this.secondPoint.y);
    //   let px = (x - this.secondPoint.x) / (this.firstPoint.x - this.secondPoint.x);
    //
    //   if (px >= 0 && px <= 1) {
    //     if (pyHigh < pyLow) {
    //       [pyHigh, pyLow] = [pyLow, pyHigh];
    //       if (px <= pyHigh && px >= pyLow) {
    //         return true;
    //       }
    //     }
    //   }
    //   return false;
    // }
  }

  // drag(nx, ny) {
  //   this.firstPoint.move(nx, ny);
  //   this.secondPoint.move(nx, ny);
  //   this.boundingRect.move(this.x - this.border - this.radius,
  //     this.y - this.border - this.radius);
  // }

  redraw(ctx) {
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = this.width;
    ctx.beginPath();
    ctx.moveTo(this.firstPoint.x, this.firstPoint.y);
    ctx.lineTo(this.secondPoint.x, this.secondPoint.y);
    ctx.closePath();
    ctx.stroke();
    this.firstPoint.redraw(ctx);
    this.secondPoint.redraw(ctx);
  }

  getYByX(x) {
    return ((x - this.firstPoint.x) * (this.firstPoint.y - this.secondPoint.y) /
            (this.firstPoint.x - this.secondPoint.x) + this.firstPoint.y);
  }

  getXByY(y) {
    return ((y - this.firstPoint.y) * (this.firstPoint.x - this.secondPoint.x) /
            (this.firstPoint.y - this.secondPoint.y) + this.firstPoint.x);
  }
}

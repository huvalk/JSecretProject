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
    if ( this.boundingRect.pointInRect(x, y) ) {
      //TODO Можно оптимизировать
      // Линейная зависимости p от координаты клика
      // было width / 2
      let pxLow = (x - accuracy - this.secondPoint.x) / (this.firstPoint.x - this.secondPoint.x);
      let pxHigh = (x + accuracy - this.secondPoint.x) / (this.firstPoint.x - this.secondPoint.x);

      //TODO погрешность по горизонтали и вертикали
      let py = (y - this.secondPoint.y) / (this.firstPoint.y - this.secondPoint.y);
      if (py >= 0 && py <= 1) {
        if (pxHigh < pxLow) {
          [pxHigh, pxLow] = [pxLow, pxHigh];
          if (py <= pxHigh && py >= pxLow) {
            return true;
          }
        }
      }

      return false;
    }
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

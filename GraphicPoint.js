'use strict'

class GraphicPoint {
  constructor(nx, ny, nradius) {
    this.x = nx;
    this.y = ny;
    this.radius = nradius;
    this.border = 1;
    this.visable = true;
    this.boundingRect = new Rectangle(this.x - this.border - this.radius,
      this.y - this.border - this.radius,
      2 * (this.border + this.radius),
      2 * (this.border + this.radius));
  }

  boundingRect() {
    return this.boundingRect;
  }

  invisable() {
    this.visable = false;
  }

  visable() {
    this.visable = true;
  }

  pos() {
    return new Point(this.x, this.y);
  }

  redrawRequest(changesArea) {
    if (changesArea instanceof Rectangle) {
      //TODO не работает, если углы не попадают внутрь зоны изменений. Переписать
      return (this.visable && !((this.boundingRect.x1 < changesArea.x1 && this.boundingRect.x2 < changesArea.x1) ||
              (this.boundingRect.x1 > changesArea.x2 && this.boundingRect.x2 > changesArea.x2) ||
              (this.boundingRect.y1 < changesArea.y1 && this.boundingRect.y2 < changesArea.y1) ||
              (this.boundingRect.y1 > changesArea.y2 && this.boundingRect.y2 > changesArea.y2)));
    }

    return false;
  }

  wasClicked(x, y) {
    if ( this.boundingRect.pointInRect(x, y) ) {
      return (Math.pow((this.radius + this.border), 2) > (Math.pow((this.x - x), 2) +
            Math.pow((this.y - y), 2)));
    }
  }

  drag(nx, ny) {
    this.x = nx;
    this.y = ny;
    this.boundingRect.move(this.x - this.border - this.radius,
      this.y - this.border - this.radius);
  }

  redraw(ctx) {
    ctx.strokeStyle = "#fc0"
    ctx.fillStyle = "#fc0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}

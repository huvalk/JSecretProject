'use strict'

class GraphicPoint extends GraphicItem {
  constructor(nx, ny, nradius) {
    super();
    this.x = nx;
    this.y = ny;
    this.radius = nradius;
    this.border = 2;
    this.visable = true;
    this.type = "GraphicPoint";
    this.attached = false;
    //TODO Сделать массив родителей, чтобы одна точка принадлежала многим отрезкам
    this.parent = null;

    this.boundingRect = new Rectangle(this.x - this.border - this.radius,
      this.y - this.border - this.radius,
      2 * (this.border + this.radius),
      2 * (this.border + this.radius));
  }

  free() {
    this.parent = null;
    this.attached = false;
  }

  attach(nparent) {
    this.parent = nparent;
    this.attached = true;
  }

  attachedTo() {
    return this.parent;
  }

  isAttached() {
    return this.free;
  }

  pos() {
    return new Point(this.x, this.y);
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
    if (this.attached) {
      ctx.strokeStyle = "#A60000"
      ctx.fillStyle = "#FF9E00";
    } else {
      ctx.strokeStyle = "#000000"
      ctx.fillStyle = "#38DF64";
      // ctx.fillStyle = "#FFDF38";
    }

    ctx.lineWidth = this.border;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}

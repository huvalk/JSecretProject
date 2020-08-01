'use strict'

class GraphicPoint extends GraphicItem {
  constructor(nx, ny, nradius, nStrokeStyle = "#000000", mFillStyle = "#38DF64") {
    super();
    this.x = nx;
    this.y = ny;
    this.radius = nradius;
    this.border = 2;
    this.visable = true;
    this.type = "GraphicPoint";
    this.strokeStyle = nStrokeStyle;
    this.fillStyle = mFillStyle;
    this.boundingRect = new Rectangle(this.x - this.border - this.radius,
      this.y - this.border - this.radius,
      2 * (this.border + this.radius),
      2 * (this.border + this.radius));
  }

  pos() {
    return new Point(this.x, this.y);
  }

  wasClicked(x, y) {
    if ( this.boundingRect.pointInRect(x, y) ) {
      return (Math.pow((this.radius + this.border), 2) >
             (Math.pow((this.x - x), 2) + Math.pow((this.y - y), 2)));
    }
  }

  drag(nx, ny) {
    this.x = nx;
    this.y = ny;
    this.boundingRect.move(this.x - this.border - this.radius,
      this.y - this.border - this.radius);
  }

  redraw(ctx, offset, scale) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.fillStyle;
    ctx.lineCap  = 'butt';
    ctx.lineWidth = this.border;

    ctx.beginPath();
    ctx.arc((this.x * scale - offset.x), (this.y * scale - offset.y),
            this.radius, 0, Math.PI*2, true);
    ctx.stroke();
    ctx.fill();
  }
}

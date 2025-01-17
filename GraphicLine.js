'use strict'

class GraphicLine extends GraphicItem {
  constructor(nfirstPoint, nsecondPoint) {
    super();

    this.firstPoint = nfirstPoint;
    this.secondPoint = nsecondPoint;
    this.width = 3;
    this.visable = true;
    this.type = "GraphicLine";
    this.boundingRect = new Rectangle(this.firstPoint.x,
                                      this.firstPoint.y,
                                      this.secondPoint.x - this.firstPoint.x,
                                      this.secondPoint.y - this.firstPoint.y,
                                      this.width);
  }

  pointInArea(x, y) {
    return this.boundingRect.pointInRect(x, y);
  }

  wasClicked(x, y) {
    if ( this.boundingRect.pointInRect(x, y) ) {
      let accuracy = Math.ceil(this.width / 2);
      let r1 = Math.hypot(x - this.firstPoint.x, y - this.firstPoint.y);
      let r2 = Math.hypot(x - this.secondPoint.x, y - this.secondPoint.y);
      let r12 = Math.hypot(this.firstPoint.x - this.secondPoint.x,
        this.firstPoint.y - this.secondPoint.y);

      if ((r1 <= accuracy) || (r2 <= accuracy)) {
        return true;
      } else if ((r1 < Math.hypot(r2, r12)) && (r2 < Math.hypot(r1, r12))) {
        let a = this.secondPoint.y - this.firstPoint.y
        let b = this.firstPoint.x - this.secondPoint.x
        let c = - (this.firstPoint.x * a + this.firstPoint.y * b);
        let t = Math.hypot(a, b);

        if (c > 0) {
          a = -a;
          b = -b;
          c = -c;
        }

        if ((Math.abs((a * x +  b * y + c) / t)) <= accuracy) {
          return true;
        }
      }

      return false;
    }
  }

  redraw(ctx, offset, scale) {
    ctx.strokeStyle = "#FF4040";
    ctx.lineWidth = this.width;
    ctx.lineCap  = 'round';

    ctx.beginPath();
    ctx.moveTo((this.firstPoint.x * scale - offset.x),
               (this.firstPoint.y * scale - offset.y));
    ctx.lineTo((this.secondPoint.x * scale - offset.x),
               (this.secondPoint.y * scale - offset.y));
    ctx.stroke();
  }

  getYByX(x) {
    return new Point(x, ((x - this.firstPoint.x) *
                         (this.firstPoint.y - this.secondPoint.y) /
                         (this.firstPoint.x - this.secondPoint.x) +
                         this.firstPoint.y));
  }

  getXByY(y) {
    return new Point(((y - this.firstPoint.y) *
                     (this.firstPoint.x - this.secondPoint.x) /
                     (this.firstPoint.y - this.secondPoint.y) +
                     this.firstPoint.x), y);
  }
}

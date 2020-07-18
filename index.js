'use strict'

class Rectangle {
  constructor(nx, ny, nw, nh) {
    this.x1 = nx;
    this.y1 = ny;
    this.x2 = nx + nw;
    this.y2 = ny + nh;
  }

  pointInRect(x, y) {
    console.log("point ", x, y)
    console.log("in rect ", this)
    let result = ((x <= this.x1  && x >= this.x2) ||
    (x <= this.x2  && x >= this.x1)) &&
    ((y <= this.y1  && y >= this.y2) ||
    (y <= this.y2  && y >= this.y1));
    console.log(result)
    return result;
  }
}

class Point {
  constructor(nx, ny) {
    this.x = nx;
    this.y = ny;
  }
}

class GraphicPoint {
  constructor(nx, ny, nradius) {
    this.x = nx;
    this.y = ny;
    this.radius = nradius;
    this.border = 1
    this.boundingRect = new Rectangle(this.x - this.border - this.radius,
      this.y - this.border - this.radius,
      2 * (this.border + this.radius),
      2 * (this.border + this.radius));
  }

  boundingRect() {
    return this.boundingRect;
  }

  redrawRequest(changesArea) {
    if (changesArea instanceof Rectangle) {
      console.log("size:\n", this.boundingRect, "\nchangesArea:\n", changesArea)
      return (changesArea.pointInRect(this.boundingRect.x1, this.boundingRect.y1) ||
          changesArea.pointInRect(this.boundingRect.x2, this.boundingRect.y2) ||
          changesArea.pointInRect(this.boundingRect.x1, this.boundingRect.y2) ||
          changesArea.pointInRect(this.boundingRect.x2, this.boundingRect.y1));
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
  }

  redraw(ctx) {
    ctx.strokeStyle = "#000"
    ctx.fillStyle = "#fc0";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}

class GraphicScene {
  constructor(ncanvas) {
    // Нужно только для браузера
    this.canvas = ncanvas;

    this.ctx = ncanvas.getContext('2d');
    this.xOffset = 0;
    this.yOffset = 0;
    this.zOffset = 0;
    this.scale = 1;
    this.items = new Map();
    this.items.set(this.zOffset, []);
    this.changesArea;
  }

  getMousePosition(event) {
    let rect = this.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return new Point(x, y);
  }

  addPoint(event) {
    let pos = this.getMousePosition(event);
    let button = event.button;

    if (button === 0) {
      let nPoint = new GraphicPoint(pos.x, pos.y, 15);
      this.items.get(this.zOffset).push(nPoint);
      nPoint.redraw(this.ctx);
    } else if (button === 2) {
      let currentLayer = this.items.get(this.zOffset);

      for (let i = currentLayer.length - 1; i >= 0; i--) {
        if ( currentLayer[i].wasClicked(pos.x, pos.y) ) {
          this.changesArea = currentLayer[i].boundingRect;
          this.ctx.clearRect(this.changesArea.x1, this.changesArea.y1, this.changesArea.x2 - this.changesArea.x1, this.changesArea.y2 - this.changesArea.y1)
          currentLayer.splice(i, 1);
          //TODO не допеускать коллизии точек
          break;
        }
      }

      for (let i = 0; i < currentLayer.length; i++) {
        console.log("request")
        if (currentLayer[i].redrawRequest(this.changesArea)) {
          currentLayer[i].redraw(this.ctx);
        }
      }
    }
  }
}

window.onload = function() {
  let canvas = document.getElementById('canvas');
  let scene = new GraphicScene(canvas);

  canvas.addEventListener('mousedown', function(event) {
    scene.addPoint(event);
  });
  canvas.addEventListener('contextmenu', function(event) {
    return false;
  });
}

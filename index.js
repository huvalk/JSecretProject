'use strict'

class Rectangle {
  constructor(nx, ny, nw, nh) {
    this.x1 = nx;
    this.y1 = ny;
    this.x2 = nx + nw;
    this.y2 = ny + nh;
  }

  pointInRect(x, y) {
    let result = ((x <= this.x1  && x >= this.x2) ||
    (x <= this.x2  && x >= this.x1)) &&
    ((y <= this.y1  && y >= this.y2) ||
    (y <= this.y2  && y >= this.y1));
    return result;
  }

  move(nx, ny) {
    this.x2 = nx - this.x1 + this.x2;
    this.y2 = ny - this.y1 + this.y2;
    this.x1 = nx;
    this.y1 = ny;
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
    this.boundingRect.move(nx, ny);
  }

  redraw(ctx) {
    ctx.strokeStyle = "#fc0"
    ctx.fillStyle = "#fc0";
    ctx.lineWidth = 0;
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
    this.pointSize = 5
    this.gridSize = 15;
    this.cursorPoint = new GraphicPoint(0, 0, this.pointSize);
    this.items = new Map();

    this.items.set(this.zOffset, []);
    this.cursorPoint.invisable();
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
      let nPoint = new GraphicPoint(pos.x, pos.y, this.pointSize);
      this.items.get(this.zOffset).push(nPoint);
      nPoint.redraw(this.ctx);
    } else if (button === 2) {
      let currentFloor = this.items.get(this.zOffset);

      for (let i = currentFloor.length - 1; i >= 0; i--) {
        if ( currentFloor[i].wasClicked(pos.x, pos.y) ) {
          let changesArea = currentFloor[i].boundingRect;
          this.ctx.clearRect(changesArea.x1, changesArea.y1, changesArea.x2 - changesArea.x1, changesArea.y2 - changesArea.y1)
          currentFloor.splice(i, 1);

          this.redraw(changesArea, currentFloor);
          break;
        }
      }
    }
  }

  cursorShadow(event) {
    console.log("move")
    let pos = this.getMousePosition(event);

    let startX = Math.floor(pos.x / this.gridSize) * this.gridSize;
    let startY = Math.floor(pos.y / this.gridSize) * this.gridSize;

    if (!this.cursorPoint.wasClicked(startX, startY)) {
      this.cursorPoint.drag(startX, startY);
      this.cursorPoint.redraw(this.ctx);
    }
  }

  redraw(changesArea, currentFloor) {
    // Отрисовать задний слой
    this.drawGrid();

    // Отрисовать центральный слой
    for (let i = 0; i < currentFloor.length; i++) {
      if (currentFloor[i].redrawRequest(changesArea)) {
        currentFloor[i].redraw(this.ctx);
      }
    }

    // отрисовать цетральный слой
  }

  //TODO сетка двух размеров - большая и маленькая
  drawGrid() {
    //TODO сетка двух размеров - большая и маленькая
    let width = this.canvas.width;
    let height = this.canvas.height;
    let startX = Math.floor(this.xOffset / this.gridSize) * this.gridSize
    let startY = Math.floor(this.yOffset / this.gridSize) * this.gridSize

    this.ctx.strokeStyle = "#aaa"
    this.ctx.lineWidth = 0;
    this.ctx.beginPath();
    for (let i = 0; i < width; i += this.gridSize) {
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(width, i);
    }
    for (let i = 0; i < height; i += this.gridSize) {
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, height);
    }
    this.ctx.closePath();
    this.ctx.stroke();
  }

  mouseClick(event) {

  }

  mouseHover(event) {

  }

  mouseMove(event) {

  }
}

function Enum(values){
    for( var i = 0; i < values.length; ++i ){
        this[values[i]] = i;
    }
    return this;
}
let config = {};
config.type = new Enum(["RED","GREEN","BLUE"]);

window.onload = function() {
  let canvas = document.getElementById('canvas');
  let scene = new GraphicScene(canvas);

  canvas.addEventListener('mousedown', function(event) {
    scene.mouseClick(event);
  });
  canvas.addEventListener('mousemove', function(event) {
    scene.mouseMove(event);
  });
  canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });

  scene.mouseClick = scene.addPoint;
  scene.mouseMove = scene.cursorShadow;
}
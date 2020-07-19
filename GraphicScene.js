'use strict'

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
    let pos = this.cursorPoint.pos();
    let button = event.button;

    if (button === 0) {
      let nPoint = new GraphicPoint(pos.x, pos.y, this.pointSize);
      this.items.get(this.zOffset).push(nPoint);
      nPoint.redraw(this.ctx);
    } else if (button === 2) {
      let currentFloor = this.items.get(this.zOffset);

      for (let i = currentFloor.length - 1; i >= 0; i--) {
        if ( currentFloor[i].wasClicked(pos.x, pos.y) ) {
          let changesArea = Object.assign(new Rectangle(0, 0, 0, 0), currentFloor[i].boundingRect);
          currentFloor.splice(i, 1);

          this.redraw(changesArea, currentFloor);
          break;
        }
      }
    }
  }

  cursorShadow(event) {
    //TODO Доработать или убрать
    let pos = this.getMousePosition(event);
    let startX = Math.round(pos.x / this.gridSize) * this.gridSize;
    let startY = Math.round(pos.y / this.gridSize) * this.gridSize;

    if (!this.cursorPoint.wasClicked(startX, startY)) {
      let changesArea = Object.assign(new Rectangle(0, 0, 0, 0), this.cursorPoint.boundingRect);

      this.cursorPoint.drag(startX, startY);
      this.redraw(changesArea, this.items.get(this.zOffset));
      this.cursorPoint.redraw(this.ctx);
    }
  }

  redraw(changesArea, currentFloor) {
    this.ctx.clearRect(changesArea.x1, changesArea.y1,
      changesArea.x2 - changesArea.x1, changesArea.y2 - changesArea.y1)
    // Отрисовать задний слой
    //TODO Перенести на задний слой
    this.drawGrid(changesArea);


    // Отрисовать центральный
    for (let i = 0; i < currentFloor.length; i++) {
      if (currentFloor[i].redrawRequest(changesArea)) {
        currentFloor[i].redraw(this.ctx);
      }
    }

    // отрисовать цетральный слой
  }

  //TODO сетка двух размеров - большая и маленькая
  drawGrid(changesArea) {
    //TODO сетка двух размеров - большая и маленькая
    let startX = Math.ceil(changesArea.x1 / this.gridSize) * this.gridSize
    let startY = Math.ceil(changesArea.y1 / this.gridSize) * this.gridSize

    this.ctx.strokeStyle = "#aaa"
    this.ctx.lineWidth = 0;
    this.ctx.beginPath();
    for (let i = startY; i < changesArea.y2; i += this.gridSize) {
      this.ctx.moveTo(changesArea.x1, i);
      this.ctx.lineTo(changesArea.x2, i);
    }
    for (let i = startX; i < changesArea.x2; i += this.gridSize) {
      this.ctx.moveTo(i, changesArea.y1);
      this.ctx.lineTo(i, changesArea.y2);
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

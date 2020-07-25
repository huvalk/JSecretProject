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
    this.lineBegins = false;
    this.tempPoint = null;

    this.items.set(this.zOffset, [[], []]);
    this.cursorPoint.invisable();
  }

  getMousePosition(event) {
    let rect = this.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return new Point(x, y);
  }

  addLine(pos, type) {
    if (type === "mousedown") {
      this.tempPoint = new GraphicPoint(pos.x, pos.y, this.pointSize);
      this.items.get(this.zOffset)[0].push(this.tempPoint);
      this.tempPoint.redraw(this.ctx);

      this.lineBegins = true;
    } else if (type === "mouseup") {
      if (this.lineBegins) {
        let nPoint = new GraphicPoint(pos.x, pos.y, this.pointSize);
        this.items.get(this.zOffset)[0].push(nPoint);

        this.lineBegins = false;
        let nLine = new GraphicLine(this.tempPoint, nPoint);
        this.items.get(this.zOffset)[1].push(nLine);
        this.tempPoint = null;
        nLine.redraw(this.ctx);
      }
    }

  }

  editLine(event) {
    let pos = this.cursorPoint.pos();
    let type = event.type;
    let button = event.button;

    if (button === 0) {
      this.addLine(pos, type);
    } else if (button === 2) {
      let currentFloor = this.items.get(this.zOffset)[0];

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

  lineAttachment(event) {
    //TODO искать минимальное расстояние среди всех точек
    let pos = this.getMousePosition(event);
    let currentFloor = this.items.get(this.zOffset)[1];
    let startX = Math.round(pos.x / this.gridSize) * this.gridSize;
    let startY = Math.round(pos.y / this.gridSize) * this.gridSize;
    let newX = startX;
    let newY = startY;
    let minDistance = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < currentFloor.length;  i++) {
      // if ((currentFloor[i].type === "GraphicLine") &&
        if (currentFloor[i].pointInArea(pos.x, pos.y, 0)) {
        let pointCrossX = currentFloor[i].getXByY(startY);
        let pointCrossY = currentFloor[i].getYByX(startX);
        let distanceCrossX = pos.distanceTo(pointCrossX);
        let distanceCrossY = pos.distanceTo(pointCrossY);

        if (distanceCrossX <= distanceCrossY) {
          if (distanceCrossX < minDistance) {
            newX = pointCrossX.x;
            newY = startY;
            minDistance = distanceCrossX;
          }
        } else if (distanceCrossY < minDistance) {
          newX = startX;
          newY = pointCrossY.y;
          minDistance = distanceCrossY;
        }
      }
    }

    let changesArea = Object.assign(new Rectangle(0, 0, 0, 0), this.cursorPoint.boundingRect);

    this.cursorPoint.drag(newX, newY);
    this.redraw(changesArea, this.items.get(this.zOffset));
    this.cursorPoint.redraw(this.ctx);
  }

  redraw(changesArea, currentFloor) {
    this.ctx.clearRect(changesArea.x1, changesArea.y1,
      changesArea.x2 - changesArea.x1, changesArea.y2 - changesArea.y1)
    // Отрисовать задний слой
    //TODO Перенести на задний слой
    this.drawGrid(changesArea);

    // Отрисовать центральный
    //TODO сначала отрисовывать линии
    //TODO Добавить признак, что объект был отрисован?
    let redrawnArea = new Rectangle();
    for (let i = 0; i < currentFloor[1].length; i++) {
      console.log(redrawnArea)
      if (currentFloor[1][i].redrawRequest(changesArea)) {
        redrawnArea.expand(currentFloor[1][i].boundingRect);
        currentFloor[1][i].redraw(this.ctx);
      }
    }

    // отрисовать верхний слой
    for (let i = 0; i < currentFloor[0].length; i++) {
      if (currentFloor[0][i].redrawRequest(redrawnArea)) {
        currentFloor[0][i].redraw(this.ctx);
      }
    }
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

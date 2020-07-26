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

    this.cursorPoint.free();
    this.items.set(this.zOffset, [new Set(), new Set()]);
    this.cursorPoint.invisable();
  }

  getMousePosition(event) {
    let rect = this.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return new Point(x, y);
  }

  findPoint(pos) {
    let currentFloor = this.items.get(this.zOffset);

    for (let item of currentFloor[1]) {
      // недопускать пересечений точек
      if (item.wasClicked(pos.x, pos.y)) {
        return item;
      }
    }

    return null;
  }

  addItem(pos, type) {
    if (type === "mousedown") {
      this.tempPoint = this.findPoint(pos);

      if (this.tempPoint === null || this.tempPoint.isAttached()) {
        this.tempPoint = new GraphicPoint(pos.x, pos.y, this.pointSize);
        this.items.get(this.zOffset)[1].add(this.tempPoint);
        this.tempPoint.redraw(this.ctx);
      }

      this.lineBegins = true;
    } else if (type === "mouseup") {
      if (this.lineBegins && !this.tempPoint.wasClicked(pos.x, pos.y)) {
        let nPoint = this.findPoint(pos)
        if (nPoint === null || nPoint.isAttached()) {
          nPoint = new GraphicPoint(pos.x, pos.y, this.pointSize);
          this.items.get(this.zOffset)[1].add(nPoint);
        }

        let nLine = new GraphicLine(this.tempPoint, nPoint);

        //TODO проверить
        this.tempPoint.attach(nLine);
        nPoint.attach(nLine);
        this.items.get(this.zOffset)[0].add(nLine);
        this.lineBegins = false;
        this.tempPoint = null;
        nLine.redraw(this.ctx);
      }
    }
  }

  deleteItem(pos, type) {
    if (event.type === "mouseup") {
      let currentFloor = this.items.get(this.zOffset);

      //TODO заменить на findPoint(pos)
      for (let item of currentFloor[1]) {
        // недопускать пересечений точек
        if ( item.wasClicked(pos.x, pos.y) ) {
          let changesArea = Object.assign(new Rectangle(0, 0, 0, 0), item.boundingRect);
          let attachedTo = item.attachedTo();

          currentFloor[1].delete(item);
          if (attachedTo !== null) {
            currentFloor[0].delete(attachedTo);
            attachedTo.freePoints();
            changesArea.expand(attachedTo.boundingRect);
          }

          this.redraw(changesArea, currentFloor);
          return;
        }
      }

      for (let item of currentFloor[0]) {
        if ( item.wasClicked(pos.x, pos.y) ) {
          let changesArea = Object.assign(new Rectangle(0, 0, 0, 0), item.boundingRect);
          currentFloor[0].delete(item);
          item.freePoints();

          this.redraw(changesArea, currentFloor);
          return;
        }
      }
    }
  }

  editLine(event) {
    let pos = this.cursorPoint.pos();
    let type = event.type;
    let button = event.button;

    if (button === 0) {
      this.addItem(pos, type);
    } else if (button === 2) {
      this.deleteItem(pos, type);
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
    let currentFloor = this.items.get(this.zOffset)[0];
    let startX = Math.round(pos.x / this.gridSize) * this.gridSize;
    let startY = Math.round(pos.y / this.gridSize) * this.gridSize;
    let newX = startX;
    let newY = startY;
    let minDistance = Number.MAX_SAFE_INTEGER;

    for (let item of currentFloor) {
      // if ((currentFloor[i].type === "GraphicLine") &&
        if (item.pointInArea(pos.x, pos.y, 0)) {
        let pointCrossX = item.getXByY(startY);
        let pointCrossY = item.getYByX(startX);
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
      changesArea.x2 - changesArea.x1, changesArea.y2 - changesArea.y1);
    // Отрисовать задний слой
    //TODO Перенести на задний слой
    this.drawGrid(changesArea);

    // Отрисовать центральный
    //TODO сначала отрисовывать линии
    //TODO Добавить признак, что объект был отрисован?
    let redrawnArea = new Rectangle();

    for (let item of currentFloor[0]) {
      if ( item.redrawRequest(changesArea) ) {
        redrawnArea.expand(item.boundingRect);
        item.redraw(this.ctx);
      }
    }

    // отрисовать верхний слой
    for (let item of currentFloor[1]) {
      if ( item.redrawRequest(redrawnArea) ) {
        item.redraw(this.ctx);
      }
    }
  }

  //TODO сетка двух размеров - большая и маленькая
  drawGrid(changesArea) {
    //TODO сетка двух размеров - большая и маленькая
    let startX = Math.ceil(changesArea.x1 / this.gridSize) * this.gridSize;
    let startY = Math.ceil(changesArea.y1 / this.gridSize) * this.gridSize;

    this.ctx.strokeStyle = "#aaa";
    this.ctx.lineWidth = 1;
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

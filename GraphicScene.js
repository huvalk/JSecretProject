'use strict'

class GraphicScene {
  constructor(ncanvas, nCanvasWidth, nCanvasHeight) {
    // Нужно только для браузера
    this.canvas = ncanvas;
    this.ctx = ncanvas.getContext('2d');
    this.canvasWidth = nCanvasWidth;
    this.canvasHeight = nCanvasHeight;
    this.scale = 4;
    this.canvasWindow = new Rectangle(0, 0,
                                      this.canvasWidth / this.scale,
                                      this.canvasHeight / this.scale);
    this.offset = new Point(100, 100);
    this.zOffset = 0;
    this.pointSize = 5;
    this.gridSize = 8;
    this.cursorPoint = new GraphicPoint(0, 0, this.pointSize,
                                        "#A60000", "#FF9E00");
    this.items = new Map();
    this.lineBegins = false;
    this.tempPoint = null;
    this.isDragging = false;
    this.dragPos = null;
    this.time;
    this.animationID;

    this.items.set(this.zOffset, [new Set(), new Set()]);
    this.cursorPoint.attached = false;;
  }

  reset() {
    this.lineBegins = false;
    this.isDragging = false;
    this.tempPoint = null;
  }

  changeFloor(f) {
    this.zOffset = f;
    this.redraw(this.canvasWindow, this.items.get(this.zOffset));
  }

  getMousePosition(event) {
    let rect = this.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left + this.offset.x;
    let y = event.clientY - rect.top + this.offset.y;
    return new Point(x, y);
  }

  getMouseRealPosition(event) {
    let rect = this.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return new Point(x, y);
  }

  zoomIn() {
    // Зум двухкратный
    let pos = this.getMouseRealPosition(event);

    this.scale *= 2;
    this.offset.x = this.offset.x * 2 + pos.x;
    this.offset.y = this.offset.y * 2 + pos.y;
    this.canvasWindow.divide(2);
    this.canvasWindow.move(this.offset.x / this.scale,
                           this.offset.y / this.scale);
    this.redraw(this.canvasWindow, this.items.get(this.zOffset));
  }

  zoomOut() {
    // Зум двухкратный
    let pos = this.getMouseRealPosition(event);

    this.scale /= 2;
    this.offset.x = this.offset.x / 2 - pos.x / 2;
    this.offset.y = this.offset.y / 2 - pos.y / 2;
    this.canvasWindow.mult(2);
    this.canvasWindow.move(this.offset.x / this.scale,
                           this.offset.y / this.scale);
    this.redraw(this.canvasWindow, this.items.get(this.zOffset));
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
      if (this.tempPoint === null) {
        this.tempPoint = new GraphicPoint(pos.x, pos.y, this.pointSize);
        this.items.get(this.zOffset)[1].add(this.tempPoint);
        this.tempPoint.redraw(this.ctx, this.offset);
      }
      this.lineBegins = true;
    } else if (type === "mouseup") {
      if (this.lineBegins) {
        let currentFloor = this.items.get(this.zOffset);

        if ( !this.tempPoint.wasClicked(pos.x, pos.y) ) {
          let nLine = new GraphicLine(this.tempPoint.pos(),
                                      new Point(pos.x, pos.y));

          currentFloor[1].delete(this.tempPoint);
          currentFloor[1].delete(this.findPoint(pos));
          currentFloor[0].add(nLine);
          this.lineBegins = false;
          this.redraw(this.tempPoint.boundingRect, currentFloor);
          this.tempPoint = null;
        } else if (this.scale < 1) {
          currentFloor[1].delete(this.tempPoint);
          this.tempPoint = null;
        }
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
          let changesArea = Object.assign(new Rectangle(0, 0, 0, 0),
                                          item.boundingRect);

          currentFloor[1].delete(item);
          this.redraw(changesArea, currentFloor);
          return;
        }
      }

      for (let item of currentFloor[0]) {
        if ( item.wasClicked(pos.x, pos.y) ) {
          let changesArea = Object.assign(new Rectangle(0, 0, 0, 0),
                                          item.boundingRect);
          this.items.get(this.zOffset)[1]
            .add( new GraphicPoint(item.firstPoint.x,
                                   item.firstPoint.y,
                                   this.pointSize) );
          this.items.get(this.zOffset)[1]
            .add( new GraphicPoint(item.secondPoint.x,
                                   item.secondPoint.y,
                                   this.pointSize) );
          currentFloor[0].delete(item);

          this.redraw(changesArea, currentFloor);
          return;
        }
      }
    }
  }

  dragCanvas(pos, type) {
    if (type === "mousedown") {
      this.isDragging = true;
      this.dragPos = pos;
      this.cursorPoint.visable = false;
      this.step();
    } else if (type === "mouseup") {
      this.isDragging = false;
      this.dragPos = null;
      this.cursorPoint.visable = true;;
      cancelAnimationFrame(this.animationID);
      this.redraw(this.canvasWindow, this.items.get(this.zOffset));
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
    } else if (button === 1) {
      // Было RealPosition
      this.dragCanvas(this.getMouseRealPosition(event), type);
    }
  }

  cursorShadow(event) {
    if (this.isDragging === true) {
      let pos = this.getMouseRealPosition(event);

      this.offset.addOffset( this.dragPos.subOffset(pos) );
      this.canvasWindow.move(this.offset.x / this.scale,
                             this.offset.y / this.scale);
      this.dragPos = pos;
    } else {
      let pos = this.getMousePosition(event);
      let startX = Math.round((pos.x) / (this.gridSize * this.scale)) *
                              (this.gridSize);
      let startY = Math.round((pos.y) / (this.gridSize * this.scale)) *
                              (this.gridSize);

      if (!this.cursorPoint.wasClicked(startX, startY)) {
        let changesArea = Object.assign(new Rectangle(0, 0, 0, 0),
                                        this.cursorPoint.boundingRect);

        this.cursorPoint.drag(startX, startY);
        this.redraw(changesArea, this.items.get(this.zOffset));
      }
    }
  }

  lineAttachment(event) {
    let pos = this.getMousePosition(event);
    let startX = Math.round((pos.x) / (this.gridSize * this.scale)) *
                            (this.gridSize);
    let startY = Math.round((pos.y) / (this.gridSize * this.scale)) *
                            (this.gridSize);

    if (this.cursorPoint.wasClicked(startX, startY)) {
      return;
    }

    let currentFloor = this.items.get(this.zOffset)[0];
    let newX = startX;
    let newY = startY;
    let minDistance = Number.MAX_SAFE_INTEGER;
    pos.divide(this.scale);

    for (let item of currentFloor) {
      if (item.pointInArea(startX, startY, 0)) {
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

    let changesArea = Object.assign(new Rectangle(0, 0, 0, 0),
                                    this.cursorPoint.boundingRect);

    this.cursorPoint.drag(newX, newY);
    this.redraw(changesArea, this.items.get(this.zOffset));
  }

  step = () => {
    this.animationID = window.requestAnimationFrame(this.step);
    let now = new Date().getTime();
    let dt = now - (this.time || now);
    this.time = now;

    this.redraw(this.canvasWindow, this.items.get(this.zOffset));
  }

  redraw(changesArea, currentFloor) {
    let realArea = Object.assign(new Rectangle(0, 0, 0, 0), changesArea);
    realArea.mult(this.scale);
    realArea.offset(-this.offset.x, -this.offset.y);
    this.ctx.clearRect(realArea.x1,
                       realArea.y1,
                       realArea.x2 - realArea.x1,
                       realArea.y2 - realArea.y1);

    // Отрисовать задний слой
    //TODO Перенести на задний слой
    if (this.scale >= 4) {
      this.drawGrid(realArea);
    }

    // Отрисовать центральный
    let redrawnArea = new Rectangle();

    for (let item of currentFloor[0]) {
      if ( item.redrawRequest(changesArea) ) {
        redrawnArea.expand(item.boundingRect);
        item.redraw(this.ctx, this.offset, this.scale);
      }
    }

    //TODO Оптимизировать, без расширения нее работает, но захватывает большую область
    // отрисовать верхний слой
    if (!this.isDragging) {
      redrawnArea.expand(changesArea);
      for (let item of currentFloor[1]) {
        if (item.redrawRequest(redrawnArea)) {
          item.redraw(this.ctx, this.offset, this.scale);
        }
      }

      if (this.cursorPoint.visable === true) {
        this.cursorPoint.redraw(this.ctx, this.offset, this.scale);
      }
    }
  }

  drawGrid(changesArea) {
    let startX = (Math.round((changesArea.x1 + this.offset.x) /
                             (this.gridSize * this.scale)) *
                            (this.gridSize * this.scale) - this.offset.x);
    let startY = (Math.round((changesArea.y1 + this.offset.y) /
                             (this.gridSize * this.scale)) *
                            (this.gridSize * this.scale) - this.offset.y);

    this.ctx.strokeStyle = "#aaa";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let i = startY; i <= changesArea.y2; i += this.gridSize * this.scale) {
      this.ctx.moveTo(changesArea.x1, i);
      this.ctx.lineTo(changesArea.x2, i);
    }
    for (let i = startX; i <= changesArea.x2; i += this.gridSize * this.scale) {
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

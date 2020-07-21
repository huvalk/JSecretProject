'use strict'

class GraphicItem {
  constructor() {
    this.type;
    this.visable = true;
    this.boundingRect;
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

//TODO сделать гетер
  type() {
    return type;
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
}

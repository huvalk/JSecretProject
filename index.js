'use strict'

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
  canvas.addEventListener('mouseup', function(event) {
    scene.mouseClick(event);
  });
  canvas.addEventListener('mousemove', function(event) {
    scene.mouseMove(event);
  });
  canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
  document.addEventListener('keydown', function(event) {
    if (event.code === "ControlLeft") {
      scene.mouseMove = scene.lineAttachment;
    }
  });
  document.addEventListener('keyup', function(event) {
    if (event.code === "ControlLeft") {
      scene.mouseMove = scene.cursorShadow;
    }
  });

  scene.mouseClick = scene.editLine;
  scene.mouseMove = scene.cursorShadow;

  scene.redraw(new Rectangle(0, 0, this.canvas.width, this.canvas.height), []);

  // Нагрузка
  // for (let i = 0; i < this.canvas.width; i += scene.gridSize) {
  //   for (let j = 0; j < this.canvas.height; j += scene.gridSize) {
  //     let nPoint = new GraphicPoint(i, j, scene.pointSize);
  //     scene.items.get(scene.zOffset).push(nPoint);
  //     nPoint.redraw(scene.ctx);
  //   }
  // }
}

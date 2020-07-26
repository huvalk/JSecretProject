'use strict'

window.onload = function() {
  //get DPI
  var PIXEL_RATIO = (function () {
      // virtual ctx only for calculation
      var ctx = document.createElement("canvas").getContext("2d"),
          dpr = window.devicePixelRatio || 1,
          bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;
      return dpr / bsr;
  })();

  var createHiDPICanvas = function(quality, w, h, ratio) {
      var can = document.createElement("canvas");
      can.id = `can_${quality}`;

      document.body.appendChild(can);
      if (!ratio) { ratio = PIXEL_RATIO; }
      can.width = w * ratio;
      can.height = h * ratio;
      can.style.width = w + "px";
      can.style.height = h + "px";
      can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
      return can;
  }
  var canvas = createHiDPICanvas('hd', 1900, 1000, 4);
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

  scene.redraw(new Rectangle(0, 0, canvas.width, canvas.height), [[], []]);
}

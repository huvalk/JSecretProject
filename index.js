'use strict'

window.onload = function() {
  //get DPI
  let PIXEL_RATIO = (function () {
      // virtual ctx only for calculation
      let ctx = document.createElement("canvas").getContext("2d"),
          dpr = window.devicePixelRatio || 1,
          bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;
      return dpr / bsr;
  })();

  let createHiDPICanvas = function(quality, w, h, ratio) {
      let can = document.createElement("canvas");
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
  let canvas = createHiDPICanvas('hd', 1900, 900, 2);
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
  canvas.addEventListener('wheel', function(event) {
    let delta = event.deltaY || event.detail || event.wheelDelta;

    if (delta < 0) {
      if (scene.scale < 16) {
        scene.zoomIn();
      }
    } else if (delta > 0) {
      if (scene.scale > 1) {
        scene.zoomOut();
      }
    }
  });
  canvas.addEventListener('mouseleave', function(event) {
    scene.reset();
  });
  document.addEventListener('keydown', function(event) {
    if (event.code === "ControlLeft") {
      scene.mouseMove = scene.lineAttachment;
    } else if (event.code === "ShiftLeft") {
      // console.log("Debug")
      // console.log("window", scene.canvasWindow)
      // console.log("offset", scene.offset)
      // console.log("cursor", scene.cursorPoint)
      console.log(scene.items.get(0))
      // console.log("zoom", scene.canvasWindow.width, scene.offset.x, scene.scale)
    }
  });
  document.addEventListener('keyup', function(event) {
    if (event.code === "ControlLeft") {
      scene.mouseMove = scene.cursorShadow;
    }
  });

  scene.mouseClick = scene.editLine;
  scene.mouseMove = scene.cursorShadow;

  // Нагрузка
  // let count = 0;
  // for (let i = 0; i < 1900; i += 30) {
  //   for (let j = 0; j < 900; j += 30) {
  //     let fPoint = new GraphicPoint(i, j, 5);
  //     let sPoint = new GraphicPoint(i + 15, j + 15, 5);
  //     // scene.items.get(scene.zOffset)[1].add(fPoint);
  //     // scene.items.get(scene.zOffset)[1].add(sPoint);
  //     let nLine = new GraphicLine(fPoint, sPoint);
  //     scene.items.get(scene.zOffset)[0].add(nLine);
  //     count++
  //     count++
  //     count++
  //   }
  //   console.log(count)
  // }

  scene.redraw(new Rectangle(0, 0, canvas.width , canvas.height), [[],[]]);
}

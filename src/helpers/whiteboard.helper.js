var canvas;
var ctx;
var mouseX;
var mouseY;
var mouseDown = 0;
var touchX, touchY;

function drawCircle(ctx, x, y, size) {
  var r = 0;
  var g = 0;
  var b = 0;
  var a = 255; //opaque
  ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

//get mouse position
function getMousePosition(moves) {
  if (!moves) var moves = event;

  if (moves.offsetX) {
    mouseX = moves.offsetX;
    mouseY = moves.offsetY;
  } else if (moves.layerX) {
    mouseX = moves.layerX;
    mouseY = moves.layerY;
  }
}

// //draw and prevent default scrolling with touch
function canvase_touchMove(moves) {
  getTouchPosition(moves);
  drawCircle(ctx, touchX, touchY, 1);

  //prevent scrolling
  event.preventDefault();
}

function getTouchPosition(moves) {
  if (!moves) {
    var moves = event;
  }

  if (moves.touches) {
    if (moves.touches.length == 1) {
      var touch = moves.touches[0]; 
      touchX = touch.pageX - touch.target.offsetLeft;
      touchY = touch.pageY - touch.target.offsetTop;
    }
  }
}

function canvase_mouseDown() {
  mouseDown = 1;
  drawCircle(ctx, mouseX, mouseY, 1);
}

function canvase_mouseUp() {
  mouseDown = 0;
}

function canvase_mouseMove(moves) {
  getMousePosition(moves);

  if (mouseDown == 1) {
    drawCircle(ctx, mouseX, mouseY, 1);
  }
}

export function whiteboardListener(canvasID) {
  canvas = document.getElementById(canvasID);
  if (canvas.getContext){
    ctx = canvas.getContext('2d');
  } 

  if (ctx) {
    canvas.addEventListener('mousedown', canvase_mouseDown, false);
    canvas.addEventListener('mousemove', canvase_mouseMove, false);
    window.addEventListener('mouseup', canvase_mouseUp, false);
    canvas.addEventListener('touchmove', canvase_touchMove, false);
  }
}

export function clearCanvas(canvasID) {
  canvas = document.getElementById(canvasID);
  
  if (canvas.getContext){
    ctx = canvas.getContext('2d');
  } 

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

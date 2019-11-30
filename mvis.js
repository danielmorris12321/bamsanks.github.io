if (!classDefined(Vector2d)) throw("Vector2d class not defined!");
if (!classDefined(Complex))  throw("Complex class not defined!");

var globals = {};

// function SamplePoint(bezierSet, p) {
//   var N = bezierSet.length / 3; // Number of curves
//   var idx = Math.floor(p * N); // Figure out which curve we are on
//   var p_sub = (p*N) % 1;  // And how far along this curve to sample
//
//   // Curves are defined relative to the last, so sum up the endpoints
//   var abs = new Vector2d(0, 0);
//   for (var i = 0; i < idx*3; i += 3) abs.add(bezierSet[i+2]);
//
//   // Now add on the point on this curve (if required!)
//   var rem = new Vector2d(0, 0);
//   if (p_sub != 0) {
//     rem = bezierPoint(rem,
//                       bezierSet[idx*3],
//                       bezierSet[idx*3+1],
//                       bezierSet[idx*3+2],
//                       p_sub);
//   }
//   return Vector2d.add(abs, rem);
// }

function drawLine(v1, v2, ctx) {
  ctx = getContext(ctx);
  if (v1 instanceof Complex) v1 = v1.toVector2d();
  if (v2 instanceof Complex) v2 = v2.toVector2d();
  //var cx = ctx.canvas.width / 2;
  //var cy = ctx.canvas.height / 2;
  //ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(v1.x, v1.y);
  ctx.lineTo(v2.x, v2.y);
  ctx.stroke();
}

// TODO: REMOVE
function bezierPoint(v1, v2, v3, v4, p) {
  va1 = v1.toward(v2, p);
  va2 = v2.toward(v3, p);
  va3 = v3.toward(v4, p);
  vb1 = va1.toward(va2, p);
  vb2 = va2.toward(va3, p);
  return vb1.toward(vb2, p);
}

function drawBezier(bezier, step, ctx, overheads) {
  overheads = ifUndefined(overheads, false);
  step = ifUndefined(step, 0.02);
  ctx = getContext(ctx);
  if (overheads) ctx.beginPath();
  if (overheads) ctx.moveTo(bezier.v1.x, bezier.v1.y);
  for (x = 0; x <= 1; x += step) {
    //b = new Bezier(v1, v2, v3, v4);
    np = bezier.SamplePoint(x); //bezierPoint(v1, v2, v3, v4, x);
    ctx.lineTo(np.x, np.y);
  }
  if (overheads) ctx.stroke();
}

function DrawGraphic(bezierData, center) {
  var v = bezierData.beziers; // To avoid repeating
  var v1, v2, v3;
  var lastEndPoint = center;
  getContext().moveTo(center.x, center.y);
  for (var i = 0; i < v.length; i++) {
    //v1 = Vector2d.add(lastEndPoint, v[i]);
    //v2 = Vector2d.add(lastEndPoint, v[i+1]);
    //v3 = Vector2d.add(lastEndPoint, v[i+2]);
    drawBezier(v[i]);
    lastEndPoint = v3;
  }
  getContext().stroke();
}

function resizeCanvas(ctx, width, height) {
  ctx = getContext(ctx);
  if (!isDefined(ctx)) return;
  ctx.canvas.width  = ifUndefined(width, window.innerWidth);
  ctx.canvas.height = ifUndefined(height, window.innerHeight);
}

window.onload = function() {
  globals.context = document.getElementById("main").getContext("2d");
  resizeCanvas();
  var center = new Vector2d(250, 30);
  globals.context.strokeStyle = "#888";
  DrawGraphic(graphicsDefs.eighthNote, center);
  globals.context.strokeStyle = "#000";
}

window.onresize = function() {
  resizeCanvas();
}


// DISCRETE FOURIER TRANSFORM

function dft(x) {
  var N = x.length;
  var coeff = [];
  var expFac, part;
  for (var i = 0; i < N; i++) {
    coeff[i] = new Complex();
    k = i - (N-1)/2;
    for (var n = 0; n < N; n++) {
      expFac = new Complex(Math.cos(2*Math.PI/N*k*n), -Math.sin(2*Math.PI/N*k*n));
      part = Complex.multiply(x[n], expFac);
      coeff[i] = Complex.add(coeff[i], part);
    }
  }
  return coeff;
}

function approx(coeff, n, accuracy) {
  var N = coeff.length;
  accuracy = ifUndefined(accuracy, (N-1)/2);
  var total = new Complex();
  var part;
  for (var k = 0; k < accuracy; k++) {
    i = k + (N-1)/2;
    part = new Complex(Math.cos(2*Math.PI*n*k/N), Math.sin(2*Math.PI*n*k/N));
    total = Complex.add(total, Complex.multiply(coeff[i], part));

    if (k > 0) {
      i = (N-1)/2 - k;
      part = new Complex(Math.cos(2*Math.PI*n*k/N), -Math.sin(2*Math.PI*n*k/N));
      total = Complex.add(total, Complex.multiply(coeff[i], part));
    }
  }
  return Complex.divide(total, N);
}


var center = new Vector2d(250, 30);

numSamples = 101;
ac = [];
for (var i = 0; i < numSamples; i++) {
  ac.push(graphicsDefs.eighthNote.SamplePoint(i / (numSamples-1)).toComplex());
}

coeff = dft(ac);

globals.tick = 0;
globals.step = 0.5;

function iterate() {
  var v1 = approx(coeff, globals.tick, globals.accuracy);
  var v2 = approx(coeff, globals.tick+globals.step, globals.accuracy);
  //var v1 = SamplePoint(graphicsDefs.eighthNote, globals.tick).add(center);
  //var v2 = SamplePoint(graphicsDefs.eighthNote, globals.tick+globals.step).add(center);
  globals.tick += globals.step;
  drawLine(v1, v2);
}

function play() {
  globals.accuracy = parseInt(document.getElementById("accuracy").value);

  getContext().clearRect(0, 0, 2000, 2000);

  var center = new Vector2d(250, 30);
  globals.context.strokeStyle = "#888";
  DrawGraphic(graphicsDefs.eighthNote, center);
  globals.context.strokeStyle = "#000";

  loop();
}

function loop(max, i) {
  max = ifUndefined(numSamples*2);
  i = ifUndefined(i, 0);
  if (i >= max) return;
  iterate();
  setTimeout(() => { loop(max, i+1) }, 10);
}

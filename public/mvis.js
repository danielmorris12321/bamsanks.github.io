if (!classDefined(Vector2d)) throw("Vector2d class not defined!");
if (!classDefined(Complex))  throw("Complex class not defined!");

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

function DrawGraphic(bezierData) {
  var v = bezierData.beziers; // To avoid repeating
  var ctx = getContext();
  ctx.beginPath();
  ctx.moveTo(v[0].v1.x, v[0].v1.y);
  for (var i = 0; i < v.length; i++) {
    drawBezier(v[i]);
  }
  getContext().stroke();
}






// MESS BEGINS...

function createCoeffs(data, numSamples) {
  var ac = [];
  for (var i = 0; i < numSamples; i++) {
    ac.push(data.SamplePoint(i / (numSamples-1)).toComplex());
  }
  return dft(ac);
}
globals.numSamples = 15;
globals.vectorName = "eighthNote";
globals.selectedVector = globals.graphicsDefs[globals.vectorName];
globals.coeff = createCoeffs(globals.selectedVector, globals.numSamples);

function iterate() {
  var v1 = approx(globals.coeff, globals.tick, globals.accuracy);
  var v2 = approx(globals.coeff, globals.tick+globals.step, globals.accuracy);
  globals.tick += globals.step;
  drawLine(v1, v2);
}

function drawOutline() {
  globals.context.strokeStyle = "#aaa";
  DrawGraphic(globals.selectedVector);
  globals.context.strokeStyle = "#000";
}

function clearCanvas() {
  var ctx = getContext();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function loop(max, i) {
  max = ifUndefined(max, globals.numSamples/globals.step);
  i = ifUndefined(i, 0);
  if (i >= max) return;
  iterate();
  setTimeout(() => { loop(max, i+1) }, 10);
}

// Path definition - points are relative and define Bézier curves
v = [[14.31979,21.13649],
[21.68218,46.72843],
[40.13541,64.98241],
[21.13477,27.83462],
[48.14623,50.89072],
[69.08885,79.05807],
[15.15655,19.68077],
[31.77102,40.59925],
[36.07436,65.35699],
[11.58719,31.7567],
[6.55595,67.40891],
[-5.80561,98.49818],
[-13.94701,16.76487],
[-23.48233,-4.93192],
[-19.58905,-18.3652],
[0.59324,-18.53529],
[0.32293,-37.0207],
[-6.78594,-54.52813],
[-6.30471,-26.25474],
[-17.83413,-51.10108],
[-37.13626,-70.36568],
[-16.77226,-14.70084],
[-35.81289,-47.09468],
[-61.38161,-35.94125],
[-16.88486,10.63667],
[-9.52893,32.13945],
[-11.34625,48.7119],
[-1.00349,101.95104],
[-1.0707,203.94409],
[-2.70053,305.8661],
[-1.24608,42.80949],
[-38.24711,71.52942],
[-72.88028,89.90822],
[-30.85392,18.56748],
[-67.79454,28.96551],
[-103.60859,20.69063],
[-33.3036,-3.41726],
[-67.75581,-27.72972],
[-68.4537,-63.70404],
[-2.22037,-41.7108],
[27.90419,-80.5523],
[64.98849,-97.02378],
[36.40406,-20.74876],
[82.42945,-25.24594],
[121.63079,-10.33095],
[19.1562,6.05494],
[24.48328,-11.72109],
[26.87355,-28.81947],
[2.21226,-129.76981],
[3.98291,-259.54448],
[4.43537,-389.3337],
[0.36593,-12.97349],
[21.49606,-16.13939],
[26.461,-4.6603]]



var globals = {};

// TODO: Vector2d and Complex are very similar - merge?
class Vector2d {
  constructor(x, y) {
    if (typeof y == "undefined" && x instanceof Array && x.length == 2) {
      this.x = x[0];
      this.y = x[1];
    } else {
      this.x = ifUndefined(x, 0);
      this.y = ifUndefined(y, 0);
    }
  }
  static add(v1, v2) {
    return new Vector2d(v1.x + v2.x, v1.y + v2.y);
  }
  static subtract(v1, v2) {
    return new Vector2d(v1.x - v2.x, v1.y - v2.y);
  }
  // TODO: make static?
  toward(v, p) {
    var nx = this.x * (1-p) + v.x * p;
    var ny = this.y * (1-p) + v.y * p;
    return new Vector2d(nx, ny);
  }
  toString() {
    return "(" + this.x + ", " + this.y + ")";
  }
  toComplex() {
    return new Complex(this.x, this.y);
  }
}

class Complex {
  constructor(re, im) {
    this.re = ifUndefined(re, 0);
    this.im = ifUndefined(im, 0);
  }

  toString() {
    var sign = (this.im < 0) ? "" : "+";
    return this.re + sign + this.im + "i";
  }

  static force(x) {
    if (x instanceof Complex) return x;
    if (typeof x == "number") return new Complex(x, 0);
    warn("Unable to force input to be Complex");
  }

  static add(c1, c2) {
    c1 = Complex.force(c1);
    c2 = Complex.force(c2);
    var re = c1.re + c2.re;
    var im = c1.im + c2.im;
    return new Complex(re, im);
  }

  static subtract(c1, c2) {
    c1 = Complex.force(c1);
    c2 = Complex.force(c2);
    var re = c1.re - c2.re;
    var im = c1.im - c2.im;
    return new Complex(re, im);
  }

  static multiply(c1, c2) {
    c1 = Complex.force(c1);
    c2 = Complex.force(c2);
    var re = c1.re * c2.re - c1.im * c2.im;
    var im = c1.re * c2.im + c1.im * c2.re;
    return new Complex(re, im);
  }

  static divide(c1, c2) {
    c1 = Complex.force(c1);
    c2 = Complex.force(c2);
    var den = c2.re * c2.re + c2.im * c2.im;
    var re = (c1.im * c2.im + c1.re * c2.re) / den;
    var im = (c1.im * c2.re - c1.re * c2.im) / den;
    return new Complex(re, im);
  }

  toVector2d() {
    return new Vector2d(this.re, this.im);
  }
}



// function InterpolateLots(bez, step) {
//   var n = (bez.length-1)/3;
//   var points = [];
//   var lp = new Vector2d();
//   var lastIdx = 0;
//   for (var k = 0; k < n; k += step) {
//     idx = Math.floor(k);
//     if (idx != lastIdx) lp = Vector2d.add(lp, v4);
//     v1 = new Vector2d(0, 0); // new Vector2d((idx == 0) ? [0, 0] : bez[idx*3-1]);
//     v2 = new Vector2d(bez[idx*3]);
//     v3 = new Vector2d(bez[idx*3+1]);
//     v4 = new Vector2d(bez[idx*3+2]);
//     relPoint = bezierPoint(v1, v2, v3, v4, k % 1);
//
//     absPoint = Vector2d.add(lp, relPoint);
//     lastIdx = idx;
//     points.push(absPoint);
//   }
//   return points;
// }

function InterpolateLots(bez, step) {
  var n = (bez.length-1)/3;
  var points = [];
  var lastIdx = 0;
  for (var k = 0; k < n; k += step) {
    idx = Math.floor(k);
    v1 = bez[idx*3  ]; // new Vector2d((idx == 0) ? [0, 0] : bez[idx*3-1]);
    v2 = bez[idx*3+1];
    v3 = bez[idx*3+2];
    v4 = bez[idx*3+3];
    absPoint = bezierPoint(v1, v2, v3, v4, k % 1);
    points.push(absPoint);
  }
  return points;
}

function isDefined(x) {
  return (typeof x !== "undefined");
}

function ifUndefined(x, def) {
  return isDefined(x) ? x : def;
}

function getContext(ctx) {
  return ifUndefined(ctx, globals.context);
}

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

function bezierPoint(v1, v2, v3, v4, p) {
  va1 = v1.toward(v2, p);
  va2 = v2.toward(v3, p);
  va3 = v3.toward(v4, p);
  vb1 = va1.toward(va2, p);
  vb2 = va2.toward(va3, p);
  return vb1.toward(vb2, p);
}

function bezierTo(v1, v2, v3, v4, step, ctx) {
  step = ifUndefined(step, 0.01);
  ctx = getContext(ctx);
  for (x = 0; x <= 1; x += 0.02) {
    np = bezierPoint(v1, v2, v3, v4, x);
    ctx.lineTo(np.x, np.y);
  }
}

function t() {
  var lp = new Vector2d(250,30);
  getContext().moveTo(lp.x, lp.y);
  for (var i = 0; i < v.length; i += 3) {
    v1 = Vector2d.add(lp, new Vector2d(v[i][0], v[i][1]));
    v2 = Vector2d.add(lp, new Vector2d(v[i+1][0], v[i+1][1]));
    v3 = Vector2d.add(lp, new Vector2d(v[i+2][0], v[i+2][1]));
    console.log(v3.toString());
    bezierTo(lp, v1, v2, v3);
    lp = v3;
  }
  getContext().stroke();
}


function draw() {
  globals.context;
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
  draw();
  //t();
}

window.onresize = function() {
  resizeCanvas();
}


// DISCRETE FOURIER TRANSFORM

function dft(x) {
  var N = x.length;
  var coeff = [];
  var expFac, part;
  for (var k = 0; k < N; k++) {
    coeff[k] = new Complex();
    for (var n = 0; n < N; n++) {
      expFac = new Complex(Math.cos(2*Math.PI/N*k*n), -Math.sin(2*Math.PI/N*k*n));
      part = Complex.multiply(x[n], expFac);
      coeff[k] = Complex.add(coeff[k], part);
    }
  }
  return coeff;
}

function approx(coeff, n) {
  var N = coeff.length;
  var total = new Complex();
  var part;
  for (var k = 0; k < N; k++) {
    part = new Complex(Math.cos(2*Math.PI*n*k/N), Math.sin(2*Math.PI*n*k/N));
    total = Complex.add(total, Complex.multiply(coeff[k], part));
  }
  return Complex.divide(total, N);
}

// Make vector set absolute
v_abs = [];
point = new Vector2d();
v_abs.push(point);
for (var k = 0; k < v.length; k += 3) {
  v_abs.push(Vector2d.add(point, new Vector2d(v[k  ])));
  v_abs.push(Vector2d.add(point, new Vector2d(v[k+1])));
  v_abs.push(Vector2d.add(point, new Vector2d(v[k+2])));
  point = v_abs[v_abs.length - 1];
}

// Absolute
ac = [];
var center = new Vector2d(250, 30);
//ac.push(new Complex(sx, sy));
v_large = InterpolateLots(v_abs, 0.1);
for (var i = 0; i < v_large.length; i += 1) {
  //sx = v_large[i].x;
  //sy = v_large[i].y;
  ac.push(Vector2d.add(center, v_large[i]).toComplex());
}

coeff = dft(ac);

globals.tick = 0;
globals.step = 1;

function iterate() {
  var v1 = approx(coeff, globals.tick);
  var v2 = approx(coeff, globals.tick+globals.step);
  globals.tick += globals.step;
  drawLine(v1, v2);


  // drawLine(Vector2d.add(center, v_large[globals.tick]), Vector2d.add(center, v_large[globals.tick+1]));
  // globals.tick += 1;
}




// TEMPORARY FOR CHECKING!
point = new Vector2d(250, 30);
av = [];
av.push(point);
for (var k = 0; k < v.length; k+=3) {
  point = Vector2d.add(point, new Vector2d(v[k+2]));
  av.push(point);
}

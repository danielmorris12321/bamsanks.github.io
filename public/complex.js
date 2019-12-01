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
    console.warn("Unable to force input to be Complex");
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

// Inverse DFT
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

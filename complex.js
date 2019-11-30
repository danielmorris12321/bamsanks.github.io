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

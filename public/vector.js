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
  add(v) {
    this.x += v.x; this.y += v.y;
    return this;
  }
  multiply(scalar) {
    this.x *= scalar; this.y *= scalar;
    return this;
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


class Bezier {
  constructor(v1, v2, v3, v4) {
    if (v1 instanceof Array && !isDefined(v2) && !isDefined(v3) && !isDefined(v4)) {
      if (v.length != 4) throw("Four vectors are required to create a Bezier curve!");
      this._constructor_vectors(v[0], v[1], v[2], v[3]);
    } else {
      this._constructor_vectors(v1, v2, v3, v4);
    }
  }

  _constructor_vectors(v1, v2, v3, v4) {
    if (!v1 instanceof Vector2d) throw("v1 is not a vector!");
    if (!v2 instanceof Vector2d) throw("v2 is not a vector!");
    if (!v3 instanceof Vector2d) throw("v3 is not a vector!");
    if (!v4 instanceof Vector2d) throw("v4 is not a vector!");
    this.v1 = v1; this.v2 = v2; this.v3 = v3; this.v4 = v4;
  }

  move(by) {
    this.v1 = this.v1.add(by);
    this.v2 = this.v2.add(by);
    this.v3 = this.v3.add(by);
    this.v4 = this.v4.add(by);
    return this;
  }

  multiply(by) {
    this.v1 = this.v1.multiply(by);
    this.v2 = this.v2.multiply(by);
    this.v3 = this.v3.multiply(by);
    this.v4 = this.v4.multiply(by);
    return this;
  }

  SamplePoint(p) {
    var va1 = this.v1.toward(this.v2, p);
    var va2 = this.v2.toward(this.v3, p);
    var va3 = this.v3.toward(this.v4, p);
    var vb1 = va1.toward(va2, p);
    var vb2 = va2.toward(va3, p);
    return vb1.toward(vb2, p);
  }
}

class BezierSet {
  constructor(b) {
    if (b instanceof Bezier) b = [b];
    if (!b instanceof Array) throw("Expecting either a Bezier curve, or an array of Bezier curves");
    this.beziers = b;
  }

  SamplePoint(p) {
    var N = this.beziers.length; // Number of curves
    var idx = Math.floor(p * N); // Figure out which curve we are on
    var p_sub = (p * N) % 1;  // And how far along this curve to sample
    if (p == 1) {
      // Special case where sample tries to look for a Bezier curve that doesn't exist
      return this.beziers[idx-1].v4;
    } else {
      return this.beziers[idx].SamplePoint(p_sub);
    }
  }
}

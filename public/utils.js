var globals = {};

function classDefined(c) {
  return typeof Vector2d === "function" && typeof Vector2d.constructor === "function"
}

function isDefined(x) {
  return (typeof x !== "undefined" && x !== null);
}

function ifUndefined(x, def) {
  return isDefined(x) ? x : def;
}

function getContext(ctx) {
  return ifUndefined(ctx, globals.context);
}

function makeOdd(x) {
  if (x % 1 != 0) {
    x = Math.floor(x);
    if (x % 2 == 1) return x;
    return x + 1;
  }
  if (x % 2 == 1) return x;
  return (x % 4 == 0) ? x + 1 : x - 1
}

function classDefined(c) {
  return typeof Vector2d === "function" && typeof Vector2d.constructor === "function"
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

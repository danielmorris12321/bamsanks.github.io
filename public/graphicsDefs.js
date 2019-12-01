// SVGs are defined relative to the last point
graphicsDefs = {
  eighthNote: [
    [ 14.31979,   21.13649], [ 21.68218,   46.72843], [  40.13541,   64.98241],
    [ 21.13477,   27.83462], [ 48.14623,   50.89072], [  69.08885,   79.05807],
    [ 15.15655,   19.68077], [ 31.77102,   40.59925], [  36.07436,   65.35699],
    [ 11.58719,   31.7567 ], [  6.55595,   67.40891], [-  5.80561,   98.49818],
    [-13.94701,   16.76487], [-23.48233, -  4.93192], [- 19.58905, - 18.3652],
    [  0.59324, - 18.53529], [  0.32293, - 37.0207],  [-  6.78594, - 54.52813],
    [- 6.30471, - 26.25474], [-17.83413, - 51.10108], [- 37.13626, - 70.36568],
    [-16.77226, - 14.70084], [-35.81289, - 47.09468], [- 61.38161, - 35.94125],
    [-16.88486,   10.63667], [- 9.52893,   32.13945], [- 11.34625,   48.7119],
    [- 1.00349,  101.95104], [- 1.0707 ,  203.94409], [-  2.70053,  305.8661],
    [- 1.24608,   42.80949], [-38.24711,   71.52942], [- 72.88028,   89.90822],
    [-30.85392,   18.56748], [-67.79454,   28.96551], [-103.60859,   20.69063],
    [-33.3036 , -  3.41726], [-67.75581, - 27.72972], [- 68.4537 , - 63.70404],
    [- 2.22037, - 41.7108 ], [ 27.90419, - 80.5523],  [  64.98849, - 97.02378],
    [ 36.40406, - 20.74876], [ 82.42945, - 25.24594], [ 121.63079, - 10.33095],
    [ 19.1562 ,    6.05494], [ 24.48328, - 11.72109], [  26.87355, - 28.81947],
    [  2.21226, -129.76981], [  3.98291, -259.54448], [   4.43537, -389.3337],
    [  0.36593, - 12.97349], [ 21.49606, - 16.13939], [  26.461  , -  4.6603]]
}

// Turn all curves into BezierSet objects
var key;
for (var i in Object.keys(graphicsDefs)) {
  key = Object.keys(graphicsDefs)[i]
  lastEndPoint = new Vector2d(250, 60);
  beziers = [];
  obj = graphicsDefs[key];
  for (var j = 0; j < obj.length; j += 3) {
    bezier = new Bezier(
      new Vector2d(),
      new Vector2d(obj[j]),
      new Vector2d(obj[j+1]),
      new Vector2d(obj[j+2])).multiply(0.8).move(lastEndPoint);
    lastEndPoint = bezier.v4;
    beziers.push(bezier);
  }
  graphicsDefs[key] = new BezierSet(beziers);
}
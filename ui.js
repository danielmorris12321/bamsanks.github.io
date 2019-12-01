function resizeCanvas(ctx, width, height) {
  ctx = getContext(ctx);
  if (!isDefined(ctx)) return;
  ctx.canvas.width  = ifUndefined(width, window.innerWidth);
  ctx.canvas.height = ifUndefined(height, window.innerHeight);
  if (globals.showOutline) drawOutline();
}

function setInputDefaults() {
  globals.clearBeforeDraw = true;
  globals.showOutline = true;

  document.getElementById("clear").checked = globals.clearBeforeDraw;
  document.getElementById("outline").checked = globals.showOutline;

  document.getElementById("accuracy").value = 2;
  document.getElementById("accuracy").min = 2;

  document.getElementById("samples").value = globals.numSamples;
  document.getElementById("samples").min = 2;
  document.getElementById("samples").max = 10000;

  updateInputRanges();
}

function updateInputRanges() {
  document.getElementById("accuracy").max = (globals.numSamples+1)/2;
}

function play_click() {
  if (globals.numSamples != globals.lastNumSamples) {
    globals.coeff = createCoeffs(graphicsDefs.eighthNote, globals.numSamples);
    globals.lastNumSamples = globals.numSamples;
  }
  globals.accuracy = parseInt(document.getElementById("accuracy").value);
  globals.tick = 0;
  globals.step = globals.numSamples/200;
  if (globals.accuracy*2 > globals.numSamples+1) {
    alert("The maximum accuracy allowed for this number of samples is " + ((globals.numSamples+1)/2));
    return;
  }
  if (globals.clearBeforeDraw) {
    clearCanvas();
    if (globals.showOutline) drawOutline();
  }
  setTimeout(loop, 100);
}

function samples_change() {
  globals.numSamples = makeOdd(parseInt(document.getElementById("samples").value));
  if (globals.numSamples > 2) updateInputRanges();
}

function clear_change() {
  globals.clearBeforeDraw = document.getElementById("clear").checked == true;
}

function outline_change() {
  globals.showOutline = document.getElementById("outline").checked == true;
  clearCanvas();
  if (globals.showOutline) drawOutline();
}

function attachListeners() {
  document.getElementById("clear").onchange = clear_change;
  document.getElementById("outline").onchange = outline_change;
  document.getElementById("play").onclick = play_click;
  document.getElementById("accuracy").onkeydown = (e) => { if (e.keyCode == 13) play_click() };
  document.getElementById("samples").onkeydown  = (e) => { if (e.keyCode == 13) play_click() };
  document.getElementById("samples").onchange = samples_change;
}

function initialiseCanvas() {
  globals.canvas = document.getElementById("main")
  globals.context = globals.canvas.getContext("2d");
}

window.onload = function() {
  initialiseCanvas();
  attachListeners();
  setInputDefaults();
  resizeCanvas();
}

window.onresize = function() {
  resizeCanvas();
}

function getXML(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false); // false for synchronous request
  xmlHttp.send(null);
  svgRaw = xmlHttp.responseText;

  var parser = new DOMParser();
  return parser.parseFromString(svgRaw, "text/xml");
}

function getBeziersFromSVG(url) {
  var xmlDoc = getXML(url);
  var pathDefinition = xmlDoc.getElementsByTagName("path")[0].attributes.d.value;
  pathDefinition = pathDefinition.split(" ");

  var c = 0;
  var v = [new Vector2d()];
  var bez = [];

  for (var i in pathDefinition) {
    ch = pathDefinition[i];
    if (ch == "m") {
      parsing = "center";
    } else if (ch == "c") {
      parsing = "curves";
    } else if (ch == "z") {
      parsing = "";
      break;
    } else {
      if (parsing == "center" || parsing == "curves") {
        vecstr = ch.split(",");
        v[c] = new Vector2d(parseFloat(vecstr[0]), parseFloat(vecstr[1])).add(v[0]);
      }
      c = (c + 1) % 4;
      if (c == 0) {
        bez.push(new Bezier(v));
        v[0] = v[3];
        c = 1;
      }
    }
  }
  return new BezierSet(bez);

}

globals.graphicsDefs = {}
globals.graphicsDefs.eighthNote = getBeziersFromSVG("/public/svg/eighth_note.svg");
globals.graphicsDefs.pi         = getBeziersFromSVG("/public/svg/pi.svg");

var fs      = require('fs');
var express = require('express');
var http    = require('http');
var https   = require('https');
var path    = require('path');

var privateKey  = fs.readFileSync('certs/privkey.pem',   'utf8');
var certificate = fs.readFileSync('certs/fullchain.pem', 'utf8');

var credentials = { key: privateKey, cert: certificate };

var httpApp = express();
var app = express();

AUTHENTICATING_CERTS = false;

if (!AUTHENTICATING_CERTS) {
  httpApp.get('*', (req, res) => {
    res.redirect('https://' + req.headers.host + req.url);
  });
}

if (AUTHENTICATING_CERTS) {
httpApp.get('/.well-known/*', (req, res) => {
  console.log(req.url);
  absolutePath = makeAbsolute(req.url);
  if (fs.existsSync(absolutePath))
  {
    res.sendFile(absolutePath);
  } else {
    res.sendStatus(404)
  }
})
}

app.get('/', (req, res) => {
  res.sendFile(makeAbsolute('index.htm'));
});

app.get('/favicon.png', (req, res) => {
    res.sendFile(makeAbsolute('images/icon.png'));
})

app.get('/public/*', (req, res) => {
  console.log(req.url);
  absolutePath = makeAbsolute(req.url);
  if (fs.existsSync(absolutePath))
  {
    res.sendFile(absolutePath);
  } else {
    res.sendStatus(404)
  }
})

app.get(('/message/*'), (req, res) => {
  res.send("message received: " + req.url);
  var message = req.url.substr(req.url.indexOf("/", 1)+1);
  console.log(unescape(message))
})

portHttp  = 8080;
portHttps = 8443;
var httpServer  = http.createServer(httpApp);
var httpsServer = https.createServer(credentials, app);
httpServer.listen(portHttp);
httpsServer.listen(portHttps);

console.log("Listening on port " + portHttp  + " (http)");
console.log("Listening on port " + portHttps + " (https)");

makeAbsolute = (relativePath) => {
  return path.join(__dirname, relativePath);
}

// establishConnection(mongo);

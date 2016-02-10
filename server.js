//jshint node: true
var connect       = require('connect'),
    http          = require('http'),
    bodyParser    = require('body-parser'),
    path          = require('path'),
    replaceStream = require('replacestream'),
    serveStatic   = require('serve-static'),
    fs          = require('fs'),
    app, port, host;
process.on('uncaughtException', function (err) {
  "use strict";
  console.error("Uncaught Exception");
  console.error(err);
  console.error(err.stack);
});

app = connect();
app.use(bodyParser.json());
port = process.env.PORT || 9252;
host = process.env.HOST || "127.0.0.1";

// Override default app configuration
//app.use('/js/default.js', function (req, res) {
//  "use strict";
//  res.setHeader('Content-Type', 'text/javascript');
//  fs.createReadStream(path.join(__dirname, '/public/public.js')).pipe(res);
//});

app.use('/', function (req, res, next) {
  "use strict";
  var main;
  console.log(req.url);
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream(path.join(__dirname, 'static-laverna/index.html'))
      .pipe(replaceStream('</body>', '<script src="cozy.js"></script></body>'))
      .pipe(res);
  } else if (req.url === '/cozy.js') {
    res.setHeader('Content-Type', 'text/javascript');
    fs.createReadStream(path.join(__dirname, 'cozy.js'))
      .pipe(res);
  } else if (req.url === '/scripts/main.js'){
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    next();
  } else if (/main.js/.test(req.url)) {
    console.log(req.url);
    main = req.url.split('/').pop();
    res.setHeader('Content-Type', 'text/javascript');
    fs.createReadStream(path.join(__dirname, 'static-laverna', 'scripts', main))
      // set storage to remoteStorage
      .pipe(replaceStream('cloudStorage:"0"', 'cloudStorage:"remotestorage"'))
      // hotfix of a bug in Laverna
      .pipe(replaceStream('notebookId:{type:"string"}', 'notebookId:{type:"number"}'))
      .pipe(res);
  } else {    
    next();
  }
});

// Serve static content
app.use(serveStatic(path.join(__dirname, '/static-laverna')));

// Starts the server itself
http.createServer(app).listen(port, host, function () {
  "use strict";
  console.log("Server listening to %s:%d", host, port);
});

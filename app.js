/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	api = require('./lib/api.js'),
	io = require('socket.io');

var app = module.exports = express.createServer();



io = io.listen(app);

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get ('/country-detail/:id', function (req, res) {
	api.Request({result:'geo', pagesize:50, country:req.params.id})
		.on('success', function (data) {
			var activities = data['iata-activity'];

			res.send(data);
		}).end();
});

// app.get('/data/*', function(req,res){
	// console.log (req);
	// res.send(req);
  // api.Request({result:'geo', pagesize:50})
  // .on('success', function(data){
  //   var activities = data['iati-activity'];

  //   //just send it straight to the client
  //   res.send(data);

  // }).end();
// });

io.sockets.on('connection', function (socket) {
	console.log('connect!');
	socket.on('echo', function (data) {
		socket.emit ('echo', {message: data});
	});
});



app.listen(process.env.PORT|| 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

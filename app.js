/**
 * Module dependencies.
 */

var express = require('express'),
	api = require('./lib/api.js'),
	io = require('socket.io');

var app = module.exports = express.createServer();



io = io.listen(app);

if (process.env.USE_XHTTPR) {
	  io.configure(function () {
	  io.set("transports", ["xhr-polling"]);
	  io.set("polling duration", 10);
	});
}

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

io.sockets.on('connection', function (socket) {
	socket.on('api', function (data) {
		api.Request(data.params)
			.on('success', function (response) {
				socket.emit ('api', {cb:data.cb,response:response});
			})
			.on('error', function(error){
			  socket.emit ('api', {cb:data.cb,error:error});
			}).end();
	});
});


// api proxy
app.get('/api', function(req, res){
	
	// cache for an hour
	res.header('Cache-Control', 'public, max-age=3600');
	
	api.Request(req.query)
		.on('success', function(data){
			res.json(data);
		})
		.on('error', function(err){
			res.json({error:err});
		})
		.end();
});



app.listen(process.env.PORT|| 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

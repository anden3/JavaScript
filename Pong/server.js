var gameport = process.env.PORT || 4004,
    verbose = true,

    UUID = require('node-uuid'),
    app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/*', function(req, res, next) {
	var file = req.params[0];
	
	if (verbose) {
		console.log('\t :: Express :: file requested : ' + file);
	}
	
	res.sendFile(__dirname + '/' + file);
});

io.on('connection', function(client) {
	client.userid = UUID();
	
	client.emit('onconnected', { id: client.userid });
	
	console.log('\t socket.io:: player ' + client.userid + ' connected');
	
    client.on('disconnect', function(){
    	console.log('\t socket.io:: client disconnected ' + client.userid);
	});
});
    
http.listen(gameport, function(){
	console.log('listening on *:' + gameport);
});

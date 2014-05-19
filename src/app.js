'use strict';
var express = require('express');
var app = express();
var conf = require('./conf/conf');
var logger = require('./core/logger');
var RamlRepository = require('./core/ramlRepository');
var RamlRoutes = require('./routes/ramlRoutes');

// configure repository
var repository = new RamlRepository(conf.MONGO_URL, conf.MONGO_COLLECTION);
repository.connect();

// app conf
// development only : set a NODE_ENV=development env variable on your dev machine
// or run with NODE_ENV=development node app.js
app.configure('development', function(){
	logger.getInstance().info('api-store application is configured in development mode.');
	app.use(express.static(__dirname + '/../../client/src'));
    app.use('/components', express.static(__dirname + '/../../client/components'));
});
// production only : run with NODE_ENV=production node app.js
app.configure('production', function(){
	logger.getInstance().info('api-store application is configured in production mode.');
	app.use(express.static(__dirname + '/../../client/dist'));
});
app.use(express.bodyParser());
app.use(express.methodOverride());

// ## CORS middleware
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);

// configure routes
var routes = new RamlRoutes(repository);

app.get('/files', routes.findAllFiles);
app.get('/files/:id', routes.findFileById);
app.get('/files/:id/content', routes.findFileContentById);
app.post('/files', routes.createFile);
app.put('/files/:id', routes.updateFile);
app.delete('/files/:id', routes.deleteFile);

// shutdown hook
var cleanup = function () {
	logger.getInstance().info('api-store application is shutting down...');
    repository.close();
    process.exit();
};
// SIGTERM signal is emitted with the command kill numberOfProcess for example
process.on('SIGTERM', cleanup);
// SIGINT is emitted with CTRL+C
process.on('SIGINT', cleanup);

// start server
var port = process.env.PORT || conf.APPLICATION_PORT;
app.listen(port);
logger.getInstance().info('Express server listening on port ' + port + ' for the api-store application.');

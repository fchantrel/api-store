'use strict';
var logger = require('../core/logger');
/**
* Routes of the API
* @class RamlRoutes
* @constructor
* @param {RamlRepository} ramlRepo - the repository
* @module routes
*/
var RamlRoutes = function(ramlRepo) {

var _createFile = function(req, res) {
	logger.getInstance().debug('dans createFile ...');
	var file = req.body;
	logger.getInstance().debug('file to be created : ' + JSON.stringify(file));
	ramlRepo.insert(file, function() {
		res.header("Access-Control-Allow-Origin", "*");
		res.status(201).send();
	});
};

var _textSearch = function(req, res) {
	var query = req.params.like ? {"textSearch": new RegExp(req.params.textSearch, "i")} : {};
	var limit = req.query.limit || "12";
	var skip = req.query.skip || "0";
	ramlRepo.find(query, parseInt(limit, 10), parseInt(skip, 10), function(files) {
		res.header("Access-Control-Allow-Origin", "*");
		res.status(200).send(files);
	});
};

var _findAllFiles = function(req, res) {
	logger.getInstance().debug('dans findAllFiles ...');
	var limit = req.query.limit || "50";
	var skip = req.query.skip || "0";
	ramlRepo.find({}, parseInt(limit, 10), parseInt(skip, 10), function(files) {
		res.header("Access-Control-Allow-Origin", "*");
		res.status(200).send(files);
	});
};

var _findFileById = function(req, res) {
	logger.getInstance().debug('dans findFileById ...');
	var id = req.params.id;
	if((id) && (id !== undefined) && (id!=='undefined')){
		ramlRepo.findById(id, function(file) {
			res.header("Access-Control-Allow-Origin", "*");
			res.status(200).send(file);
		});
	} else {
		res.header("Access-Control-Allow-Origin", "*");
        res.send('{"path":"/Untitled-1.raml","name":"Untitled-1.raml","content":"#%25RAML%200.8%0Atitle:","type":"file","lastUpdated":"2014-04-15T08:51:41.986Z"}');
	}
};

var _findFileContentById = function(req, res) {
	logger.getInstance().debug('dans findFileContentById ...');
	var id = req.params.id;
	ramlRepo.findById(id, function(file) {
		res.header("Access-Control-Allow-Origin", "*");
		res.status(200).send(file.content);
	});
};

var _updateFile = function(req, res) {
	logger.getInstance().debug('dans updateFile ...');
	var id = req.params.id;
	var file = req.body;

	logger.getInstance().debug('file to be updated : ' + JSON.stringify(file));

	ramlRepo.update(id, file, function() {
		res.header("Access-Control-Allow-Origin", "*");
		res.status(200).send('{"status":"success","id":"'+id+'","message":"The file was successfully updated."}');
	});
};

var _deleteFile = function(req, res) {
	logger.getInstance().debug('dans deleteFile ...');
	var id = req.params.id;
	ramlRepo.deleteById(id, function(result) {
		logger.getInstance().debug('' + result + ' file(s) deleted');
		res.header("Access-Control-Allow-Origin", "*");
		res.status(200).send(req.body);
	});
};

return {
	textSearch : _textSearch,
	findAllFiles : _findAllFiles,
	findFileById : _findFileById,
	findFileContentById : _findFileContentById,
	createFile : _createFile,
	updateFile : _updateFile,
	deleteFile : _deleteFile
};

};

module.exports = RamlRoutes;
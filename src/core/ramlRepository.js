'use strict';
/**
* Repository pattern to CRUD files.
* @class RamlRepository
* @constructor
* @module core
*/
var RamlRepository = function(dbUrl, collectionName) {

var logger = require('../core/logger');
var MongoClient = require('mongodb');
var BSON = MongoClient.BSONPure;
var db;
var coll;

/**
* Connect to the db.
* @param callback {object} - the called function once connected
*/
var _connect = function() {
	logger.getInstance().debug('Opening db connection : %s', dbUrl);
	MongoClient.connect(dbUrl, function(err, database) {
		if (err) {
			logger.getInstance().error('Connection failed on ' + dbUrl);
			logger.getInstance().error(err);
			throw err;
		}
		logger.getInstance().info('Connection succeeded on ' + dbUrl);
		db = database;
		db.collection(collectionName, function(err, collection) {
			if (err) throw err;
			coll = collection;
		});
	});
};

/**
* Close the connection
*/
var _close = function() {
	logger.getInstance().debug('Closing db connection...');
	db.close(function(err, result) {
		if (err) throw err;
		logger.getInstance().debug('Connection closed / ' + result);
	});
};

/**
* Insert a file
* @method insert
* @param {Object} file - the file to insert, not checked against a particular schema
* @param {Function} callback - function to be called with error and success objects in param after the insert
*/
var _insert = function(file, callback) {
	coll.insert(file, function(err, item) {
		if (err) throw err;
		callback(err, item);
	});
};

/**
* Find files
* @method find
* @param {Object} query - query to search against
* @param {Function} callback - function to be called with error and data objects in param after the find
*/
var _find = function(query, pLimit, pSkip, callback) {
	var filelist = {};

	var options = {
    "limit": pLimit,
    "skip": pSkip
	};

    coll.find(query, options, function(err, resultCursor) {
		if(err) {
			logger.getInstance().error(err);
			throw err;
		}
        resultCursor.each(function(err,item) {
			if(err) {
				logger.getInstance().error(err);
				throw err;
			}
            if(item !== null){
               logger.getInstance().debug('Item found : '+item._id);
               filelist[item._id] = item;
            } else {
				// tous les elements ont ete traites
				callback(filelist);
            }
            });
        });
};

/**
* Find a file
* @method findOne
* @param {Object} idFile - idFile to search against
* @param {Function} callback - function to be called with error and data objects in param after the find
*/
var _findById = function(idFile, callback) {
	coll.findOne({'_id':new BSON.ObjectID(idFile)}, function(err, item) {
		if (err) throw err;
		callback(item);
	});
};

/**
* Update a file
* @method update
* @param {Object} idFile - idFile to update
* @param {Object} file - the file to update, not checked against a particular schema
* @param {Function} callback - function to be called with error and success objects in param after the update
*/
var _update = function(idFile, file, callback) {
	coll.update({'_id':new BSON.ObjectID(idFile)}, file, {safe:false}, function(err, item) {
		if (err) throw err;
		callback(err, item);
	});
};

/**
* Delete a file
* @method deleteById
* @param {Object} idFile - idFile to delete
* @param {Function} callback - function to be called with error and data objects in param after the delete
*/
var _deleteById = function(idFile, callback) {
	coll.remove({'_id':new BSON.ObjectID(idFile)}, function(err, result) {
		if (err) throw err;
		callback(result);
	});
};

return {
	connect : _connect,
	close : _close,
	insert : _insert,
	find : _find,
	findById : _findById,
	update : _update,
	deleteById : _deleteById
};
};

module.exports = RamlRepository;
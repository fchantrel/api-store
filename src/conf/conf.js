'use strict';
/**
* Configuration store
* @class Conf
* @module conf
*/
var Conf = {
/**
* Connection configuration to mongodb
* @property MONGO_xxx
* @type {String}
*/
	APPLICATION_PORT : 9999,
	MONGO_URL : process.env.MONGO_URL || 'mongodb://localhost:27017/ramldb',
	MONGO_COLLECTION : 'files'
};

module.exports = Conf;
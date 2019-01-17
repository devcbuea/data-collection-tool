'use strict';
let Elasticsearch = require('elasticsearch');
let client = new Elasticsearch.Client({
	'host' : process.env.ELASTICSEARCH_URL || '127.0.0.1:9200',
	'log' : 'trace', 
	'apiVersion' : '5.x'
});

module.exports = client;
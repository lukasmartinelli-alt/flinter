/*eslint new-cap:0 */
'use strict';
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var mongoose = require('mongoose-q')();

var options = {
    accessToken: process.env.GITHUB_TOKEN,
    port: process.env.VCAP_APP_PORT || 3000,
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost/flinter'
};

if(!options.accessToken) {
    throw 'No Github Access token specified.';
}

var GitHubApi = require('github');
var github = new GitHubApi({
    version: '3.0.0',
    timeout: 5000,
    headers: { 'user-agent': 'flinter' }
});

mongoose.connect(options.mongoUrl);
app.use(bodyParser.json());
require('./api')(app, github);
app.use(express.static(path.join(__dirname, '/public')));

http.listen(options.port);
exports.http = http;
exports.options = options;

/*eslint new-cap:0 */
'use strict';
var options = {
    accessToken: process.env.GITHUB_TOKEN,
    port: process.env.VCAP_APP_PORT || 3000
};

if(!options.accessToken) {
    throw 'No Github Access token specified.';
}

var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var GitHubApi = require('github');

var github = new GitHubApi({
    version: '3.0.0',
    timeout: 5000,
    headers: { 'user-agent': 'flinter' }
});

var autocomplete = require('./autocomplete')(github);

app.use(express.static(path.join(__dirname, '/public')));
app.get('/search', autocomplete.find);

http.listen(options.port);

'use strict';
var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var autocomplete = require('./autocomplete');

var options = {
    accessToken: process.env.GITHUB_TOKEN,
    port: process.env.VCAP_APP_PORT || 3000,
};

if(!options.accessToken) {
    throw 'No Github Access token specified.';
}

app.use(express.static(path.join(__dirname ,'/public')));
app.get('/autocomplete/:search',autocomplete.find);

http.listen(options.port);

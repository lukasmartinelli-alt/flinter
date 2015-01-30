'use strict';
var request = require('request');

exports.statusImage = function(req, res) {
    var style = req.query.style;
    var badge_url = 'https://img.shields.io/badge/flint-success-green.svg?style=' + style;
    request.get(badge_url).pipe(res);
}

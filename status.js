'use strict';
var path = require('path');
var request = require('request');
var execFile = require('child_process').execFile;
var spawn = require('child_process').spawn;
var mkdirp = require('mkdirp');
var rmdir = require('rimraf');

exports.statusImage = function(req, res) {
    var style = req.query.style;
    var badge_url = 'https://img.shields.io/badge/flint-success-green.svg?style=' + style;
    request.get(badge_url).pipe(res);
};

exports.checkRepo = function(req, res) {
    var full_name = req.params.owner + '/' + req.params.repo;
    var cloneUrl = 'https://github.com/' + full_name;

    mkdirp(req.params.owner, function (err) {
        console.log("Cloning " + full_name + ' to ' + path.resolve(full_name));
        execFile('git', ['clone', '-q', cloneUrl], { cwd: req.params.owner },
                function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            execFile('flint', [full_name], function(err, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                /*rmdir(full_name, function(error) {
                    console.log("Removed repo " + full_name);
                    if(error) {
                        console.error('Could not cleanup dir ' + full_name);
                    }
                });*/
            });
        });
    });
};

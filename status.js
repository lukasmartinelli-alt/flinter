'use strict';
var path = require('path');
var request = require('request');
var execFile = require('child_process').execFile;
var mkdirp = require('mkdirp');
var rmdir = require('rimraf');

exports.statusImage = function(req, res) {
    var style = req.query.style;
    var badgeUrl = 'https://img.shields.io/badge/flint-success-green.svg?style=' + style;
    request.get(badgeUrl).pipe(res);
};

exports.checkRepo = function(req, res) {
    var fullName = req.params.owner + '/' + req.params.repo;
    var cloneUrl = 'https://github.com/' + fullName;

    mkdirp(req.params.owner, function (err) {
        console.log("Cloning " + fullName + ' to ' + path.resolve(fullName));
        execFile('git', ['clone', '-q', cloneUrl], { cwd: req.params.owner },
                function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            execFile('flint', [fullName], function(err, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                rmdir(fullName, function(error) {
                    console.log('Removed repo ' + fullName);
                    if(error) {
                        console.error('Could not cleanup dir ' + fullName);
                    }
                });
            });
        });
    });
};

'use strict';
var request = require('request');
var exec = require('child_process').exec;
var mkdirp = require('mkdirp');
var rmdir = require('rimraf');

exports.statusImage = function(req, res) {
    var style = req.query.style;
    var badge_url = 'https://img.shields.io/badge/flint-success-green.svg?style=' + style;
    request.get(badge_url).pipe(res);
};

exports.checkRepo = function(req, res) {
    var full_name = req.params.owner + '/' + req.params.repo;
    var gitClone = 'git clone -q ' + 'https://github.com/' + full_name;
    var runFlint = '/usr/local/bin/flint';

    mkdirp(req.params.owner, function (err) {
        exec(gitClone, { cwd: req.params.owner }, function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error) {
                console.log('exec error: ' + error);
            }
            rmdir(full_name, function(error) {
                if(error) {
                    console.error('Could not cleanup dir ' + full_name);
                }
            });
        });
    });
};

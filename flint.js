'use strict';
var path = require('path');
var Q = require('q');
var execFile = Q.denodeify(require('child_process').execFile);
var rmdir = Q.denodeify(require('rimraf'));
var temp = require('temp');
var mkdtemp = Q.denodeify(temp.mkdir);

// Automatically track and cleanup files at exit
temp.track();


function clone(dirPath, repo) {
    var cloneUrl = 'https://github.com/' + repo + '.git';
    console.log('Cloning ' + cloneUrl + ' to ' + path.resolve(dirPath));
    return execFile('git', ['clone', '-q', cloneUrl], { cwd: dirPath });
}

function checkout(repoPath, sha) {
    console.log('Checking out ' + sha + ' in ' + path.resolve(repoPath));
    return execFile('git', ['checkout', '-q', sha], { cwd: repoPath });
}

function parseFlintWarning(line) {
    var re = /([0-9a-zA-Z\.\/]+)\((\d+)\):(.*)/;
    var match = re.exec(line);
    if(match) {
        return {
            file: match[1],
            lineno: match[2],
            message: match[3]
        };
    }
}

function flintDocker(repoPath) {
    console.log('Flinting with Docker' + path.resolve(repoPath));
    var volume = repoPath + ':' + '/root';
    var image = 'lukasmartinelli/docker-flint';
    var args = ['run', '--rm', '-v', volume, '-t', image, '/root'];
    return execFile('docker', args);
}

function flint(repoPath) {
    if(process.env.FLINT_DOCKER) {
        return flintDocker(repoPath);
    }
    console.log('Flinting ' + path.resolve(repoPath));
    return execFile('flint', [repoPath]);
}

exports.flintCommit = function(commit) {
    return mkdtemp('flinter').then(function(dirPath) {
        return clone(dirPath, commit.repo).then(function() {
            var repoName = commit.repo.split('/')[1];
            var repoPath = path.join(dirPath, repoName);
            return checkout(repoPath, commit.sha).then(function() {
                return repoPath;
            });
        }).then(function(repoPath) {
            return flint(repoPath).then(function(stdout) {
                var flintOutput = stdout[0];
                var lines = flintOutput.split('\r\n');
                var warnings = lines.map(parseFlintWarning).filter(function(w) {
                    return w !== undefined;
                });
                return warnings;
            }, function(err) {
                console.error(err);
            });
        }).fin(function() {
            console.log('Cleaning up ' + dirPath);
            rmdir(dirPath);
        });
    });
};

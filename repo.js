'use strict';
var Q = require('q');
var Repo = require('./models').Repo;
var Commit = require('./models').Commit;

exports.add = function(fullName) {
    return Repo.create({ repo: fullName, subscribed: false });
};

exports.subscribe = function(fullName) {
    return Repo.findOne({ repo: fullName }).exec().then(function(repo) {
        var deferred = Q.defer();
        repo.subscribed = true;
        repo.save(function(err, savedRepo) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(savedRepo);
            }
        });
        return deferred;
    });
};

exports.status = function(fullName) {
    var queries = Q.all([
        Repo.findOne({ repo: fullName }).exec(),
        Commit.find({ repo: fullName }).exec()
    ]);
    return queries.then(function(results) {
        var repo = results[0];
        repo.commits = results[1];
        return repo;
    });
};

exports.addCommit = function(commit) {
    return Commit.create(commit);
};

exports.lastCommit = function(fullName) {
    return Commit
        .find({ repo: fullName })
        .sort({ date: 'desc'})
        .exec().then(function(commits){
            if(commits.length > 0) {
                return commits[0];
            } else {
                throw 'No commits exist for repo ' + fullName;
            }
        });
};

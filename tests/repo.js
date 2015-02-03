'use strict';
var assert = require('chai').assert;
var mongoose = require('mongoose-q')();
var Repo = require('../models').Repo;
var Commit = require('../models').Commit;
var repo = require('../repo');

//mongoose.connect('mongodb://localhost/flinter');

describe('repo', function() {

    afterEach(function(done){
        Repo.remove({ repo: 'nathanepstein/markov'}, done);
    });

    afterEach(function(done) {
        Commit.find({ repo: 'nathanepstein/markov'}).remove(done);
    });

    it('add repo', function(done){
        repo.add('nathanepstein/markov').then(function () {
           return repo.status('nathanepstein/markov');
        }).then(function(obj) {
           assert.notOk(obj.subscribed);
           done();
        });
    });

    it('subscribe to existing repo updates repo', function(done) {
        repo.add('nathanepstein/markov').then(function() {
            return repo.subscribe('nathanepstein/markov');
        }).then(function() {
            return repo.status('nathanepstein/markov');
        }).then(function( obj) {
            assert.equal(obj.repo, 'nathanepstein/markov');
            assert.notOk(obj.subscribed);
            done();
        });
    });

    it('add commit to repo', function(done) {
        repo.add('nathanepstein/markov').then(function() {
            return repo.addCommit({
                repo: 'nathanepstein/markov',
                sha: '60d806b05653d2d8c305a06928bebf604d3a6009',
                date: new Date(),
                flintStatus: 0
            });
        }).then(function() {
            return repo.status('nathanepstein/markov');
        }).then(function(obj) {
            assert.equal(obj.commits.length, 1);
            done();
        });
    });
});

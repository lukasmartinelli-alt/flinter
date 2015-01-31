'use strict';
var models = require('../models');
var assert = require('better-assert');

describe('repo', function() {
    it('can be created', function() {
        var repo = new models.Repo({
            repo: 'sandstorm-io/sandstorm',
            commits: [{ sha: '60d806b05653d2d8c305a06928bebf604d3a6009'},
                      { sha: '1ab9d877b6efe62a1eb190024cd67cbc6d91d21a' }]
        });
        assert(repo.repo == 'sandstorm-io/sandstorm');
        assert(repo.commits.length == 2);
    });
});

describe('commit', function() {
    it('can be created', function() {
        var c1 = new models.Commit({
            repo: 'sandstorm-io/sandstorm',
            sha: '60d806b05653d2d8c305a06928bebf604d3a6009',
            date: new Date(),
            flintStatus: 0
        });
        var c2 = new models.Commit({
            repo: 'sandstorm-io/sandstorm',
            sha: '1ab9d877b6efe62a1eb190024cd67cbc6d91d21a',
            date: new Date(),
            flintOutput: [{ file: 'root/src/sodium/api.h',
                            lineno: 1,
                            message: 'Missing include guard.'
                          },
                          { file: 'root/src/sandstorm/union-fs.c++',
                            lineno: 575,
                            message: 'Single-argument constructor may inadvertedly be used as a type conversion constructor.'
                          }],
            flintStatus: 1
        });
        assert(c1.flintOutput.length == 0);
        assert(c2.flintOutput.length == 2);
    });
});

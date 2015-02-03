'use strict';
var repo = require('./repo');

module.exports = function(app, github) {
    var autocomplete = require('./autocomplete')(github);

    app.get('/', function(req, res) {
        res.format({
            html: function() {
                res.sendFile('index.html', {root: './public'});
            },
            json: function() {
                if(req.query.q) {
                    autocomplete.find(req, res);
                } else {
                    repo.all().then(function(repos) {
                        res.json(repos);
                    });
                }
            }
        });
    });

    app.get('/:owner/:repo.svg', function(req, res) {
        var fullName = req.params.owner + '/' + req.params.repo;
        console.log('Badge for ' + fullName + ' requested');
        repo.lastCommit(fullName).then(function(commit) {
            var color = 'failed-red';
            if(commit.status === 'success') {
                color = 'success-green';
            }
            var badge = 'flint-' + color + '.svg';
            res.sendFile(badge, {root: './public'});
        });
    });

    app.get('/:owner/:repo', function(req, res) {
        var fullName = req.params.owner + '/' + req.params.repo;
        repo.get(fullName).then(function(rep) {
           res.json(rep);
        });
    });

    app.put('/:owner/:repo', function(req, res) {
        var fullName = req.params.owner + '/' + req.params.repo;
        console.log('Subscribe ' + fullName);
        repo.subscribe(fullName).then(function() {
            res.status(200).send();
        });
    });

    app.post('/:owner/:repo/pushes', function(req, res) {
        var fullName = req.params.owner + '/' + req.params.repo;
        repo.checkPush(fullName, req.body).then(function(commit) {
            res.status(201);
            res.json(commit);
            res.send();
        });
    });

};

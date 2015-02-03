/*eslint no-unused-expressions:0 */
'use strict';
var chai = require('chai');
var chaiHttp = require('chai-http');
var chaiThings = require('chai-things');
var http = require('../server').http;
var expect = require('chai').expect;

chai.use(chaiHttp);
chai.use(chaiThings);

describe('html', function() {

    it('PUT /nathanepstein/markov subscribes repo', function() {
        return chai.request(http)
            .put('/nathanepstein/markov')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ subscribed: true })
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.eql({
                    repo: 'nathanepstein/markov',
                    subscribed: true
                });
            });
    });

    it('POST /nathanepstein/markov/pushes checks repo', function() {
        this.timeout(10000);
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return chai.request(http)
            .post('/nathanepstein/markov/pushes')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send([{
                sha: '1df2b1b78c86b71ed429b0ad4b08b8fadac4cace',
                date: new Date()
            }, {
                sha: 'a2e62fe254804ab36d0d1bfb2302c61e32f7fd66',
                date: yesterday
            }])
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.have.keys(['repo', 'sha', 'date', 'status', 'warnings']);
                expect(res.body.warnings).to.have.length(3);
                expect(res.body.warnings).all.have.keys(['file', 'lineno', 'message', '_id']);
            });
    });


    it('GET / returns index.html page', function() {
        return chai.request(http)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });

    it('GET / returns list of repos', function() {
        return chai.request(http)
            .get('/')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.length(1);

                var markov = res.body[0];
                expect(markov).to.be.eql({
                    repo: 'nathanepstein/markov',
                    subscribed: true
                });
            });
    });

    it('GET /nathanepstein/markov return repo including commit', function() {
        return chai.request(http)
            .get('/nathanepstein/markov')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.keys(['subscribed', 'repo', 'commits']);
                expect(res.body.commits).to.have.length(2);
                expect(res.body.commits).all.have.keys(['sha', 'date', 'warnings', 'status']);
            });
    });

    it('GET / returns index.html page', function() {
        return chai.request(http)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
});

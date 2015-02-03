'use strict';
var mongoose = require('mongoose-q')();

var repoSchema = new mongoose.Schema({
    repo: { type: String, required: true, unique: true },
    subscribed: { type: Boolean, default: false }
});

repoSchema.methods.htmlUrl = function() {
    return 'https://github.com/' + this.repo;
};

var commitSchema = new mongoose.Schema({
    repo: { type: String, required: true },
    sha: { type: String, required: true },
    date: { type: Date, default: Date.now },
    warnings: [{ file: String, lineno: Number, message: String }],
    status: { type: String, match: /success|failed|pending|unchecked/i }
});
commitSchema.index({ repo: 1, sha: -1 }, { unique: true });

exports.Repo = mongoose.model('Repo', repoSchema);
exports.Commit = mongoose.model('Commit', commitSchema);

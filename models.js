var mongoose = require('mongoose-q')();

var repoSchema = new mongoose.Schema({
    repo: String,
    commits: [{ sha: String}]
});

var commitSchema = new mongoose.Schema({
    repo: String,
    sha: String,
    date: { type: Date, default: Date.now },
    flintOutput: [{ file: String, lineno: Number, message: String }],
    flintStatus: Number
});

exports.Repo = mongoose.model('Repo', repoSchema);
exports.Commit = mongoose.model('Commit', commitSchema);

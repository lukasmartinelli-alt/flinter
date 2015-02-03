'use strict';

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}


module.exports = function(github) {
    return {
        find: function(req, res) {
            github.search.repos({'q': req.query.q}, function(err, result) {
                if(err) {
                    console.error(err);
                    res.send([]);
                }
                var suggestions = result.items.map(function(item) {
                    return {
                        repo: item.full_name,
                        flintStatus: randomIntInc(0, 1)
                    };
                });
                console.log(suggestions);
                res.send(suggestions);
            });
        }
    };
};

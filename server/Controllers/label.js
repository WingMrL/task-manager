let mongoose = require('mongoose');

let Label = mongoose.model('Label');

exports.addLabel = function(req, res) {
    let _label = req.body;
    let label = new Icon(_label);

    label.save(function(err, label) {
        if(err) {
            console.log(err);
        }

        res.json({
            code: 0,
            status: 'ok'
        });
    })
};

exports.getLabels = function(req, res) {
    Label.fetch(function(err, labels) {
        if(err) {
            console.log(err);
        }

        res.json({
            code: 0,
            status: 'ok',
            labels: labels
        });
    });
}
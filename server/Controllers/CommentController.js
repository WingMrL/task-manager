let mongoose = require('mongoose')
let UserModal = mongoose.model('UserModal');
let TeamModal = mongoose.model('TeamModal');
let TaskModal = mongoose.model('TaskModal');
let CommentModal = mongoose.model('CommentModal');
let path = require('path');
// let jwt = require('jsonwebtoken');
let config = require('../../config/config');
// let uuidV1 = require('uuid/v1');

// code: 0, msg: ok
// code: 1, msg: eMail has been used
// code: -1, msg: params error
// code: -2, msg: eMail not sign up
// code: -3, msg: passwork or eMail not match
// code: -4, msg: not found
// code: -5, msg: already in
// code: -98, msg: need signin

exports.addComment = function(req, res) {
    let { commentValue, from, taskId } = req.body;
    // console.log(commentValue, from, taskId);
    if(!commentValue || !from || !taskId) {
        res.json({
            code: -1,
            msg: 'params error',
        });
        return;
    }
    let comment = new CommentModal({
        content: commentValue,
        from
    });
    comment.save()
        .then((savedComment) => {
            TaskModal.findOne({ _id: taskId })
                .exec()
                .then((foundTask) => {
                    foundTask.comments.addToSet(savedComment._id)
                    foundTask.save()
                        .then((savedTask) => {
                            res.json({
                                code: 0,
                                msg: 'ok',
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};
let mongoose = require('mongoose')
let UserModal = mongoose.model('UserModal');
let TeamModal = mongoose.model('TeamModal');
let ProjectModal = mongoose.model('ProjectModal');
let TaskModal = mongoose.model('TaskModal');
let path = require('path');
// let jwt = require('jsonwebtoken');
let config = require('../../config/config');
// let uuidV1 = require('uuid/v1');
let parallel = require('async/parallel');


// code: 0, msg: ok
// code: 1, msg: eMail has been used
// code: -1, msg: params error
// code: -2, msg: eMail not sign up
// code: -3, msg: passwork or eMail not match
// code: -4, msg: not found
// code: -5, msg: already in
// code: -98, msg: need signin


exports.newTask = function(req, res) {
    let { taskName, deadLine, executorId, projectId } = req.body;
    let task = new TaskModal({
        taskName: taskName,
        project: projectId,
    });
    if(deadLine) {
        task.deadLine = deadLine;
    }
    if(executorId) {
        task.executor = executorId;
    }
    task.save()
        .then((savedTask) => {
            parallel({
                project: (callback) => {
                    ProjectModal.findOne({ _id: projectId })
                        .exec()
                        .then((foundProject) => {
                            foundProject.tasks.addToSet(savedTask._id);
                            foundProject.save()
                                .then((savedProject) => {
                                    callback(null, savedProject);
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                },
                exexcutor: (callback) => {
                    if(executorId) {
                        UserModal.findOne({ _id: executorId })
                            .exec()
                            .then((foundUser) => {
                                foundUser.tasks.addToSet(savedTask._id);
                                foundUser.save()
                                    .then((savedUser) => {
                                        callback(null, savedUser);
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        callback(null, undefined);
                    }
                }
            }, (err, result) => {
                res.json({
                    code: 0,
                    msg: 'ok',
                    result
                });
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
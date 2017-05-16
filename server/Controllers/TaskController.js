let mongoose = require('mongoose')
let UserModal = mongoose.model('UserModal');
let TeamModal = mongoose.model('TeamModal');
let ProjectModal = mongoose.model('ProjectModal');
let TaskModal = mongoose.model('TaskModal');
let CommentModal = mongoose.model('CommentModal');
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

exports.deleteTask = function(req, res) {
    let { taskId } = req.body;
    if(!taskId) {
        res.json({
            code: -1,
            msg: 'params error',
        });
        return;
    }
    TaskModal.findOne({ _id: taskId })
        .exec()
        .then((foundTask) => {
            if(foundTask) {
                parallel({
                    project: (callback) => {
                        ProjectModal.findOne({ _id: foundTask.project })
                            .exec()
                            .then((foundProject) => {
                                foundProject.tasks.pull(taskId);
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
                    user: (callback) => {
                        if(foundTask.executor) {
                            UserModal.findOne({ _id: foundTask.executor })
                                .exec()
                                .then((foundUser) => {
                                    foundUser.tasks.pull(taskId);
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
                            callback(null, null);
                        }
                    },
                    comments: (callback) => {
                        let count = foundTask.comments.length;
                        if(count == 0) {
                            callback(null, 'done:0');
                        }
                        foundTask.comments.forEach((v) => {
                            CommentModal.remove({ _id: v})
                                .then(() => {
                                    count --;
                                    if(count == 0) {
                                        callback(null, 'done');
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        });
                    }
                }, (err, result) => {
                    res.json({
                        code: 0,
                        msg: 'ok',
                    });
                });
            } else {
                res.json({
                    code: -4,
                    msg: 'not found',
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.editTaskNameAndTaskDescription = function(req, res) {
    let { taskName, taskDescription, taskId } = req.body;
    if(!taskName || !taskId) {
        res.json({
            code: -1,
            msg: 'params error',
        });
        return;
    }

    TaskModal.findOne({ _id: taskId })
        .exec()
        .then((foundTask) => {
            foundTask.taskName = taskName;
            foundTask.description = taskDescription;
            foundTask.save()
                .then((savedTask) => {
                    res.json({
                        code: 0, 
                        msg: 'ok',
                        task: savedTask,
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getTask = function(req, res) {
    let { taskId } = req.query;
    // let options = {
    //         sort: {
    //             'meta.updateAt': -1
    //         }
    //     };
    if(!taskId) {
        res.json({
            code: -1,
            msg: 'params error',
        });
        return;
    }
    TaskModal.findOne({ _id: taskId })
        .populate({
            path: "project",
        })
        .populate({
            path: "executor"
        })
        .populate({
            path: "comments",
            populate: {
                path: 'from to'
            }
        })
        .exec()
        .then((foundTask) => {
            if(foundTask) {
                res.json({
                    code: 0,
                    msg: 'ok',
                    task: foundTask
                });
            } else {
                res.json({
                    code: -4,
                    msg: 'not found'
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};


exports.toggleTaskFinish = function(req, res) {
    let { taskId } = req.body;
    if(!taskId) {
        res.json({
            code: -1,
            msg: 'params error'
        });
        return;
    }
    TaskModal.findOne({ _id: taskId })
        .exec()
        .then((foundTask) => {
            foundTask.finished = !foundTask.finished;
            foundTask.save()
                .then((savedTask) => {
                    res.json({
                        code: 0,
                        msg: 'ok',
                        task: savedTask,
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

exports.changeExecutorAndDeadLine = function(req, res) {
    let { executorId , taskId, deadLine} = req.body;
    if(!taskId) {
        res.json({
            code: -1,
            msg: 'params error'
        });
        return;
    }
    TaskModal.findOne({ _id: taskId })
        .exec()
        .then((foundTask) => {
            foundTask.executor = executorId;
            foundTask.deadLine = deadLine;
            parallel({
                saveTask: (callback) => {
                    foundTask.save()
                        .then((savedTask) => {
                            callback(null, savedTask);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                },
                saveUser: (callback) => {
                    let execIdForFinding = executorId == undefined ? foundTask.executor : executorId;
                    if(execIdForFinding) {
                        UserModal.findOne({ _id: execIdForFinding })
                            .exec()
                            .then((foundUser) => {
                                if(executorId) {
                                    foundUser.tasks.addToSet(taskId);
                                } else {
                                    foundUser.tasks.pull(taskId);
                                }
                                foundUser.save()
                                    .then((savedUser) => {
                                        callback(null, savedUser);
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    })
                            })
                            .catch((err) => {
                                console.log(err);
                            })
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
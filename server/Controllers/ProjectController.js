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
// code: -98, msg: need signin

exports.deleteProject = function(req, res) {
    let { projectId } = req.body;
    if(!projectId) {
        res.json({
            code: -1,
            msg: 'params error',
        });
        return;
    }
    ProjectModal.findOne({ _id: projectId })
        .exec()
        .then((foundProject) => {
            if(foundProject) {
                parallel({
                    removeProjectFromTeam: (callback) => {
                        TeamModal.findOne({ _id: foundProject.team})
                            .exec()
                            .then((foundTeam) => {
                                if(foundTeam) {
                                    foundTeam.projects.pull(projectId);
                                    foundTeam.save()
                                        .then((savedTeam) => {
                                            callback(null, savedTeam);
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                                } else {
                                    res.json({
                                        code: -4,
                                        msg: 'team not found',
                                    });
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    },
                    removeTasksInProject: (callback) => {
                        let taskCount = foundProject.tasks.length;
                        if(taskCount == 0) {
                            callback(null, 'done:0');
                        }
                        // 逐一删除该项目的任务
                        foundProject.tasks.forEach((taskId) => {
                            TaskModal.findOne({ _id: taskId })
                                .exec()
                                .then((foundTask) => {
                                    if(foundTask) {
                                        parallel({
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
                                            // 移除任务
                                            TaskModal.remove({ _id: taskId })
                                                .then(() => {
                                                    taskCount --;
                                                    if(taskCount == 0) {
                                                        callback(null, 'done');
                                                    }
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                });
                                        });
                                    } else {
                                        res.json({
                                            code: -4,
                                            msg: 'task not found',
                                        });
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        });
                    }
                }, (err, result) => {
                    // 移除项目
                    ProjectModal.remove({ _id: projectId })
                        .then(() => {
                            res.json({
                                code: 0,
                                msg: 'ok',
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                });
            } else {
                res.json({
                    code: -4,
                    msg: 'project not found',
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getProject = function(req, res) {
    let { projectId } = req.query;
    let options = {
            sort: {
                'meta.updateAt': -1
            }
        };
    ProjectModal.findOne({ _id: projectId })
        .populate({
            path: 'team'
        })
        .populate({
            path: 'tasks',
            options: options,
        })
        .populate({
            path: 'members',
        })
        .exec()
        .then((foundProject) => {
            if(foundProject) {
                res.json({
                    code: 0,
                    msg: 'ok',
                    project: foundProject
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

exports.setProject = function(req, res) {
    let { projectName, projectDescription, membersId, projectId } = req.body;
    if(!projectName || !membersId || !projectId) {
        res.json({
            code: -1,
            msg: 'params error',
        });
        return;
    }

    ProjectModal.findOne({ _id: projectId })
        .exec()
        .then((foundProject) => {
            foundProject.projectName = projectName;
            foundProject.description = projectDescription;

            let removeMembersId = []; //使这些成员退出项目
            foundProject.members.forEach((memberId) => {
                if(membersId.indexOf(memberId.toString()) < 0) {
                    removeMembersId.push(memberId);
                }
            });

            let removeCount = removeMembersId.length;
            
            if(removeCount == 0) {
                foundProject.members = membersId;
                foundProject.save()
                    .then((savedProject) => {
                        res.json({
                            code: 0,
                            msg: 'ok',
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                function removeMember(i) {
                    if(removeMembersId[i] != undefined) {
                        UserModal.findOne({ _id: removeMembersId[i] })
                            .exec()
                            .then((foundUser) => {
                                if(foundUser) {
                                    let tasksId = []; // 这个用户负责的任务id
                                    foundProject.tasks.forEach((taskIdInProject) => {
                                        if(foundUser.tasks.indexOf(taskIdInProject) > -1) {
                                            foundUser.tasks.pull(taskIdInProject);
                                            tasksId.push(taskIdInProject);
                                        }
                                    });
                                    parallel([
                                        (callback) => {
                                            foundUser.save()
                                                .then((savedUser) => {
                                                    callback(null, savedUser);
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                });
                                        },
                                        (callback) => {
                                            TaskModal.update({ executor: removeMembersId[i] }, {executor: undefined, deadLine: undefined}, {multi: true})
                                                .then((raw) => {
                                                    callback(null, raw);
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                });
                                        }
                                    ], (err, result) => {
                                        removeMember(++i); //递归调用
                                    });
                                } else {
                                    res.json({
                                        code: -4,
                                        msg: 'user not found',
                                    });
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        foundProject.members = membersId;
                        foundProject.save()
                            .then((savedProject) => {
                                res.json({
                                    code: 0,
                                    msg: 'ok',
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                }

                removeMember(0);
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.newProject = function(req, res) {
    let { projectName, projectDescription, teamId, membersId } = req.body;
    let project = new ProjectModal({
        projectName,
        description: projectDescription,
        team: teamId,
        members: membersId,
    });
    project.save()
        .then((savedProject) => {
            TeamModal.findOne({ _id: teamId })
                .exec()
                .then((foundTeam) => {
                    foundTeam.projects.addToSet(savedProject._id);
                    foundTeam.save()
                        .then((savedTeam) => {
                            res.json({
                                code: 0,
                                msg: 'ok',
                                project: savedProject,
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        });
};
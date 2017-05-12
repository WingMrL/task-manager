let mongoose = require('mongoose')
let UserModal = mongoose.model('UserModal');
let TeamModal = mongoose.model('TeamModal');
let ApplyModal = mongoose.model('ApplyModal');
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


exports.approvalApply = function(req, res) {
    let { applyId, applyingUserId, applyingTeamId } = req.body;
    parallel({
        user: (callback) => {
            UserModal.findOne({ _id: applyingUserId })
                .exec()
                .then((foundUser) => {
                    foundUser.applies.pull({ _id: applyId });
                    foundUser.teams.addToSet(applyingTeamId);
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
        },
        team: (callback) => {
            TeamModal.findOne({ _id: applyingTeamId })
                .exec()
                .then((foundTeam) => {
                    foundTeam.applies.pull({ _id: applyId });
                    foundTeam.normalMembers.addToSet(applyingUserId);
                    foundTeam.save()
                        .then((savedTeam) => {
                            callback(null, savedTeam);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        apply: (callback) => {
            ApplyModal.remove({ _id: applyId })
                .exec()
                .then((result) => {
                    callback(null, result);
                })
                .catch((err) => {
                    console.log(err);
                })
                
        },
    }, (err, result) => {
        res.json({
            code: 0,
            msg: 'ok',
            result,
        });
    });
};

exports.rejectApply = function(req, res) {
    let { applyId, applyingUserId, applyingTeamId } = req.body;
    parallel({
        user: (callback) => {
            UserModal.findOne({ _id: applyingUserId })
                .exec()
                .then((foundUser) => {
                    foundUser.applies.pull({ _id: applyId });
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
        },
        team: (callback) => {
            TeamModal.findOne({ _id: applyingTeamId })
                .exec()
                .then((foundTeam) => {
                    foundTeam.applies.pull({ _id: applyId });
                    foundTeam.save()
                        .then((savedTeam) => {
                            callback(null, savedTeam);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        apply: (callback) => {
            ApplyModal.remove({ _id: applyId })
                .exec()
                .then((result) => {
                    callback(null, result);
                })
                .catch((err) => {
                    console.log(err);
                })
                
        },
    }, (err, result) => {
        res.json({
            code: 0,
            msg: 'ok',
            result,
        });
    });
};

exports.applyJoinIn = function(req, res) {
    let { applyReason, teamId, userId, } = req.body;
    let applyJoinIn = new ApplyModal({
        applyReason,
        applyingUser: userId,
        applyingTeam: teamId,
    });
    applyJoinIn.save()
        .then((savedApply) => {
            parallel({
                user: (callback) => {
                    UserModal.findOne({ _id: userId })
                        .exec()
                        .then((foundUser) => {
                            foundUser.applies.addToSet(savedApply);
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
                },
                team: (callback) => {
                    TeamModal.findOne({ _id: teamId })
                        .exec()
                        .then((foundTeam) => {
                            foundTeam.applies.addToSet(savedApply);
                            foundTeam.save()
                                .then((savedTeam) => {
                                    callback(null, savedTeam);
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
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
        })
    
};
let mongoose = require('mongoose')
let UserModal = mongoose.model('UserModal');
let TeamModal = mongoose.model('TeamModal');
let path = require('path');
let jwt = require('jsonwebtoken');
let config = require('../../config/config');
let uuidV1 = require('uuid/v1');

// code: 0, msg: ok
// code: 1, msg: eMail has been used
// code: -1, msg: params error
// code: -2, msg: eMail not sign up
// code: -3, msg: passwork or eMail not match
// code: -4, msg: not found
// code: -5, msg: already in
// code: -98, msg: need signin

exports.changeTeamName = function(req, res) {
    let { teamId, teamName } = req.body;
    if(!teamId || !teamName) {
        res.json({
            code: -1,
            msg: 'params error',
        });
        return;
    }
    TeamModal.findOne({ _id: teamId })
        .exec()
        .then((foundTeam) => {
            if(foundTeam) {
                foundTeam.teamName = teamName;
                foundTeam.save()
                    .then((savedTeam) => {
                        res.json({
                            code: 0,
                            msg: 'ok',
                        });
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
        })
};

// refresh joinId
exports.refreshJoinId = function(req, res) {
    let { teamId } = req.body;
    if(!teamId) {
        res.json({
            code: 0,
            msg: 'params error',
        });
        return;
    }
    TeamModal.findOne({ _id: teamId })
        .exec()
        .then((foundTeam) => {
            foundTeam.joinId = uuidV1();
            foundTeam.save()
                .then((savedTeam) => {
                    res.json({
                        code: 0,
                        msg: 'ok',
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

// newTeam
exports.newTeam = function(req, res) {
    let { teamName, userId } = req.body;
    // console.log(teamName, userId);
    let joinId = uuidV1();
    let team = new TeamModal({ 
        teamName,
        superManager: userId,
        joinId: joinId
      });
    team.save()
        .then((savedTeam) => {
            UserModal.findById(userId, (err, foundUser) => {
              if(err) {
                console.log(err);
              }
              foundUser.teams.addToSet(savedTeam._id);
              foundUser.save()
                  .then((savedUser) => {
                      // console.log(savedUser);
                      res.json({
                        code: 0,
                        msg: 'ok',
                        team: savedTeam
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
            })
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getTeam = function(req, res) {
    let { teamId } = req.query;
    let populateProject = {
        path: 'projects',
        options: {
            sort: {
                'meta.updateAt': -1
            }
        }
    };
    let populateSuperManager = {
        path: 'superManager'
    };
    let populateManagers = {
        path: 'managers',
        options: {
            sort: {
                'meta.updateAt': -1
            }
        }
    };
    let populateNormalMembers = {
        path: 'normalMembers',
        options: {
            sort: {
                'meta.updateAt': -1
            }
        }
    };
    let populateApplies = {
        path: 'applies',
        options: {
            sort: {
                'meta.updateAt': -1
            }
        },
        populate: {
            path: 'applyingUser applyingTeam'
        }
    };
    if(teamId) {
        TeamModal.findOne({ _id: teamId })
            .populate(populateProject)
            .populate(populateSuperManager)
            .populate(populateManagers)
            .populate(populateNormalMembers)
            .populate(populateApplies)
            .exec()
            .then((foundTeam) => {
                res.json({
                    code: 0,
                    msg: 'ok',
                    team: foundTeam
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.json({
            code: -1,
            msg: 'params error',
        });
    }
    
};

exports.getTeamByJoinId = function(req, res) {
    let { joinId, userId } = req.query;
    let populateProject = {
        path: 'projects',
        options: {
            sort: {
                'meta.updateAt': -1
            }
        }
    };
    let populateSuperManager = {
        path: 'superManager'
    };
    let populateManagers = {
        path: 'managers',
        options: {
            sort: {
                'meta.updateAt': -1
            }
        }
    };
    let populateNormalMembers = {
        path: 'normalMembers',
        options: {
            sort: {
                'meta.updateAt': -1
            }
        }
    };
    if(joinId) {
        TeamModal.findOne({ joinId: joinId })
            .populate(populateProject)
            .populate(populateSuperManager)
            .populate(populateManagers)
            .populate(populateNormalMembers)
            .exec()
            .then((foundTeam) => {
                if(foundTeam) {
                    if(userId && (
                        userId == foundTeam.superManager._id ||
                        foundTeam.normalMembers.filter(v => v._id == userId).length > 0 ||
                        foundTeam.managers.filter(v => v._id == userId).length > 0 ||
                        foundTeam.applies.filter(v => v.applyingUser == userId).length > 0
                    )) {
                        res.json({
                            code: -5,
                            msg: 'already in'
                        });
                    } else {
                        res.json({
                            code: 0,
                            msg: 'ok',
                            team: foundTeam
                        });
                    }
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
    } else {
        res.json({
            code: -1,
            msg: 'params error',
        });
    }
    
};

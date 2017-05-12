let mongoose = require('mongoose')
let UserModal = mongoose.model('UserModal');
let TeamModal = mongoose.model('TeamModal');
let ProjectModal = mongoose.model('ProjectModal');
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
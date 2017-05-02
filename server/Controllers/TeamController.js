let mongoose = require('mongoose')
let UserModal = mongoose.model('UserModal');
let TeamModal = mongoose.model('TeamModal');
let path = require('path');
let jwt = require('jsonwebtoken');
let config = require('../../config/config');

// code: 0, msg: ok
// code: 1, msg: eMail has been used
// code: -1, msg: params error
// code: -2, msg: eMail not sign up
// code: -3, msg: passwork or eMail not match
// code: -98, msg: need signin

// newTeam
exports.newTeam = function(req, res) {
    let { teamName, userId } = req.body;
    // console.log(teamName, userId);
    let team = new TeamModal({ 
        teamName,
        superManager: userId 
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
    if(teamId) {
        TeamModal.findOne({ _id: teamId })
            .populate(populateProject)
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

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

// sign up
exports.signup = function(req, res) {
  let {userName, password, eMail, teamName, joinId} = req.body.user;
  let _user = {
    userName,
    password,
    eMail,
  };
  // console.log(_user);

  UserModal.findOne({eMail: _user.eMail})
      .exec()
      .then((foundUser) => {
        if(foundUser) {
            res.json({
              code: 1,
              msg: 'eMail has been used',
            });
        } else {
            _user.headImgUrl = path.join('headimg', 'default.png');

            let user = new UserModal(_user);
            user.save()
                .then((savedUser) => {
                  if(joinId) {
                      let token = jwt.sign(savedUser, config.secret, {expiresIn: 24 * 3600}); 
                      res.json({
                        code: 0,
                        msg: 'ok',
                        token,
                        user: savedUser
                      });
                  } else {
                      let joinId = uuidV1();
                      let _team = {
                        teamName,
                        superManager: savedUser._id,
                        joinId: joinId
                      };

                      let team = new TeamModal(_team);
                      // console.log(team);
                      team.save()
                          .then((savedTeam) => {
                            savedUser.teams = [savedTeam._id];
                            savedUser.save()
                                .then((savedUser02) => {
                                  let token = jwt.sign(savedUser02, config.secret, {expiresIn: 24 * 3600}); 
                                  res.json({
                                    code: 0,
                                    msg: 'ok',
                                    token,
                                    user: savedUser02
                                  });
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                  }
                })
                .catch((err) => {
                    console.log(err)
                });
        }
      })
      .catch((err) => {
        console.log(err);
      });
}

// sign in
exports.signin = function(req, res) {
  let { eMail, password, remember } = req.body.user;

  UserModal.findOne({eMail: eMail})
      .exec()
      .then((foundUser) => {
          if (!foundUser) {
              res.json({
                  code: -2,
                  msg: 'eMail not sign up'
              });
          } else {
              foundUser.comparePassword(password, (err, isMatch) => {
                  if (err) {
                    console.log(err)
                  }

                  if (isMatch) {
                    let token = jwt.sign(foundUser, config.secret, {expiresIn: 24 * 3600});                    

                    res.json({
                        code: 0,
                        msg: 'ok',
                        token,
                        user: foundUser,
                    });
                  } else {
                    res.json({
                        code: -3,
                        msg: 'passwork or eMail not match'
                    });
                  }
              })
          }
      })
      .catch((err) => {
          console.log(err)
      });
}

exports.getUser = function(req, res) {
  let { userId } = req.query;
  let options = {
      sort: {
          'meta.updateAt': -1
      }
  }
  if(userId) {
    // console.log(userId);
    UserModal.findOne({_id: userId})
      .populate({
        path: 'teams', 
        options
      })
      .populate({
        path: 'applies',
        options,
        populate: {
            path: 'applyingTeam',
            select: 'teamName',
        }
      })
      .exec()
      .then((foundUser) => {
          res.json({
              code: 0,
              msg: 'ok',
              user: foundUser,
          });
      })
      .catch((err) => {
          console.log(err);
      });
  } else {
    res.json({
      code: -1,
      msg: 'params error'
    });
  }
};

// logout
exports.logout =  function(req, res) {
  // delete req.session.user
  //delete app.locals.user

  // res.redirect('/')
}


// midware for user
exports.signinRequired = function(req, res, next) {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if(err) {
          res.json({
              code: -98,
              msg: 'need signin'
          });
      } else {
          next();
      }
    });
  } else {
    res.json({
      code: -98,
      msg: 'need signin'
    });
  }
}

exports.checkSignIn = function(req, res, next) {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if(err) {
          res.json({
              code: -98,
              msg: 'need signin'
          });
      } else {
          res.json({
              code: 0,
              msg: 'ok',
              token
          });
      }
    });
  } else {
    res.json({
      code: -98,
      msg: 'need signin'
    });
  }
}

let mongoose = require('mongoose')
let UserModal = mongoose.model('UserModal');
let TeamModal = mongoose.model('TeamModal');
let path = require('path');

// code: 0, msg: ok
// code: 1, msg: eMail has been used
// code: -1, msg: params error
// code: -2, msg: eMail not sign up
// code: -3, msg: passwork or eMail not match

// sign up
exports.signup = function(req, res) {
  let {userName, password, eMail, teamName} = req.body.user;
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

                  let _team = {
                    teamName,
                    superManager: savedUser._id
                  };

                  let team = new TeamModal(_team);
                  // console.log(team);
                  team.save()
                      .then((savedTeam) => {
                        savedUser.teams = [savedTeam._id];
                        savedUser.save()
                            .then(() => {
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
                    req.session.user = foundUser;
                    res.json({
                        code: 0,
                        msg: 'ok'
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

// logout
exports.logout =  function(req, res) {
  delete req.session.user
  //delete app.locals.user

  res.redirect('/')
}

// userlist page
exports.list = function(req, res) {
  User.fetch(function(err, users) {
    if (err) {
      console.log(err)
    }

    res.render('userlist', {
      title: 'imooc 用户列表页',
      users: users
    })
  })
}

// midware for user
exports.signinRequired = function(req, res, next) {
  var user = req.session.user

  if (!user) {
    return res.redirect('/signin')
  }

  next()
}

exports.adminRequired = function(req, res, next) {
  var user = req.session.user

  if (user.role <= 10) {
    return res.redirect('/signin')
  }

  next()
}
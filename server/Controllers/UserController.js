var mongoose = require('mongoose')
var UserModal = mongoose.model('UserModal');

// code: 0, msg: ok
// code: 1, msg: eMail has been used

exports.signup = function(req, res) {
  var _user = req.body.user;
  console.log(_user);
  


  User.findOne({eMail: _user.eMail},  function(err, user) {
    if (err) {
      console.log(err)
    }

    if (user) {
      res.json({
        code: 1,
        msg: 'eMail has been used',
      });
    }
    else {

      
      user = new User(_user)
      user.save(function(err, user) {
        if (err) {
          console.log(err)
        }

        res.redirect('/')
      })
    }
  })
}

// signin
exports.signin = function(req, res) {
  var _user = req.body.user
  var name = _user.name
  var password = _user.password

  User.findOne({name: name}, function(err, user) {
    if (err) {
      console.log(err)
    }

    if (!user) {
      return res.redirect('/signup')
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err)
      }

      if (isMatch) {
        req.session.user = user

        return res.redirect('/')
      }
      else {
        return res.redirect('/signin')
      }
    })
  })
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
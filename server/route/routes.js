var UserController = require('../Controllers/UserController');
var TeamController = require('../Controllers/TeamController');

module.exports = function(app) {

    app.get('/api/checkSignIn', UserController.checkSignIn);
    app.get('/api/getUser', UserController.signinRequired, UserController.getUser);

    app.post('/api/user/signup', UserController.signup);
    app.post('/api/user/signin', UserController.signin);

    app.post('/api/team/newTeam', UserController.signinRequired, TeamController.newTeam);
    app.get('/api/team/getTeam', UserController.signinRequired, TeamController.getTeam);

    /* GET home page. */
    app.get('/*', function(req, res, next) {
        res.render('index');
    });
};
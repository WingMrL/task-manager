var UserController = require('../Controllers/UserController');

module.exports = function(app) {


    app.post('/api/user/signup', UserController.signup);
    app.post('/api/user/signin', UserController.signin);

    /* GET home page. */
    app.get('/*', function(req, res, next) {
        res.render('index');
    });
};
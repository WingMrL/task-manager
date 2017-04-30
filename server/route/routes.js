var UserController = require('../Controllers/UserController');

module.exports = function(app) {


    app.post('/api/user/signup', UserController.signup);

    /* GET home page. */
    app.get('/*', function(req, res, next) {
        res.render('index');
    });
};
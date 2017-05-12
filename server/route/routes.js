var UserController = require('../Controllers/UserController');
var TeamController = require('../Controllers/TeamController');
var ApplyController = require('../Controllers/ApplyController');
var ProjectController = require('../Controllers/ProjectController');
var TaskController = require('../Controllers/TaskController');


module.exports = function(app) {

    app.get('/api/checkSignIn', UserController.checkSignIn);

    app.get('/api/user/getUser', UserController.signinRequired, UserController.getUser);
    app.post('/api/user/signup', UserController.signup);
    app.post('/api/user/signin', UserController.signin);

    app.post('/api/team/newTeam', UserController.signinRequired, TeamController.newTeam);
    app.get('/api/team/getTeam', UserController.signinRequired, TeamController.getTeam);
    app.get('/api/team/getTeamByJoinId', TeamController.getTeamByJoinId);

    app.post('/api/apply/applyJoinIn', UserController.signinRequired, ApplyController.applyJoinIn);
    app.post('/api/apply/rejectApply', UserController.signinRequired, ApplyController.rejectApply);
    app.post('/api/apply/approvalApply', UserController.signinRequired, ApplyController.approvalApply);

    app.post('/api/project/newProject', UserController.signinRequired, ProjectController.newProject);
    app.get('/api/project/getProject', UserController.signinRequired, ProjectController.getProject);

    app.post('/api/task/newTask', UserController.signinRequired, TaskController.newTask);


    /* GET home page. */
    app.get('/*', function(req, res, next) {
        res.render('index');
    });
};
var UserController = require('../Controllers/UserController');
var TeamController = require('../Controllers/TeamController');
var ApplyController = require('../Controllers/ApplyController');
var ProjectController = require('../Controllers/ProjectController');
var TaskController = require('../Controllers/TaskController');
var CommentController =require('../Controllers/CommentController');


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
    app.post('/api/task/changeExecutorAndDeadLine', UserController.signinRequired, TaskController.changeExecutorAndDeadLine);
    app.post('/api/task/toggleTaskFinish', UserController.signinRequired, TaskController.toggleTaskFinish);
    app.get('/api/task/getTask', UserController.signinRequired, TaskController.getTask);
    app.post('/api/task/editTaskNameAndTaskDescription', UserController.signinRequired, TaskController.editTaskNameAndTaskDescription);
    app.post('/api/task/deleteTask', UserController.signinRequired, TaskController.deleteTask);

    app.post('/api/comment/addComment', UserController.signinRequired, CommentController.addComment);


    /* GET home page. */
    app.get('/*', function(req, res, next) {
        res.render('index');
    });
};
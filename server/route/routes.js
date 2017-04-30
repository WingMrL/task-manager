let Group = require('../Controllers/group');
let Icon = require('../Controllers/icon');
let Label = require('../Controllers/label');
let upload = require('../Controllers/uploadFile');
let search = require('../Controllers/search');
// var router = express.Router();

module.exports = function(app) {

    app.post('/api/addGroup', Group.addGroup);
    app.get('/api/getGroups', Group.getGroups);
    app.get('/api/getGroup', Group.getGroup);

    app.post('/api/uploadIcon', upload.single('icon'), Icon.addIcon);
    app.get('/api/getIcons', Icon.getIcons);
    app.post('/api/deleteIcons', Icon.deleteIcons);
    app.post('/api/renameIcon', Icon.renameIcon);

    app.post('/api/addLabel', Label.addLabel);
    app.get('/api/getLabels', Label.getLabels);

    app.post('/api/suggest', search.suggestion);
    app.post('/api/search', search.search);


    /* GET home page. */
    app.get('/*', function(req, res, next) {
        res.render('index');
    });
};
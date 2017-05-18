let path = require('path');

const SERVER_HOST = '192.168.0.100';
const SERVER_PORT = '3000';
const DATABASE_HOST = '192.168.0.100';
const DATABASE_PORT = '27017';
const DATABASE_NAME = 'task_manager';
const DATABASE_USER ='';
const DATABASE_PASSWORD = '';
const secret = 'taskmanager';

let userAndPass = '';
if(DATABASE_USER !== '' && DATABASE_PASSWORD !== '') {
    userAndPass = DATABASE_USER + ':' + DATABASE_PASSWORD + '@';
}

const serverHost = 'http://' + SERVER_HOST + ':' + SERVER_PORT;
const dbUrl = 'mongodb://' + userAndPass + DATABASE_HOST + ':' + DATABASE_PORT + '/' + DATABASE_NAME;

let config = {
    secret,
    serverHost,
    dbUrl,
    fileSuffixReg: /\.(png|jpg|svg|jpeg)$/i,
    uploadPath: path.join(__dirname, '..', 'dist', 'upload', 'headimg'),
}

module.exports = config;
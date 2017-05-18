var multer = require('multer');
var path = require('path');
var config = require('../../config/config');
var fs = require('fs');

try{
    fs.accessSync(config.uploadPath); 
}catch(e){
    try {
        fs.mkdirSync(config.uploadPath);
    } catch (e) {
        console.log(e);
    }
} 

var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        try {
            fs.mkdirSync(folder);
        } catch (e) {
            console.log(e);
        }
    }  
};

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = config.uploadPath; // 上传头像的文件夹
        createFolder(folder);
        cb(null, folder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        let originalname = req.body.filename;
        let filename = originalname.replace(config.fileSuffixReg, '');
        let suffix = originalname.match(config.fileSuffixReg)[0];
        let trueName = filename + '-timestamp' + Date.now() + suffix;
        req.body.trueName = trueName;
        cb(null, trueName);  
        // cb(null, file.originalname);
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })

module.exports = upload;
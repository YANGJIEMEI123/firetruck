const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
let hostname = 'http://localhost:8081/';
// let upload = multer({ dest: __dirname + '/../IMG/' })
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 把上传的图片按月份分开存储  IMG/2019/01    IMG/ 2019/02 IMG/2019/03
        let dirname =  __dirname + '/../UPLOAD/' +(new Date().getDate())+'/'+(new Date().getMinutes())+'/';
        if(!fs.existsSync(dirname)){//如果文件不存在
            fs.mkdirSync(dirname, {recursive:true});//创建这个文件
        }
        cb(null, dirname)
    },
    filename: function (req, file, cb) {
        // 文件名称不能重复  
        // 需要加上后缀
        cb(null, '车辆基本信息'+'.'+file.originalname.split('.').pop());
    }
});
let upload = multer({ storage: storage });

router.post('/', upload.single('file'), (req, res) => {
    console.log(req.file);
    let data = {
        "code": 0
        , "msg": ""
        , "data": {}
    }
    let dirname = 'UPLOAD/'+(new Date().getDate())+'/'+(new Date().getMinutes())+'/';
    data.data.src = hostname + dirname + req.file.filename;
    res.json(data);
});


module.exports = router;
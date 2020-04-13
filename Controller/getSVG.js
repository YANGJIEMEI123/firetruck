const svgCaptcha = require('svg-captcha');
const express = require('express');
const router = express.Router();
const session=require("express-session");
var app=express();

app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
        cookie: {secure:false,maxAge:1000*60*20}
    }));

router.post('/',function(req,res){
    var codeConfig = {
        size: 5,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        height: 44 
    }
    var captcha = svgCaptcha.create(codeConfig);
    req.session.captcha = captcha.text.toLowerCase(); //存session用于验证接口获取文字码
    var codeData = {
        img:captcha.data
    }
    res.send(codeData);

})
module.exports = router;
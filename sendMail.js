const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
var session=require("express-session");
var app=express();

app.use(session({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: true,
      cookie: {secure:false,maxAge:1000*60*10}//10分钟有效
  }));

　　// 创建可重用邮件传输器
　　const transporter = nodemailer.createTransport({
　　　　host: "smtp.qq.com", // qq的邮件地址
　　　　port: 465, // 端口
　　　　secureConnection: false, // use SSL 是否使用安全连接，对https协议的
　　　　auth: {
　　　　　　"user": '2660397441@qq.com', // 邮箱账号
　　　　　　"pass": 'ktcffhszprffdiea' // 邮箱的授权码
　　　　}
　　});


router.post("/",function(req,res){ //调用指定的邮箱给用户发送邮件
  console.log('this is'+req.body.sendEma)
  var code='';
  　for(var i=0;i<6;i++){

    　　　　var radom = Math.floor(Math.random()*10);
    
    　　　　code += radom;
    
    　　}
            var mailOption={
                from:"2660397441@qq.com",
                to:req.body.sendEma,//收件人
                subject:"消防车辆保养管理系统--邮箱验证码",//纯文本
                html:"<h1>欢迎注册消防车辆保养管理系统，您本次的注册验证码为："+code+"</h1>"
            };
        transporter.sendMail(mailOption,function(error,info){
                    if(error){
                        res.send("1");
                        return console.info(error);
                    }else{
                        req.session.yanzhengma=code;
                        console.log(req.session.yanzhengma)
                        // res.send(req.session.yanzhengma)
                        res.send("2");
                        console.info("Message send"+code);
                    }
                })
        
        })

        module.exports = router;





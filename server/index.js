const express = require('express');//express是node.js的前端框架
const mysql = require("mysql");
const bodyParser = require('body-parser');
// const formidable=require('formidable');
var XLSX = require('node-xlsx');
// var fs=require('fs');
const app = express();
// const fs=require('fs');
// var nodemailer=require("nodemailer");
// var express=require("express");
var session=require("express-session");



// apikey='1a5251c85a843773d951dac515cf769f';
// 建立数据库,连接
let mydb = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "firetruck"
})
mydb.connect();


app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
        cookie: {secure:false,maxAge:1000*60*20}
    }));
 
  
// app.use(require('./Tools/cors').cors);
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header('Access-Control-Allow-Headers:content-type,token,id');
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    next();
});


app.use(bodyParser.json());




app.post("/regist", function (req, res) {
    // console.log(req.body.captcha+'and'+req.session.yanzhengma)
    console.log('注册')
    console.log(req.body.yzmNum)
    var sql = "select * from fireman where account='" + req.body.account + "'";
    mydb.query(sql, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
        if (results.length > 0) {
            res.json({
                msg: "username_has_exited"
            })
        } 
   
        else {

            if(req.body.captcha!==req.body.yzmNum){

                res.json({
                    msg:'验证码错误'
                })
            }else{
                let newsql = `insert into fireman(account,passwd) values('${req.body.account}','${req.body.passwd}')`
                mydb.query(newsql, function (err, results) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    res.json(results)
                })
            }
         
        }
    })
})

app.post("/login", function (req, res) {
    var sql = "select * from fireman where account='" + req.body.account + "'";
    mydb.query(sql, function (err, results) {
        // console.log(results);
        console.log(results[0].passwd)
        console.log(req.body.password)
        console.log(results.passwd ==req.body.password )
        if(results.length<=0){
            res.json({msg:'account is not exist'})
        }
        else{
            if(results[0].passwd ==req.body.password ) {
            res.json({
                msg: "login success",
               
            });
           
        }else{
            res.json({msg:'password is wrong'})
        }
    }
    })
})

app.get('/getCarInfor',function(req,res){
   console.log(req.body)
    let sql='select license_num,car_class,car_device,scrap_state from carinfor where license_num!=""'
    mydb.query(sql, function (err, results) {
        if(err){
            console.log(err)
        }
       else if(results.length>0){
            // res.send(results)
            res.json({"code": 0,
            "msg": "success",
            "data": {
              'table':results,
            //   "totalPage": 3,//共两页
            //   "currPage": 1,//当前显示第一页
            //   "totalSize": 17,//总共17条信息
            //   "currSize": 6//一页10条
            }})
        }else{
            res.json({msg:'data is not exist'})
        }
       
    })
})


//删除车辆信息
app.post('/deleteCar',(req,res)=>{
let sql='delete from carinfor where license_num="'+req.body.license_num+'"'
mydb.query(sql,function(err,results){
if(err){
    console.log(err)
}
else{
    res.json('delete success')
}
})
})



app.get('/', (req, res) => {
    res.send('Hello World!');
});
//不用子路由,直接在/后面添路径


//将上传的图片保存在本地IMG里面
app.use('/inforUpload', require('./Controller/inforUpload'));
app.use('/UPLOAD', express.static(__dirname + '/UPLOAD'));

//邮箱验证码
app.use('/getEma',require('./sendMail'));
//图片验证码
app.use('/getSVG',require('./Controller/getSVG'))
//批量导入数据到数据库
app.post('/updatecarinfor',function(req,res){
    console.log('yes');
    console.log(req.body.upsrc);
    const realsrc=req.body.upsrc;
    var list = XLSX.parse('.'+realsrc.slice(realsrc.indexOf("/",7)));
    // var len=list[0].data.length;
    var arr=list[0].data;
    var newArr = arr.filter((val, index, arr) => {
        return index !== 0;
    })

    console.log(newArr);
    var values=newArr;

     //如果数据库中数据已存在,就删除原来的数据替换它,如果不存在则等同于insert into
            var sql=`replace into carinfor(license_num,car_class,car_device) values?`
            mydb.query(sql,[values],function(err,rows,fields){
                console.log(rows+'and'+fields)
                if(err){
                    console.log(err);
                    return;
                }
                res.json({msg:'import success'})
                 
            }            
            ) 

    
})









app.listen(8081, () => {
    console.log('Example app listening on port 8081!');


});
const express = require('express');//express是node.js的前端框架
const mysql = require("mysql");
const bodyParser = require('body-parser');
var XLSX = require('node-xlsx');
const app = express();
const nodemailer=require("nodemailer");
const session=require("express-session");
const nodeExcel = require("excel-export");//首先，引入excel模块：


app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","*");
    res.header("X-Powered-By",' 3.2.1');
    res.header('Access-Control-Allow-Headers:content-type,token,id');
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    next();
});
app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {secure:false,maxAge:1000*60*1440},//24小时有效,
        rolling:true
    }));
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



app.use(bodyParser.urlencoded({
    extended: true
}));
//这就是



app.use(bodyParser.json());
  
  　　// 创建可重用邮件传输器
  　　const transporter = nodemailer.createTransport({
  　　　　host: "smtp.qq.com", // qq的邮件地址
  　　　　port: 465, // 端口
  　　　　secureConnection: false, // use SSL 是否使用安全连接
  　　　　auth: {
  　　　　　　"user": '2660397441@qq.com', // 邮箱账号
  　　　　　　"pass": 'ktcffhszprffdiea' // 邮箱的授权码
  　　　　}
  　　});
  app.post("/getEma",function(req,res){ //调用指定的邮箱给用户发送邮件
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

                          req.sessionStore.yanzhengma=code;
                          console.log(req.sessionStore)
                          res.send("2");
                          console.info("Message send"+req.sessionStore.yanzhengma);
                      }
                  })
          
          })

app.post("/findYzm",function(req,res){
    if(req.body.yzm===req.sessionStore.yanzhengma){
        res.json({
            code:1
        })
    }
    else{
        res.json({code:0})
    }
})

app.post("/regist", function (req, res) {
    console.log('注册');
    console.log(req.sessionStore.yanzhengma);
    console.log(req.session.yanzhengma)
    console.log(req.body.captcha)
    var sql = "select * from manager where account='" + req.body.account + "'";
    mydb.query(sql, function (err, results) {
        if (err) {
            console.log(err);
            return;
        }
       else if (results.length > 0) {
            res.json({
                msg: "username_has_exited"
            })
        } 
        else {
            if(req.body.captcha!==req.sessionStore.yanzhengma){
                res.json({
                    msg:'验证码错误'
                });
            }else{
                let newsql = `insert into manager(account,username,passwd) values('${req.body.account}','${req.body.user_name}','${req.body.passwd}')`
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
    // console.log(req.sessionStore);

    var sql = "select * from manager where account='" + req.body.account + "'";
    mydb.query(sql, function (err, results) {
    
        console.log(results.passwd ===req.body.password )
        if(results.length<=0){
            res.json({msg:'account is not exist'})
        }
        else{
          
            if(results[0].passwd!==req.body.password){
                res.send("密码错误");
            }
            else if(req.sessionStore.svg_captcha!==req.body.captcha){
                res.send("验证码错误");
            }
            else{
                req.sessionStore.userAccount=req.body.account
                res.json({
                    msg: "login success",
                   
                });
               
        }           

        }
   
    })
})

app.get('/user',function (req,res) {  
let pass=req.sessionStore.userAccount; 
console.log("pass"+pass);
// console.log("pass"+req.session.userAccount);
if(pass){
    //说明用户身份一直存在的，取库数据，并且返回
    res.send({
        msg:"登录信息存在"
    })
}else{
   res.send({
       msg:"登录信息已过期或不存在"
   })
}
res.end()

})

app.post('/isUser',function(req,res){
    let sql="select account from manager where account='" + req.body.subEmial + "'";
    mydb.query(sql,function(err,results){
        if(err){
            console.log(err)
            return
        }
        if(results.length<=0){
            res.json({
                msg:'not exist'
            })
        }else{
            res.json({
                data:1
            })
        }
    })
})
app.post('/reset',function(req,res){
    if(req.sessionStore.yanzhengma===req.body.captcha){
        // res.json({
        //     data:1
        // })
        let sql='update manager set passwd= "'+req.body.pass+'" where account="'+req.body.eml+'"';
        mydb.query(sql,function(err,results){
            console.log(results);
         if(err){
             console.log(err)
             return
         }
         res.send("1")
        })
    }
    else{
       res.send("0")
    }
   
})
app.get('/username',function(req,res){
    console.log(req.sessionStore.userAccount);
    let sql="select username from manager where account='"+req.sessionStore.userAccount+"'";
    mydb.query(sql,function(err,results){
        console.log(results);
        if(err){
            console.log(err)
        }
       res.send(results)
    })
})

app.get('/deleteuser',function(req,res){
    req.sessionStore.userAccount="";
    var username= req.sessionStore.userAccount
    res.send(username);
})



app.get('/getCarInfor',function(req,res){

    let sql='select license_num,car_class,scrap_state from carinfor where license_num!=""'
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

//删除出警信息
app.post('/deleteOut',(req,res)=>{
    let sql='delete from use_state where state_id="'+req.body.state_id+'"'
    mydb.query(sql,function(err,results){
    if(err){
        console.log(err)
    }
    else{
        res.json('delete success')
    }
    })
    })


//报废车辆

app.post('/scrapCar',(req,res)=>{
    let sql='update carinfor set scrap_state=1 where license_num="'+req.body.license+'"'
    mydb.query(sql,function(err,results){
    if(err){
        console.log(err)
    }
    else{
        res.json('update success')
    }
    })
    })

//新增车辆信息
app.post('/addCar',(req,res)=>{
    console.log(req.body)
   let sql= `insert into manager(license_num,car_class) values('${req.body.license_num}','${req.body.car_class}')`
    mydb.query(sql,function(results,err){
        if(err){
            console.log(err)
            return false
        }
        res.json({
            msg:'success',
            data:results,
        })
    })
})

//导出车辆使用情况信息
    app.get('/exportExcel/:id', function(req, res){
        let sql='select out_time,out_adress,license_num,fault_condition,repair_status from use_state where out_time!=""'
        
        mydb.query(sql,function(err,data){//执行数据操作
            if(err){
                //执行出错
            }else{
                 console.log(typeof data)
                // console.log(JSON.parse(JSON.stringify(data)))
                var arr=JSON.parse(JSON.stringify(data))
                for(let j=0;j<arr.length;j++){
                    arr[j].out_time=arr[j].out_time.substring(0,10);
                    // console.log(arr[j].out_time)
                }
                console.log(arr)

        var conf ={};
        // conf.stylesXmlFile = "styles.xml";
        // var cols =['时间','地点','车辆','故障情况','维修情况']
        conf.cols = [{
            caption:'时间',
            type:'string',
            width:10
           
        },{
            caption:'地点',
            type:'string',
            width:30
          
        },{
            caption:'车辆',
            type:'string',
            width:10
        },{
            caption:'故障情况',
             type:'string'     ,
             width:40         
        },
        {
            caption:'维修情况(0代表未维修,1代表已维修)',
            type:'string',
            width:10
        }
    ];
    var tows = ['out_time','out_adress','license_num','fault_condition','repair_status'];
    console.log(tows[0])
    var jj;
    var datas =[];
        for(var k=0;k<arr.length;k++){//循环数据库得到的数据，因为取出的数据格式为
            //[{'id':2312,'name':'张三','age':'22','sex':'男','banji':'高三一班'},{…………},{…………}]
       //用来装载每次得到的数据
     
       var tow =[];
        for(var m=0;m<tows.length;m++){//内循环取出每个
       
        tow.push(arr[k][tows[m]]);
       
       }
       datas.push(tow)
       console.log(tow)
       console.log(datas)
       jj=datas
    
       }
    console.log("jj",jj)
    conf.rows=jj;
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        res.end(result, 'binary');
   
    }
}
)
 });



 app.get('/exportExcel1/:id', function(req, res){
    let sql='select license_num,car_class,scrap_state from carinfor where license_num!=""'
    
    mydb.query(sql,function(err,data){//执行数据操作
        if(err){
            //执行出错
        }else{
             console.log(data)
            
            var arr=JSON.parse(JSON.stringify(data))
            
            console.log(arr)

    var conf ={};
    // conf.stylesXmlFile = "styles.xml";
    var cols =['车牌号','车辆类型','车辆设备','存续情况']
    conf.cols = [{
        caption:'车牌号',
        type:'string',
        width:10
       
    },{
        caption:'车辆类型',
        type:'string',
        width:15
      
    },{
        caption:'车辆设备',
        type:'string',
        width:30
    },{
        caption:'存续情况(0表示可使用,1表示已报废)',
         type:'number',
         width:20         
    }
  
];
// license_num,car_class,car_device,scrap_state
var tows = ['license_num','car_class','scrap_state'];
// console.log(tows[0])
var jj;
var datas =[];
    for(var k=0;k<arr.length;k++){//循环数据库得到的数据，因为取出的数据格式为
        //[{'id':2312,'name':'张三','age':'22','sex':'男','banji':'高三一班'},{…………},{…………}]
   //用来装载每次得到的数据
 
   var tow =[];
    for(var m=0;m<tows.length;m++){//内循环取出每个
   
    tow.push(arr[k][tows[m]]);
   
   }
   datas.push(tow)
   console.log(tow)
   console.log(datas)
   jj=datas

   }
// console.log("jj",jj)
conf.rows=jj;
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "carInformation.xlsx");
    res.end(result, 'binary');

}
}
)
});




app.get('/', (req, res) => {
    res.send('Hello World!');
});
//不用子路由,直接在/后面添路径


//将上传的文件保存在本地upload里面
app.use('/inforUpload', require('./Controller/inforUpload'));
app.use('/UPLOAD', express.static(__dirname + '/UPLOAD'));

//邮箱验证码
// app.use('/getEma',require('./sendMail'));
//图片验证码
app.use('/getSVG',require('./Controller/getSVG'))
//批量导入车辆基本信息数据到数据库
app.post('/updatecarinfor',function(req,res){
    const realsrc=req.body.upsrc;
    var list = XLSX.parse('.'+realsrc.slice(realsrc.indexOf("/",7)));
    console.log(list[0])
    var arr=list[0].data;
    console.log(arr)
    var newArr = arr.filter((val, index, arr) => {
        return index !== 0;
    })
    // console.log(newArr);
    var values=newArr;
     //如果数据库中数据已存在,就删除原来的数据替换它,如果不存在则等同于insert into
            var sql=`replace into carinfor(license_num,car_class) values?`
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


//批量导入消防员测试成绩基本信息数据到数据库
app.post('/updateTest',function(req,res){
    console.log('yes');
    // console.log(req.body.upsrc);
    const realsrc=req.body.upsrc;
    var list = XLSX.parse('.'+realsrc.slice(realsrc.indexOf("/",7)));
    // var len=list[0].data.length;
    var arr=list[0].data;
    var newArr = arr.filter((val, index, arr) => {
        return index !== 0;
    })
    // console.log(newArr);
    var values=newArr;
     //如果数据库中数据已存在,就删除原来的数据替换它,如果不存在则等同于insert into
            var sql=`replace into test(test_time,serial_number,name,grade) values?`
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


//批量导入消防员基本信息数据到数据库
app.post('/updateMember',function(req,res){
    console.log('yes');
    // console.log(req.body.upsrc);
    const realsrc=req.body.upsrc;
    var list = XLSX.parse('.'+realsrc.slice(realsrc.indexOf("/",7)));
    // var len=list[0].data.length;
    var arr=list[0].data;
    var newArr = arr.filter((val, index, arr) => {
        return index !== 0;
    })
    // console.log(newArr);
    var values=newArr;
     //如果数据库中数据已存在,就删除原来的数据替换它,如果不存在则等同于insert into
            var sql=`replace into member(serial_number,name,age,identify_num,politics_status,contact_way) values?`
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

//批量导入入库信息到数据库
app.post('/updateInbound',function(req,res){
    
    const realsrc=req.body.upsrc;
    var list = XLSX.parse('.'+realsrc.slice(realsrc.indexOf("/",7)));
    
    var arr=list[0].data;
    var newArr = arr.filter((val, index, arr) => {
        return index !== 0;
    })
    
    var values=newArr;

            let sql=`insert into inbound(inbound_time,responsible_person,part_num,part_name,model_num,amount) values?`
            mydb.query(sql,[values],function(err,rows,fields){
               
                if(err){
                    console.log(err);
                    return;
                }
                let mysql="insert into stock(part_num,part_name,model_num,amount) values()"
                res.json({msg:'import success'})  
            }            
            ) 
})



　　

//批量导入出库信息到数据库

app.post('/updateOutbound',function(req,res){
    
    const realsrc=req.body.upsrc;
    var list = XLSX.parse('.'+realsrc.slice(realsrc.indexOf("/",7)));
    
    var arr=list[0].data;
    var newArr = arr.filter((val, index, arr) => {
        return index !== 0;
    })
    
    var values=newArr;
     //如果数据库中数据已存在,就删除原来的数据替换它,如果不存在则等同于insert into
            var sql=`replace into outbound(outbound_time,responsible_person,part_num,amount) values?`
            mydb.query(sql,[values],function(err,rows,fields){
               
                if(err){
                    console.log(err);
                    return;
                }
                res.json({msg:'import success'})  
            }            
            ) 
})



//消防员基本信息渲染表格
app.get('/getMember',function(req,res){

    let sql='select serial_number,name,age,identify_num,politics_status,contact_way from member where serial_number!=""'
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
          
            }})
        }else{
            res.json({msg:'data is not exist'})
        }
       
    })
})


//消防员测试成绩渲染表格
app.get('/getTest',function(req,res){

    let sql='select num,test_time,serial_number,name,grade from test where test_time!=""'
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
          
            }})
        }else{
            res.json({msg:'data is not exist'})
        }
       
    })
})

//入库记录页面渲染
app.get('/getInbound',function(req,res){
    let sql='select i.inbound_time,i.responsible_person from inbound as i  group by i.inbound_time';
    mydb.query(sql,function(err,results){
    if(err){
        console.log(err)
    }
    var arr=JSON.parse(JSON.stringify(results))
    console.log(arr)
    res.send(arr);
    })
})

//出库记录页面渲染
app.get('/getOutbound',function(req,res){
    let sql='select i.outbound_time,i.responsible_person from outbound as i  group by i.outbound_time';
    mydb.query(sql,function(err,results){
    if(err){
        console.log(err)
    }
    var arr=JSON.parse(JSON.stringify(results))
    console.log(arr)
    res.send(arr);
    })
})




//页面渲染详细入库信息
app.post('/getDetailInbound',function(req,res){
    console.log(req.body);
    let sql='select i.part_num,i.part_name,i.model_num,i.amount from inbound as i where i.inbound_time="'+req.body.inbound_time+'" and i.responsible_person="'+req.body.responsible_person+'"';
    mydb.query(sql,function(err,results){
        console.log(results)
        if(err){
            console.log(err)
        }
        
       else if(results.length>0){
            // res.send(results)
            res.json({"code": 0,
            "msg": "success",
            "data": {
              'table':results,
          
            }})
        }else{
            res.json({msg:'data is not exist'})
        }
    })
})


//页面渲染详细出库信息

app.post('/getDetailOutbound',function(req,res){
    console.log(req.body);
    // let sql='select o.part_num,k.part_name,k.model_num,o.amount from outbound as o,(select i.part_name,i.model_num from inbound as i,outbound as j where j.part_num=i.part_num) as k where o.outbound_time="'+req.body.outbound_time+'" and o.responsible_person="'+req.body.responsible_person+'"';
   let sql='select m.part_num,m.part_name,m.model_num,n.amount from  (select i.part_num,i.part_name,i.model_num,sum(i.amount) as s from inbound as i group by i.part_num) as m ,(select o.part_num,o.amount from outbound as o where o.outbound_time="'+req.body.outbound_time+'" and o.responsible_person="'+req.body.responsible_person+'") as n where m.part_num=n.part_num'

    mydb.query(sql,function(err,results){
        console.log(results)
        if(err){
            console.log(err)
        }
        
       else if(results.length>0){
            // res.send(results)
            res.json({"code": 0,
            "msg": "success",
            "data": {
              'table':results,
          
            }})
        }else{
            res.json({msg:'data is not exist'})
        }
    })
})

//页面渲染现有库存信息
app.get('/getStorage',function(req,res){
    console.log(req.body);
    
   let sql='select m.part_num,m.part_name,m.model_num,(m.s-n.k) as tt from (select i.part_num,i.part_name,i.model_num,sum(i.amount) as s from inbound as i group by i.part_num) as m join (select o.part_num,sum(o.amount) as k from outbound as o group by o.part_num) as n on m.part_num=n.part_num'

    mydb.query(sql,function(err,results){

        console.log(results)
        if(err){
            console.log(err)
        }
        
       else if(results.length>0){
            // res.send(results)
            res.json({"code": 0,
            "msg": "success",
            "data": {
              'table':results,
          
            }})
        }else{
            res.json({msg:'data is not exist'})
        }
    })
})



function formatDate(numb, format="-") {
    let time = new Date((numb - 1) * 24 * 3600000 + 1)
    time.setYear(time.getFullYear() - 70)
    let year = time.getFullYear() + ''
    let month = time.getMonth() + 1 + ''
    let date = time.getDate() + ''
    return year+format+(month < 10 ? '0' + month : month)+format+(date < 10 ? '0' + date : date)

}

console.log(formatDate(43832,format="-"));

//导入车辆使用情况信息到数据库
app.post('/updateOutinfor',function(req,res){
    console.log('yes');
    const realsrc=req.body.upsrc;
    var list = XLSX.parse('.'+realsrc.slice(realsrc.indexOf("/",7)));
    var arr=list[0].data;
    var newArr = arr.filter((val, index, arr) => {
        return index !== 0;
    })
 

   
   console.log(newArr)
    var values=newArr;

     //如果数据库中数据已存在,就删除原来的数据替换它,如果不存在则等同于insert into
            var sql=`replace into use_state(out_time,out_adress,license_num,fault_condition,repair_status) values?`
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

//车辆使用情况页面表格获取
app.get('/getUseState',function(req,res){

    let sql='select state_id,out_time,out_adress,license_num,fault_condition,repair_status from use_state where out_time!=""'
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
          
            }})
        }else{
            res.json({msg:'data is not exist'})
        }
       
    })
})

//督促学习
app.post('/getTestLine',function(req,res){
// console.log(req.body.test_line)
// console.log(req.body.kk)
    let sql='select m.name,t.grade,m.contact_way from member as m ,(select serial_number,grade  from test where test_time="'+req.body.test_time+'"and grade<"'+req.body.test_line+'") as t  where m.serial_number=t.serial_number'
    mydb.query(sql, function (err, results) {
        if(err){
            console.log(err)
        }
        else{
            res.send(results)
            // var mes='';
            console.log(results);
            var arr=JSON.parse(JSON.stringify(results))
            console.log(arr);

            for(let i=0;i<arr.length;i++){
                var mailOption={
                    from:"2660397441@qq.com",
                    to:arr[i].contact_way,//收件人
                    subject:"消防知识测试结果通知:",
                    html:"<h1>"+arr[i].name+"同志,您好!您在"+req.body.test_time+"进行的消防知识测试中得到的成绩是"+arr[i].grade+"分,希望您在接下来的日子里认真学习消防知识,争取下次测试有更好的表现!</h1>"
                };




                  transporter.sendMail(mailOption,function(error,info){
                                if(error){
                                    res.send("1");
                                    return console.info(error);
                                }else{
                                  
                                    res.send("2");
                                   
                                }
                            })
                    }
                    
            
               
     
        }
       
       
    })
})

app.listen(8081, () => {
    console.log('Example app listening on port 8081!');


});
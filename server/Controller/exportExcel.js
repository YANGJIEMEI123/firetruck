
// var express = require('express');
// var router = express.Router();

router.get('/downloadEnd',function (req,res) {
var conf ={};//创建一个写入格式map，其中cols(表头)，rows(每一行的数据);
var cols =['时间','地点','车辆','故障情况','维修情况'];//手动创建表头中的内容
conf.cols =[];//在conf中添加cols

for(var i=0;i<cols.length;i++){
    var tits ={};//创建表头数据所对应的类型,其中包括 caption内容 type类型
    tits.caption = cols[i];//添加内容
    tits.type='string';//添加对应类型，这类型对应数据库中的类型，入number，data但一般导出的都是转换为string类型的
    conf.cols.push(tits);//将每一个表头加入cols中
}

model.queryStudent(sql,function(err,data){//执行数据操作
    if(err){
        //执行出错
    }else{
        var tows = ['out_time','out_adress','license_num','fault_condition','repair_status'];//创建一个和表头对应且名称与数据库字段对应数据，便于循环取出数据
        var datas =[];//用于承载数据库中的数据
        for(let i=0;i<data.length;i++){//循环数据库得到的数据，因为取出的数据格式为
                                                    //[{'id':2312,'name':'张三','age':'22','sex':'男','banji':'高三一班'},{…………},{…………}]
            var tow =[];//用来装载每次得到的数据
            for(let j=0;j<tows.length;j++){//内循环取出每个
                    tow.push(data[i][tows[j]].toString());//或者tow.push((data[i].tows[j]).toString());两种形式都是相同的
            }
            datas.push(tow);//将每一个{ }中的数据添加到承载中
        }
        conf.tows = datas;//将所有行加入tows中
        var result =nodeExcel.execute(conf);//将所有数据写入nodeExcel中
        res.setHaeder('Conten-Tyep', 'application/vnd.openxmmlformats:charset:s=utf-8');//设置响应头
        res.setHaeder('Conten-Disposition','attachment:filename="+encodeURLComponent("XXXXX")+".xlsx');//设置下载文件命名
        res.end(result,'binary');//将文件内容传入
         
    }
})
})

module.exports = router;

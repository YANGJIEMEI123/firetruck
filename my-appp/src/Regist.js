import React,{ useState, useEffect } from 'react';//c
// import {Link} from 'react-router';
import axios from 'axios';
import 'antd/dist/antd.css';
import './Regist.css';
import{Form,Input,Row,Col,Button,Card,message} from 'antd';
import  Background from './img/bg.jpg';
// axios.defaults.withCredentials=true;
// axios.defaults.baseURL="http://localhost:8081/"
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 5,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

// function useNameStatus(){
//   const [yzm,setYzm]=useState('获取验证码');
// }

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();
  // const [count,setCount]=useState(60);
  const [yzm,setYzm]=useState('获取验证码');

  useEffect(() => {
    forceUpdate({});
  }, []);
 
  const success = (ms) => {
    message.success(ms);
  };
  
  const error = (ms) => {
    message.error(ms);
  };
  
  const warning = (ms) => {
    message.warning(ms);
  };


  const [disStatus,setdisStatus]=useState(false);
  var flag=false
var changeDisStatus=()=>{
   flag=!flag
 setdisStatus(flag)
}
  var setTime=()=>{
    let countdown = 60;
    const timer = setInterval(() => {
        if (countdown <= 0) {
            clearInterval(timer);
            changeDisStatus();
           setYzm('重新获取');
         
        } else {
          setYzm(`${countdown}s后重新获取`);
            countdown--;
        }
    }, 1000);
  }

  var sectionStyle = {
    width: "100%",
    height: "650px",
    backgroundImage: `url(${Background})` ,
    backgroundRepeat:'no-repeat',
    backgroundSize:"cover",
    backgroundPosition:'center center',
    backgroundAttachment: 'fixed',
  };
  var coverStyle={
    width:'100%',
    height:'100%',
    background:'#00000090',
  
  }
  return (
    <div style={sectionStyle}>
    <div style={coverStyle}>
    <div style={{maxWidth:'600px',height:'492px',border:"1px solid #cccccc30",margin:'auto',position:'absolute',top:'0',right:'0',bottom:'0',left:'0',display:"flex",flexDirection:'column',alignContent:'center'}}>
   <Card id="regCard" title="消防车辆保养管理系统"  style={{backgroundColor:'#f0f5ff50',borderColor:'#87e8de'}} >
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      // onFinish={onFinish}
     
      scrollToFirstError
    >


      
      <Form.Item
        name="email"
        label="邮箱"
        htmlFor="email"
        shouldUpdate='true'
        validateFirst='true'
       
        rules={[
        
          {
            required: true,
            message: '账号不能为空',
          },{
            type:'email' ,
            message:'邮箱格式错误'      
          },
        
        ]}
      >
       
        <Input   size="large"   autoComplete="off"
          // addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
         
        />
      </Form.Item>


      <Form.Item
        name="username"
        label="用户名"
        htmlFor="username"
        shouldUpdate='true'
        // validateFirst='true'
        rules={[
        
          {
            required: true,
            message: '用户名不能为空',
          }
        
        ]}
      >
       
        <Input   size="large"
          // addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
          placeholder="请输入真实姓名"
          autoComplete="off"
         
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        autoComplete="off"
        htmlFor='pw'
        validateFirst='true'
        rules={[
          {
            required: true,
            message: '密码不能为空',
          },
          { pattern:new RegExp('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$'),message:'密码为8-16位数字和字母的组合'}
        
        ]}
        hasFeedback
      >
        <Input.Password   autoComplete="off"  size="large" placeholder="密码为8-16位数字和字母的组合"/>
      </Form.Item>

      <Form.Item
        name="confirm"
        label="确认密码"
     
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '密码不能为空',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if((!value || getFieldValue('password') === value)){
               
                  return Promise.resolve();
                }
  
                return Promise.reject('两次输入的密码不一致');
           
        
            },
          }),
        ]}
      >
        <Input.Password   autoComplete="off" size="large"/>
      </Form.Item>

      
     

  <Form.Item label="验证码"  >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="captcha"
              htmlFor='captcha'
              // noStyle
              rules={[
                {
                  required: true,
                  message: '请输入验证码',
                },
             
              ]}
            >
              <Input   autoComplete="off" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Button  style={{width:'100%'}}  disabled={disStatus} size="large"
              onClick={()=>{
                if(document.getElementById('register_email').value===""){
                 warning("请先输入邮箱!")
                  return
                }
              axios.post('http://localhost:8081/getEma',{sendEma:document.getElementById('register_email').value}).then(function(response){
              console.log(response)
              if(response.data===1){
                error('验证码发送失败!');
              }else if(response.data===2){
                success('验证码发送成功!')
                changeDisStatus();
                setTime();
              }
              }).catch(function(err){
                console.log(err);
              })
            }
            }>{yzm}</Button>
          </Col>
        </Row>
      </Form.Item>

     
      <Form.Item {...tailFormItemLayout}>
        {/* <Link to='/Regist'> */}
        <Button  type="primary" htmlType="submit"  

// disabled={
//   !form.isFieldsTouched(true) ||
//   form.getFieldsError().filter(({ errors }) => errors.length).length
// }
        onClick={()=>{
      //   if(getFieldValue('email')){alert('buneng')
      //   return
      // }
          
          axios.post('http://localhost:8081/regist',{account:document.getElementById('register_email').value,user_name:document.getElementById("register_username").value,passwd:document.getElementById('register_password').value,captcha:document.getElementById('register_captcha').value}).then(function(response){
            if(response.data.msg==='username_has_exited'){
              warning('注册失败,用户已存在!')
              return
            }
             if(response.data.msg==='验证码错误'){
              error('验证码错误!')
              return
            }
            success('注册成功!')
            window.location.href="/"
          }).catch(function(err){
            console.log(err);
          })
        }}
        >
          注册
        </Button>
        {/* </Link> */}
      </Form.Item>
    </Form>
    </Card>
    </div>
    </div>
    </div>
  );
};

// ReactDOM.render(<RegistrationForm />, mountNode);
export default RegistrationForm;
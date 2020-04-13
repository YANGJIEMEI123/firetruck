import React,{ useState, useEffect } from 'react';//c
import {Link} from 'react-router';
import axios from 'axios';
import 'antd/dist/antd.css';
import{Form,Input,Row,Col,Checkbox,Button} from 'antd';


const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
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
  // const [count,setCount]=useState(60);
  const [yzm,setYzm]=useState('获取验证码');
  useEffect(()=>{
  
  })
  const [disStatus,setdisStatus]=useState(false);
  var flag=false
var changeDisStatus=()=>{
   flag=!flag
 setdisStatus(flag)
}
  var setTime=()=>{
    let countdown = 10;
    // @ts-ignore
  
    const timer = setInterval(() => {
        if (countdown <= 0) {
            clearInterval(timer);
            changeDisStatus();
           setYzm('重新获取');
         
        } else {
          // changeDisStatus();
          setYzm(`${countdown}s后重新获取`);
            countdown--;
        }
        // editCookie('secondsremained', countdown, countdown + 1);
    }, 1000);
  }

  // const [yzmNum,setYzmNum]=useState('');



  
const onFinish = values => {
  console.log('Received values of form: ', values);
};
  return (
    <div style={{maxWidth:'500px',height:'600px',margin:'auto',position:'absolute',top:'0',right:'0',bottom:'0',left:'0'}}>
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
    
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
       
        <Input  
          // addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
          placeholder='请输入手机号或者邮箱'
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
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
        <Input.Password  placeholder="请输入您的密码"/>
      </Form.Item>

      <Form.Item
        name="confirm"
        label="确认密码"
     
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '请确认您的密码',
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
        <Input.Password  placeholder="请确认您的密码"/>
      </Form.Item>

      
     

  <Form.Item label="验证码"   extra="We must make sure that your are a human.">
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="captcha"
              htmlFor='captcha'
              noStyle
              rules={[
                {
                  required: true,
                  message: 'Please input the captcha you got!',
                },
             
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Button   disabled={disStatus}
              onClick={()=>{
              axios.post('http://localhost:8081/getEma',{sendEma:document.getElementById('register_email').value}).then(function(response){
              // var ee=this.sendEma ({getFieldValue})=>{getFieldValue('email')}
              console.log(response)
              if(response.data===1){
                alert('发送失败');
              }else if(response.data===2){
                alert('发送成功')
              
                changeDisStatus();
                setTime();
              }
             
                  console.log(response)
              }).catch(function(err){
                console.log(err);
              })
            }
            }>{yzm}</Button>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject('Should accept agreement'),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the agreement
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Link to='/Regist'>
        <Button type="primary" htmlType="submit"  onClick={()=>{
          axios.post('http://localhost:8081/regist',{account:document.getElementById('register_email').value,passwd:document.getElementById('register_password').value,captcha:document.getElementById('register_captcha').value}).then(function(response){
            // console.log(response)
            if(response.data.msg==='username_has_exited'){
              alert('注册失败,用户已存在!')
            }
             if(response.data.msg==='验证码错误'){
              alert('验证码错误!')
            }
          }).catch(function(err){
            console.log(err)
          })
        }}>
          Register
        </Button>
        </Link>
      </Form.Item>
    </Form>
    </div>
  );
};

// ReactDOM.render(<RegistrationForm />, mountNode);
export default RegistrationForm;
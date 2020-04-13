import React,{useState} from 'react';
import {Link} from 'react-router';
import axios from 'axios';
// import { Form, Input, Button, Checkbox } from 'antd';
import {Form,Input,Button,Checkbox, message,Row,Col} from 'antd';
import 'antd/dist/antd.css';
// import { UserOutlined, LockOutlined } from '@ant-design/icons';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const Log = () => {
  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const success = (ms) => {
    message.success(ms);
  };
  
  const error = (ms) => {
    message.error(ms);
  };
  
  const warning = (ms) => {
    message.warning(ms);
  };
  const [nextRoute,setNextRoute]=useState('/');

  const changeRoute=()=>{
    setNextRoute('/Index')
  }
//   const [svgsrc,setSvgsrc]=useState('点击获取验证码')
// const changeSrc=(src)=>{
// setSvgsrc(src);
// }
  return (
    <div  style={{maxWidth:'400px',height:'400px',margin:'auto',position:'absolute',top:'0',right:'0',bottom:'0',left:'0'}}>
    <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="账户"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
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
            <Button   
            style={{backgroundColor:'#66775530'}}
            // style={{background:'url('+{svgsrc}+')'}}
              onClick={()=>{
              axios.post('http://localhost:8081/getSVG',{}).then(function(response){
              console.log(response)
              // changeSrc(response.data.img);
              }).catch(function(err){
                console.log(err);
              })
            }
            }>
              <svg style={{width:'100%',height:'100%'}} xmlns="http://www.w3.org/2000/svg" alt='点击切换验证码'></svg></Button>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Link to={nextRoute}>
        <Button type="primary"  onClick={()=>{
          axios.post('http://localhost:8081/login',{account:document.getElementById('basic_username').value,password:document.getElementById('basic_password').value}).then(function(response){
           console.log(response)
           if(response.data.msg==='account is not exist'){
            //  alert('')
            warning('用户不存在!');
           }
           if(response.data.msg==='login success'){
            success('登录成功!');
            changeRoute();
           }
            if(response.data.msg==='password is wrong'){
           error('密码错误!')
           }
          }).catch(function(err){
            console.log(err)
          })
        }}>
          登录
        </Button>
        </Link>or <Link to='/Regist'>立即注册</Link>
      </Form.Item>
    </Form>
    </div>
  );
};

// ReactDOM.render(<NormalLoginForm />, mountNode);
export default Log;
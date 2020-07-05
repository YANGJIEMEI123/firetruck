
import React,{ useState } from 'react';
import axios from 'axios';
import 'antd/dist/antd.css';
import{Form,Input,Row,Col,Button,message} from 'antd';
// const { Step } = Steps;
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
function getYZM() {

    const [form] = Form.useForm();
    const [yzm,setYzm]=useState('获取验证码');
    const [disStatus,setdisStatus]=useState(false);

    const success = (ms) => {
        message.success(ms);
      };
      
      const error = (ms) => {
        message.error(ms);
      };
      
      const warning = (ms) => {
        message.warning(ms);
      };
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
  
return(
    <div>
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
       
        <Input   size="large"   autoComplete="off" />
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
  </Form>
  </div>
)
}
export default getYZM;
import React from 'react';
import axios from 'axios';
import 'antd/dist/antd.css';
import{Form,Input,Row,Col,Button,message,Steps} from 'antd';
import Background from './img/bg.jpg';
import './Reset.css';
const { Step } = Steps;
// import GetEmail from './GetEmail'
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

class GetEmail extends React.Component{
 constructor(props){
   super(props);
   this.state={
    btn:true,
    eml:''
  }
 }
 
  
  
 success = (ms) => {
    message.success(ms);
  };
  
  error = (ms) => {
    message.error(ms);
  };
  
   warning = (ms) => {
    message.warning(ms);
  };

// var flag=false
  onFinish=(values)=>  {
  console.log(values);
};
changeStatus(){
  // this.setState({
  //   btn:false
  // })
  // this.props.btnStatus(this.state.btn);
  console.log(this.state.btn)
}

getEMA(){
  axios.post("http://localhost:8081/isUser",{subEmial:document.getElementById('register_email').value}).then(function(res){
         console.log(res)
         if(res.data.data===1){
        //  this.changeStatus();
         }
         if(res.data.msg==='not exist'){
           alert('用户不存在')
         }
            }).catch(function(err){
           console.log(err)
            })  
}


render(){


    return(<div style={{paddingTop:50}}>
         <Form
    {...formItemLayout}
   onFinish={this.onFinish}
    name="register"
    // onFinish={onFinish}
   style={{display:'flex'}}
    scrollToFirstError
  >
       <Form.Item
        name="email"
        label="邮箱"
        htmlFor="email"
        shouldUpdate='true'
        validateFirst='true'
        style={{width:'90%'}}
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
       
        <Input   size="large" onChange={this.props.ema}   autoComplete="off" />
</Form.Item>

  <Button type='primary'  size="large"
  onClick={()=>{
      this.getEMA();
  }}
  >确定</Button>


  </Form>
    </div>)
}
}


class SetPasswd extends React.Component{
  constructor(props){
  super(props);
   this.state={
        yzm:'获取验证码',
        disStatus:false,
    
    }
  }
render(){
    var flag=false
    const  changeDisStatus=()=>{
        flag=!flag
          this.setState({
              disStatus:flag
          })
         
         }
    const  setTime=()=>{
          let countdown = 60;
          const timer = setInterval(() => {
              if (countdown <= 0) {
                  clearInterval(timer);
                  changeDisStatus();
                  this.setState({
                    yzm:'重新获取'
                  })
                
               
              } else {
                  this.setState({
                      yzm:`${countdown}s后重新获取`
                  })
                
                  countdown--;
              }
          }, 1000);
        }
   const   GetEmail=()=>{
    console.log(this.props)
           axios.post('http://localhost:8081/getEma',{sendEma:this.props.myEml}).then(function(response){
          
           if(response.data===1){
             message.error('验证码发送失败!');
           }else if(response.data===2){
             message.success('验证码发送成功!')
            changeDisStatus();
              setTime();
           }
           }).catch(function(err){
             console.log(err);
           })
      }

 
    return( 
        <div style={{paddingTop:50}}>
    <Form
      {...formItemLayout}
    //   form={form}
      name="register"
      // onFinish={onFinish}
      scrollToFirstError
    >



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
        <Input.Password  onChange={this.props.pass}  autoComplete="off"  size="large" placeholder="密码为8-16位数字和字母的组合"/>
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
              <Input  onChange={this.props.captcha}  autoComplete="off" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Button  style={{width:'100%'}}  disabled={this.state.disStatus} size="large"
              onClick={GetEmail}>{this.state.yzm}</Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
    </div>
    )
}
}








class Reset extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        current: 0,
        eml:'',
        bts:true,
        captcha:'',
        pass:''
      };
    }
  
    next() {
      const current = this.state.current + 1;
      this.setState({ current });
    }
  
    prev() {
      const current = this.state.current - 1;
      this.setState({ current });
    }
  
    sectionStyle = {
      width: "100%",
      height: "650px",
      backgroundImage: `url(${Background})` ,
      backgroundRepeat:'no-repeat',
      backgroundSize:"cover",
      backgroundPosition:'center center',
      backgroundAttachment: 'fixed',
    };
    coverStyle={
      width:'100%',
      height:'100%',
      background:'#00000090',
    
    }
    btnStatus=(bs)=>{
    this.setState({
      bts:bs
    })
    }

    ema=(e)=>{
    this.setState({
      eml:e.target.value
    })
    }

    captcha=(e)=>{
      this.setState({
        captcha:e.target.value
      })
    }
    pass=(e)=>{
     this.setState({
       pass:e.target.value
     })
    }

    getEml=(e)=>{
      console.log(e)
      this.setState({
        eml:e
      })
    }


    render(props) {

const mm=(e)=>{
 console.log(e)
}
    const  resetPass=()=>{
        axios.post('http://localhost:8081/reset',{eml:this.state.eml,captcha:this.state.captcha,pass:this.state.pass}).catch(function(res){
              mm(res);
          //  if(res.length>0){
          //     alert('密码重置成功')
          //   }
          //   if(res===0){
          //     alert('验证码错误!')
          //   }
            }).catch(function(err){
            console.log(err)
            })
      }
      
      const steps = [
        {
          title: '输入账号',
          content: <GetEmail ema={this.ema.bind(this) } btnStatus={this.btnStatus}></GetEmail>,// ema={(e)=>{this.getEml(e)}}
        },
        {
          title: '重置密码',
          content: <SetPasswd myEml={this.state.eml} pass={this.pass.bind(this)} captcha={this.captcha.bind(this)} />,// myEml={this.state.eml}
        },
      ];
      const { current } = this.state;
      return (
       <div style={this.sectionStyle}>
<div style={this.coverStyle}>
<div style={{maxWidth:'600px',height:'492px',padding:50,border:"1px solid #cccccc30",margin:'auto',position:'absolute',top:'0',right:'0',bottom:'0',left:'0',display:"flex",flexDirection:'column',alignContent:'center'}}>
          <Steps current={current} id="resetStep">
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary"  onClick={() => this.next()}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={() =>
                resetPass()
              }
               >
                确定
              </Button>
            )}
            {current > 0 && (
              <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                上一步
              </Button>
            )}
          </div>
        </div>
        </div>
        </div>
        
      );
    }
};

// ReactDOM.render(<RegistrationForm />, mountNode);
export default Reset;
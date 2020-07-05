import React,{useState,useEffect} from 'react';
import Mytitle from './img/mytitle.png';
import axios from 'axios';
import {Layout,Popconfirm,Menu} from 'antd';
const {Header}=Layout;
// const {Search}=Input;
const MyHeader=()=>{
  const [userName,setUserName]=useState("");
   const getUserName=()=>{
        axios.get("http://localhost:8081/username").then(function(res){
        // console.log(res.data[0].username)
        console.log(res)
        if(res.data.length===0){
            window.location.href="/"
            return
        }
        setUserName(res.data[0].username);
        }).catch(function(err){
             console.log(err)
        })
    }
    const deleteUser=()=>{
        axios.get("http://localhost:8081/deleteuser").then(function(res){
         console.log(res)
         if(res.data.length===0){
             window.location.href="/";
         }
        }).catch(function(err){
           console.log(err)
        })
    }

    useEffect(()=>{
        getUserName();
    },[])
    
        return(
            // <div style={{}}>
            <Header className="header" style={{color:'#fff',width:'100%',display:'flex',justifyContent:'space around'}}>
            <div className="logo" style={{marginRight:600}}>
                <img style={{maxHeight:'30px'}} src={Mytitle} alt="mytitle"/> 
                </div>
        <Menu theme="dark" mode="horizontal" >
        <Menu.Item key="1"   style={{color:'#fff !important'}}>{userName},欢迎登录!</Menu.Item>
        <Menu.Item key="2"> <Popconfirm title="确定退出登录?"
                onConfirm={()=>{
                    deleteUser()
                }}
                >
                <a >注销</a>
                </Popconfirm></Menu.Item>
        {/* <Menu.Item key="3">nav 3</Menu.Item> */}
      </Menu>
             {/* <div style={{marginRight:100}}>{userName},欢迎登录!</div> */}
        
            {/* <Menu style={{backgroundColor:"transparent"}}>
                <Menu.Item>注销</Menu.Item>
            </Menu> */}
            {/* <Search style={{margin:'auto 0'}} maxLength={200} placeholder="input search loading with enterButton"    enterButton /> */}
          </Header>
        //   </div>
        )
    
}
export default MyHeader;
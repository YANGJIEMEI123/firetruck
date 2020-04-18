import React from 'react';
import Mytitle from './img/mytitle.png';

import {Layout} from 'antd';
const {Header}=Layout;
// const {Search}=Input;
class MyHeader extends React.Component{
    render(){
        return(
            <Header className="header" style={{color:'#fff',display:'flex',justifyContent:'space between'}}>
            <div className="logo" ><img style={{maxHeight:'30px'}} src={Mytitle} alt="mytitle"/> </div>
            {/* <Search style={{margin:'auto 0'}} maxLength={200} placeholder="input search loading with enterButton"    enterButton /> */}
          </Header>
        )
    }
}
export default MyHeader;
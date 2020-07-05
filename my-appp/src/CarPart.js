import React from 'react'
import {Breadcrumb,Layout} from 'antd';
import {Link} from 'react-router';
const { Content} = Layout;
// import Highlighter from 'react-highlight-words';
// import {  UploadOutlined} from '@ant-design/icons';
// import axios from 'axios';
class MyBread extends React.Component{
render(){
  return( <div>
     <Breadcrumb>
    <Breadcrumb.Item><Link to="/Index/CarPart/Allstorage">现有库存</Link></Breadcrumb.Item>
    <Breadcrumb.Item>
    <Link to="/Index/CarPart/inbound">入库</Link>
    </Breadcrumb.Item> 
    <Breadcrumb.Item>
    <Link to="/Index/CarPart/outbound">出库</Link>
    </Breadcrumb.Item>
   
  </Breadcrumb>
  <br></br>
  <Content>{this.props.children}</Content>
  </div>)
}
}



export default MyBread;

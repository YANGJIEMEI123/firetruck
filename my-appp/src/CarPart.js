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
  <Content>{this.props.children}</Content>
  </div>)
}
}

// const routes = [
//   {
//     path: '/Index/CarPart/storage',
//     breadcrumbName: '现有库存',
//   },
//   {
//     path: '/Index/CarPart/inbound',
//     breadcrumbName: '入库记录'
//   },
//   {
//     path: '/Index/CarPart/outbound',
//     breadcrumbName: '出库记录',
//   },
// ];

// function itemRender(route, params, routes, paths) {
//   const last = routes.indexOf(route) === routes.length - 1;
//   return last ? (
//     <span>{route.breadcrumbName}</span>
//   ) : (
//     <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
//   );

 
// }

// class MyBread extends React.Component{
//   render(){
//     return(
//     <div>
//     <Breadcrumb itemRender={itemRender} routes={routes} >
//     </Breadcrumb>
//     <div>{this.props.children}</div>
//     </div>
   
//       )
//   }
// }


export default MyBread;

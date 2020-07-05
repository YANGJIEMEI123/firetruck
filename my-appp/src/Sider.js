import React from 'react';
// import { Layout, Menu} from 'antd';
import {Layout,Menu} from 'antd';
import 'antd/dist/antd.css';

import {Link} from 'react-router';
const {  Sider} = Layout;
const { SubMenu } = Menu;

class MySider extends React.Component{
    render(){
        return(
            <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          // defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu
            key="sub1"
            title={
              <span>
            
               消防车管理
              </span>
            }
          >
           
            <Menu.Item key="1">
             <Link to='/Index/CarInfor'>车辆基本信息</Link> 
                </Menu.Item>
            <Menu.Item key="2"> <Link to='/Index/CarState'>车辆使用情况</Link></Menu.Item>
            <Menu.Item key="3"> <Link to='/Index/CarPart'>车辆零部件管理</Link></Menu.Item>
            {/* <Menu.Item key="4"></Menu.Item> */}
          
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                {/* <Icon type="laptop" /> */}
                消防员管理
              </span>
            }
          >
             <Menu.Item key="4"><Link to='/Index/Member'>消防员基本信息</Link></Menu.Item>
            <Menu.Item key="5"><Link to='/Index/Test'>消防知识测试成绩</Link></Menu.Item>
          
          </SubMenu>
    
        </Menu>
      </Sider>
        )
    }
}
export default MySider;
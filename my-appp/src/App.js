import React from 'react';
import './index.css';
import {Layout} from 'antd';
import 'antd/dist/antd.css';
import MyHeader from './Header';
import MySider from './Sider';
// import CarInfor from './CarInfor';
const { Content,Footer } = Layout;
class App extends React.Component{
  state={

  }
  render(){
    return(
<Layout>
   <MyHeader/>
    <Layout>
      <MySider/>
      <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {/* <CarInfor/> */}
          {this.props.children}
        </Content>
    </Layout>
    <Footer>Footer</Footer>
  </Layout>
    )
  }
}

export default App;


  

 


import React from 'react';
import {Table,Button,Upload,message} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/antd.css';
import reqwest from 'reqwest';
// var btnexist=false;




// const text = '确定导入表格';
class InforUpload extends React.Component {
  constructor(){
    super();
    this.state={
     upsrc:'',
     props:{
      name: 'file',
      action: 'http://localhost:8081/inforUpload',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info){

        if (info.file.status !== 'uploading') {
          console.log(info.fileList);
        
        }
        if (info.file.status !== 'removed') {
         
        }
        if (info.file.status === 'done') {
          this.setState({
            upsrc:info.fileList[0].response.data.src
          },()=>{
            console.log(this.state.upsrc);
          })
          console.log(info.fileList[0].response.data.src);
          message.success(`${info.file.name} file uploaded successfully`);
        
          
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    
    }
    }
    this.state.props.onChange=this.state.props.onChange.bind(this);
    // const props = ;
  }
  
  // componentDidMount(){
  //   console.log(props.onChange);
  // }
  onClick=()=>{
    // const _this=this;
    console.log('start');
    axios.post('http://localhost:8081/updatecarinfor',{upsrc:this.state.upsrc}).then(function (response) {
      alert('导入成功');
      console.log(response)
    }).catch(function(err){
       console.log(err);
    })

  }
  render(){
    return(<div>
    <Upload  {...this.state.props}>
      <Button >
        <UploadOutlined /> upload
      </Button>
    </Upload>
    <Button  type="primary" htmlType="submit" onClick={this.onClick} >导入</Button>
    {/* <Popconfirm placement="top" title={text} okText="Yes" cancelText="No"> */}
    
    {/* </Popconfirm> */}
     </div>
     )
    
  }
}





const columns = [
  {
    title: '车牌号',
    dataIndex: 'license_num',
    // sorter: true,
    // render: license_num => `${license_num.first} ${license_num.last}`,
    width: '20%',
  },
  {
    title: '车辆类型',
    dataIndex: 'car_class',
    filters: [
      { text: '水罐消防车', value: '水罐消防车' },
      { text: '泡沫消防车', value: '泡沫消防车' },
    ],
    width: '20%',
  },
  {
    title: '车辆设备',
    dataIndex: 'car_device',
  },
  {
    title: '使用情况',
    dataIndex: 'scrap_state',
  }
];

class CarInfor extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false,
  };

  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      // sortField: sorter.field,
      // sortOrder: sorter.order,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    // axios.get('http://localhost:8081/getCarInfor',{results:10,...params}).then(function(data){
    //   console.log(data.data.length)
    //   const pagination = { ...this.state.pagination };
    //   pagination.total = data.data.length;
    //   this.setState({
    //     loading: false,
    //     data: data.data,
    //     pagination,
    //   });
    // }).catch(function(err){
    //   console.log(err)
    // })



    reqwest({
      url: 'http://localhost:8081/getCarInfor',
      method: 'get',
      data: {//发送到服务器的数据
        results: 10,
        ...params,
      },
      // success:function(res){
      //       var showdata=response;
      // },
      type: 'json',
    }).then(req => {
      // console.log(data[0])
      // console.log(req)
      // console.log(req.data.table.length)
      const pagination = { ...this.state.pagination };
      
      pagination.total = req.data.table.length;
      
      this.setState({
        loading: false,
        data: req.data.table,
        pagination,
      });
    });
  };

  render() {
    return (
      <div>
        <InforUpload></InforUpload>
     
      <Table
        columns={columns}
        // rowKey={()=>{
        //  for(let i=0;i<this.state.data.length;i++){
        //    return i;
        //  }
        // }}
        rowKey={record => record.license_num}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
       </div>
    );
  }
}




  export default CarInfor;
  
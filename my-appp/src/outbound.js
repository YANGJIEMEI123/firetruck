import React,{useState,useEffect} from 'react';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/antd.css';
import {Table,Button,Upload,message,Timeline,Card, Drawer,Form,Input  } from 'antd';

import reqwest from 'reqwest';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

class InforUpload extends React.Component {
  constructor(){
    super();
    this.state={
     upsrc:'',
     dis:true,
     props:{
      name: 'file',
      action: 'http://localhost:8081/inforUpload',
      headers: {
        authorization: 'authorization-text',
      },
      // onClick:this.onClick,
      onChange(info){

        if (info.file.status !== 'uploading') {
          console.log(info.fileList);
        
        }
        if (info.file.status !== 'removed') {
         
        }
        if (info.file.status === 'done') {
          this.setState({
            upsrc:info.fileList[0].response.data.src,
            dis:false
          },()=>{
            console.log(this.state.upsrc);
          })
          console.log(info.fileList[0].response.data.src);
          message.success(`${info.file.name}上传成功 `);
      
          
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败.`);
        }
      }
    
    }
    }
    this.state.props.onChange=this.state.props.onChange.bind(this);
    
  }
  
  onClick=()=>{
    // const _this=this;
    console.log('start');
    axios.post('http://localhost:8081/updateOutbound',{upsrc:this.state.upsrc}).then(function (response) {
      alert('出库数据导入成功');
     
    }).catch(function(err){
       console.log(err);
    })

  }
  render(){
    return(<div style={{display:"flex"}}>
    <Upload  {...this.state.props} style={{marginBottom:"10px;"}}>
      <Button >
        <UploadOutlined /> 出库上传
      </Button>
    </Upload>
    <Button style={{marginRight:20,marginLeft:20}} type="primary" disabled={this.state.dis} htmlType="submit" onClick={this.onClick} >
        新增出库</Button>
     </div>
     )
    
  }
}


 const   CarState =(props)=> {

    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([]);
    const [pagination,setPagination]=useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading,setLoading]=useState(false);
   
  
  
  
   const handleTableChange = (pagination, filters, sorter) => {
      const pager = { ...pagination };
      pager.current = pagination.current;
      setPagination(pager)
     
      fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    };
  
  function setPages(data){
    const page = { ...pagination };
    page.total =data.length;
    setPagination(page)
  }
  
    // fetch();
    useEffect(()=>{
    const fetch = (params = {}) => {
        setLoading(true)
        reqwest({
          url: 'http://localhost:8081/getDetailOutbound',//请求表格数据
          method: 'post',
          data: {//发送到服务器的数据
            results: 10,
            ...params,
            outbound_time:props.outbound_time,
            responsible_person:props.responsible_person
          },
         
          type: 'json',
        }).then(req => {
          var arr=req.data.table;
          setPages(arr);
          setLoading(false);
          setDataSource(arr);
         
        });
      };
  
        fetch();
    
    },[props.outbound_time])
  
  
  
  
  //搜索功能
  
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0])
    setSearchedColumn( dataIndex)
  };
  
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
    
  };
  
  
    const getColumnSearchProps = dataIndex => ({
     
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
         
            placeholder={`搜索 ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
  
      render: text =>
       searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        ),
    });
  
  
  
    const columns = [
       
      {
        title: '零件编号',
        dataIndex: 'part_num',
        width: '10%',
        ...getColumnSearchProps('part_num'),
      },
      {
        title: '零件名称',
        dataIndex: 'part_name',
        width: '10%',
        editable: true,
        ...getColumnSearchProps('part_name'),
        
      },
      {
        title: '型号',
        dataIndex: 'model_num',
        width:"10%"
      },
      {
        title: '数量',
        dataIndex: 'amount',
        width:"5%"
      }
      
  
    ];
  
    
      return (
        <div>
        
        <Form form={form} >
        <Table
       
        rowClassName={() => 'editable-row'}
        bordered
          columns={columns}
          rowKey={record => record.part_num}
          dataSource={dataSource}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
        </Form>
         </div>
      );
        
  }




class Outbound extends React.Component {
    state = {
      reverse: false,
    //   shows:[],
      dataSource: [],
      visible: false,
      in_time:"",
      in_person:'',

    };


    showDrawer = () => {
      this.setState({
        visible: true,
       
      });
      console.log(this.state.in_time)
    };
  
    onClose = () => {
      this.setState({
        visible: false,
       
      });
     
    };
  
    // handleClick = () => {
    //   this.setState({ reverse: !this.state.reverse });
    // };
    getOutbound=()=>{
        axios.get('http://localhost:8081/getOutbound').then((res)=>{
            // console.log(res.data)
            this.setState({ 
                dataSource:res.data 
            });
            console.log(this.state.dataSource);
           }).catch(function(err){
            console.log(err);
           })
    }



    componentWillMount(){
     this.getOutbound();
    }
  
  
    render() {
      let shows=[];
      this.state.dataSource.forEach((element,index)=>{
     
            shows.push(<Timeline.Item key={index}>
                {element.outbound_time}<span style={{marginLeft:10}}>负责人:</span><b style={{marginRight:10}}> {element.responsible_person}</b>
                <a  onClick={()=>
                {
                  
                    var  tt=element.outbound_time;
                    var pp=element.responsible_person;
                   
                    this.setState({in_time:tt,in_person:pp});
                    this.showDrawer();
      
                }} key={index}>出库详情</a>
             </Timeline.Item>)
          
          
      })
      return (
        <div>
            <InforUpload></InforUpload>
            <br></br>
        

            {/* <Button type="primary" size="small" style={{ marginBottom: 16 }} onClick={this.handleClick}>
           倒序
          </Button  > */}
          <Card title="出库信息"   style={{width:550}}>
          <Timeline  reverse='false'>
           {shows}
            {/* <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
            <Timeline.Item>Technical testing 2015-09-01</Timeline.Item> */}
          </Timeline>

          <Drawer
            width={740}
            placement="right"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
          >
             <CarState outbound_time={this.state.in_time}  responsible_person={this.state.in_person}></CarState>
          </Drawer>
          </Card>
    
        </div>
      );
    }
  }


export default Outbound;
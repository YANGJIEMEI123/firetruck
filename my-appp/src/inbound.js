import React ,{useState,useEffect}from 'react';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/antd.css';
import {Table,Button,Upload,message,Input, Form,Tag,Tooltip } from 'antd';
//显示出警状态,记录故障情况
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
    axios.post('http://localhost:8081/updateOutinfor',{upsrc:this.state.upsrc}).then(function (response) {
      alert('导入成功');
      console.log(response)
    }).catch(function(err){
       console.log(err);
    })

  }
  render(){
    return(<div style={{display:"flex"}}>
    <Upload  {...this.state.props} style={{marginBottom:"10px;"}}>
      <Button >
        <UploadOutlined /> 入库上传
      </Button>
    </Upload>
    <Button style={{marginRight:20,marginLeft:20}} type="primary" disabled={this.state.dis} htmlType="submit" onClick={this.onClick} >确认入库</Button>
    {/* <Button  type="primary"  id="exportExcel" onClick={()=>{

    console.info("exportExcel");
    var url =  "http://localhost:8081/exportExcel/" + 1;
    console.info(url);
    window.location = url;
    }} >导出</Button> */}
     </div>
     )
    
  }
}





const Inbound =()=> {

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
        url: 'http://localhost:8081/getUseState',//请求表格数据
        method: 'get',
        data: {//发送到服务器的数据
          results: 10,
          ...params,
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
  
  },[])




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
      title: '出警时间',
      dataIndex: 'out_time',
      width: '15%',
      ...getColumnSearchProps('out_time'),
    },
    {
      title: '出警地点',
      dataIndex: 'out_adress',
      width: '20%',
      editable: true,
      ...getColumnSearchProps('out_adress'),
      
    },
    {
      title: '出警车辆',
      dataIndex: 'license_num',
      width:"12%"
    },
    {
      title: '故障情况',
      dataIndex: 'fault_condition',
      width:"20%"
    },
    {
      title: '维修情况',
      dataIndex: 'repair_status',
      width: '15%',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.repair_status - b.repair_status,
      render:(text,record)=>{
        const  defaultValue=record.repair_status;
        if(defaultValue==="0"){
          return(<div>
          <Tooltip placement="top" title="点击修改状态为'已维修'">
          <Tag color="gold">待维修</Tag>
          </Tooltip>
            </div>)
        }
        else{
          return(<div>
           
            <Tag color="lime">已维修</Tag>
         
              </div>)
        }
         
      }
  
    },

  ];

  
    return (
      <div>
        <InforUpload></InforUpload>
      <br></br>
      <Form form={form} >
      <Table
     
      rowClassName={() => 'editable-row'}
      bordered
        columns={columns}
        rowKey={record => record.license_num}
        dataSource={dataSource}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      </Form>
       </div>
    );
      
}


  
export default Inbound;
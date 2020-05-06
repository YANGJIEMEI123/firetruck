import React ,{useState,useEffect}from 'react';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/antd.css';
import {Table,Button,Upload,message,Input, Form,DatePicker,InputNumber } from 'antd';
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
    axios.post('http://localhost:8081/updateTest',{upsrc:this.state.upsrc}).then(function (response) {
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
        <UploadOutlined /> 上传Excel
      </Button>
    </Upload>
    <Button style={{marginRight:20,marginLeft:20}} type="primary" disabled={this.state.dis} htmlType="submit" onClick={this.onClick} >导入</Button>
    <Button  type="primary"  id="exportExcel" onClick={()=>{

    console.info("exportExcel");
    var url =  "http://localhost:8081/exportExcel/" + 1;
    console.info(url);
    window.location = url;
    }} >导出</Button>
     </div>
     )
    
  }
}





const Test =()=> {

  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [pagination,setPagination]=useState({});
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [loading,setLoading]=useState(false);
  const [testDate,setTestDate]=useState("");
  const [testLine,setTestLine]=useState(60);



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
        url: 'http://localhost:8081/getTest',//请求表格数据
        method: 'get',
        data: {//发送到服务器的数据
          results: 10,
          ...params,
        },
       
        type: 'json',
      }).then(req => {
        var arr=req.data.table;
         console.log(arr)
        setPages(arr);
        setLoading(false);
        setDataSource(arr);
        // console.log(dataSource)
       
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

    render: text =>{
    // console.log(text){}
   
     
    
    return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
  }
  });


  function DateChange(date, dateString) {
    console.log(date, dateString);//dataString是日期
    setTestDate(dateString);
  }

  function LineChange(value) {
    console.log(value);
    setTestLine(value);
  }

function publish(){
  // console.log(testDate);
  // console.log(testLine);
  axios.post('http://localhost:8081/getTestLine',{test_time:testDate,test_line:testLine}).then(function(res){
    console.log(res)
  }).catch(function(err){
   console.log(err)
  })
}


  const columns = [
     
    {
      title: '测试时间',
      dataIndex: 'test_time',
      width: '10%',
      ...getColumnSearchProps('test_time'),
    },
    {
      title: '编号',
      dataIndex: 'serial_number',
      width: '11%',
      editable: true,
      ...getColumnSearchProps('serial_number'),
      
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width:"8%",
      ...getColumnSearchProps('name'),
    },
    {
      title: '成绩',
      dataIndex: 'grade',
      width:"8%"
    },
  

  ];

  
    return (
      <div>
        <InforUpload></InforUpload>
      <br></br>
      {/* <div style={{display:"flex",justifyContent:"space-around"}}> */}
      <b>测试时间: </b><DatePicker  onChange={DateChange} />
      <b>达标分数:</b><InputNumber  onChange={LineChange}  min={1} max={100} defaultValue={60}></InputNumber>
      <Button onClick={publish}>
      发布成绩</Button>
      {/* </div> */}
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


//   export default CarState;
  
export default Test;
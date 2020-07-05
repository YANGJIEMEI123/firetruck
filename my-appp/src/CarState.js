import React ,{useState,useEffect}from 'react';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/antd.css';
import {Table,Button,Upload,message,Input,Popconfirm,InputNumber, Form,Tag,Tooltip } from 'antd';
import reqwest from 'reqwest';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
// import {Link} from 'react-router';
// import GetMap from './getMap'

// const NowState=()=>{
//   return( 
//   <Row gutter={16}>
//     {/* <Row gutter={16}> */}
//       <Col span={5} >
//         <Row gutter={4} > <div style={{width:"100%",display:"flex",justifyContent:'center'}}><span style={{color:'red'}} class="iconfont icon-xiaofangchejinzhanhangcheluxiantu"></span></div></Row>
//         <Row gutter={5}><div style={{width:"100%",textAlign:'center',fontSize:15}}> 出警情况</div></Row>
//       </Col>
//       <Col span={8}>
//     <Link to='/Index/OutDetail'>
//         <a  title="查看详情">
//      <Statistic style={{textAlign:'center'}}  title="出警车辆" value={6} />
//      </a>
//      </Link>
//      </Col>
//      <Col span={8}>
//      <a title="查看详情">
//      <Statistic style={{textAlign:'center'}}  title="在队车辆" value={12}  />
//      </a>
//  </Col>
//   </Row>
//   )
// }


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



const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};


const CarState =()=> {

  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [pagination,setPagination]=useState({});
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [loading,setLoading]=useState(false);
  const [editingKey, setEditingKey] = useState('');
 



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
  console.log(data);
  const page = { ...pagination };
  page.total =data.length;
  setPagination(page)
}

// const maps = groupBy(arr, ({relation, fraudStrtus}) => {
//   relation + fraudStrtus
// })


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
        setPages(req.data.table);
        setLoading(false);
        setDataSource(req.data.table);
        // var arr=req.data.table;
        
      });
    };

      fetch();
  
  },[])


//可编辑
const isEditing = record => record.state_id === editingKey;
const edit = record => {
   console.log(record)
  
  form.setFieldsValue({ ...record });
  setEditingKey(record.state_id);
 
};

const cancel = () => {
  setEditingKey('');
};


 
  const handleDelete = key => {
    setDataSource(dataSource.filter(item => item.state_id !== key))
    setPagination({total:()=>this.total-1})
  };


  const save = async key => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex(item => key === item.state_id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
        setEditingKey('');
     
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };


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

// const sameTime=()=>{

// }

  const columns = [
    {
      title:'序号',
      dataIndex:'state_id',
      width:'3%'
    },
     
    {
      title: '出警时间',
      dataIndex: 'out_time',
      width: '12%',
      ...getColumnSearchProps('out_time'),
    },
    {
      title: '出警地点',
      dataIndex: 'out_adress',
      width: '15%',
      editable: true,
      ...getColumnSearchProps('out_adress'),
      editable: true,
      
    },
    {
      title: '出警车辆',
      dataIndex: 'license_num',
      width:"12%"
    },
    {
      title: '故障情况',
      dataIndex: 'fault_condition',
      width:"15%",
      editable: true,
    },
    {
      title: '维修情况',
      dataIndex: 'repair_status',
      width: '8%',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.repair_status - b.repair_status,
      render:(text,record)=>{
        const  defaultValue=record.repair_status;
        if(defaultValue===0){
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
    {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (text, record) =>{
        const editable=isEditing(record);
        // console.log(editable)
        // this.state.dataSource.length >= 1
        if(dataSource.length >= 1){
          return  editable ? (
            <span>
               <Popconfirm title="确定删除出警信息?" onConfirm={() =>{ 
              axios.post('http://localhost:8081/deleteOut',{state_id:record.state_id}).then(function(results){
              console.log(results)
              if(results.data==="delete success"){
                message.success("删除成功!")
              }
              }).catch(function(err){
                console.log(err)
              })
              console.log(record) ;
              return handleDelete(record.state_id)}
          
            }>
              <a href="javascript:void(0);" style={{
                marginRight: 8,
              }}>删除</a>
            </Popconfirm>
            <a href="javascript:void(0);"
              onClick={() => save(record.state_id)
              }
              style={{
                marginRight: 8,
              }}
            >
              保存
            </a>
            <Popconfirm title="确定取消保存?" onConfirm={cancel}>
              <a href="javascript:void(0);">取消</a>
            </Popconfirm>
          </span>
           

          ) : (
            <span>
            <Popconfirm title="确定删除出警信息?" onConfirm={() =>{ 
              axios.post('http://localhost:8081/deleteOut',{state_id:record.state_id}).then(function(results){
              console.log(results)
              }).catch(function(err){
                console.log(err)
              })
              console.log(record) ;
              return handleDelete(record.state_id)}
          
            }>
              <a href="/#" style={{
                marginRight: 8,
              }}>删除</a>
            </Popconfirm>
            <a  href="javascript:void(0);" disabled={editingKey !== ''} onClick={() => edit(record)}>
              编辑
            </a>
            </span>
          );
        }
        else{
          return null
        }
   
      }
    
   
    },
  

  ];

  
    return (
      <div>
        {/* <div style={{width:500,border:"1px #ccc solid",padding:20}}> <NowState ></NowState></div> */}
       {/* <br></br> */}
        <InforUpload></InforUpload>
      <br></br>
    {/* <GetMap></GetMap> */}
      <Form form={form} >
      <Table
     
      rowClassName={() => 'editable-row'}
      bordered
        columns={columns}
        rowKey={record => record.state_id}
        dataSource={dataSource}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      </Form>
       </div>
    );
      
}


  export default CarState;
  
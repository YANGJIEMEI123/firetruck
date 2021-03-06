import React,{useState,useEffect} from 'react';
import {Table,Button,Upload,message,Input,Popconfirm, Form,InputNumber,Tag,Tooltip,Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/antd.css';
import reqwest from 'reqwest';
import Highlighter from 'react-highlight-words';
import { SearchOutlined} from '@ant-design/icons';
// var btnexist=false;
const { Option } = Select;

class InforUpload extends React.Component {
  constructor(){
    super();
    this.state={
     upsrc:'',
     dis:true,
     car_class:'',
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
    axios.post('http://localhost:8081/updatecarinfor',{upsrc:this.state.upsrc}).then(function (response) {
      alert('导入成功');
      console.log(response)
    }).catch(function(err){
       console.log(err);
    })

  }


  getValue=(event)=>{
    //获取被选中的值
    console.log(event.target.value);
    this.setState({
      //默认值改变
      car_class:event.target.value
    })
  }

  render(){
    return(<div style={{display:"flex",justifyContent:"space-between"}}>
      <div style={{display:"flex"}}>
    <Upload  {...this.state.props} style={{marginBottom:"10px;"}}>
      <Button >
        <UploadOutlined /> 上传Excel
      </Button>
    </Upload>
    <Button style={{marginRight:20,marginLeft:20}} type="primary" disabled={this.state.dis} htmlType="submit" onClick={this.onClick} >导入</Button>
    <Button style={{marginRight:20}}  type="primary"  id="exportExcel1" onClick={()=>{
    var url =  "http://localhost:8081/exportExcel1/" +1;
    window.location = url;
    }} >导出</Button>
    </div>
    <div style={{display:"flex"}}>
  
   
    {/* <Input.Group compact>
      <Input id="getNum" style={{ width: '35%' }} placeholder="车牌号"/>
      <Select id="getClass" defaultValue="水罐消防车" onChange={(e)=>this.getValue(e)} >
        <Option value="水罐消防车">水罐消防车</Option>
        <Option value="泡沫消防车"> 泡沫消防车</Option>
        <Option value="二氧化碳消防车">水罐消防车</Option>
        <Option value="云梯消防车"> 泡沫消防车</Option>
        <Option value="通讯指挥消防车">水罐消防车</Option>
        <Option value="泵浦消防车">水罐消防车</Option>
      </Select>
   
      <Button type="primary" onClick={()=>{
      
        axios.post("http://localhost:8081/addCar",
        {license_num:document.getElementById('getNum').value,car_class:this.state.car_class}).catch(function(res){
        if(res.msg==='success'){
          message.success('添加成功!')
        }
        }).catch(function(err){

        })
      }}>
      新增
    </Button>
    </Input.Group> */}
    
    </div>

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





const CarInfor =()=> {

  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [pagination,setPagination]=useState({});
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [loading,setLoading]=useState(false);


 



 const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pagination.current;
    setPagination(pager);
    console.log(pager);
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



const fetch = (params = {}) => {
  setLoading(true)
  reqwest({
    url: 'http://localhost:8081/getCarInfor',//请求表格数据
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
   
  });
};

  useEffect(()=>{
 
      fetch();
  
  },[])






   
//可编辑
const isEditing = record => record.license_num === editingKey;
const edit = record => {
   console.log(record)
  
  form.setFieldsValue({ ...record });
  setEditingKey(record.license_num);
 
};

const cancel = () => {
  setEditingKey('');
};


 
  const handleDelete = key => {
    setDataSource(dataSource.filter(item => item.license_num !== key))
    setPagination({total:()=>this.total-1})
  };


  const save = async key => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex(item => key === item.license_num);

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
          placeholder={`Search ${dataIndex}`}
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
          搜索
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          重置
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
      title: '车牌号',
      dataIndex: 'license_num',
      // sorter: true,
      // render: license_num => `${license_num.first} ${license_num.last}`,
      width: '3%',
      editable: true,
      // getColumnSearchProps('license_num');
      ...getColumnSearchProps('license_num'),//对这一列设置搜索功能
    },
    {
      title: '车辆类型',
      dataIndex: 'car_class',
      filters: [
        { text: '水罐消防车', value: '水罐消防车' },
        { text: '泡沫消防车', value: '泡沫消防车' },
        { text: '二氧化碳消防车', value: '二氧化碳消防车' },
        { text: '云梯消防车', value: '云梯消防车' },
        { text: '泵浦消防车', value: '泵浦消防车' },
        { text: '通讯指挥消防车', value: '通讯指挥消防车' },
      ],
      width: '3%',
      editable: true,
      onFilter: (value, record) => record.car_class.indexOf(value) === 0
      ,
    },
  
    {
      title: '存续状态',
      dataIndex: 'scrap_state',
      defaultSortOrder: 'ascend',
      width: '3%',
      sorter: (a, b) => a.scrap_state - b.scrap_state,
      // editable: true,
      render:(text,record)=>{
        const myDefault=record.scrap_state;
        // console.log(record.scrap_state)
       if(myDefault===0){
        return(<div>
          <Popconfirm title="确定报废这辆消防车" onConfirm={() =>{
          axios.post('http://localhost:8081/scrapCar', {
            license: record.license_num
              }).then(function (res) {
                       console.log(res)
                       record.scrap_state = 1;
                       fetch();
                          }).catch(function (err) {
                          console.log(err)
                 })
              }
             }
          >
           <Tooltip placement="top" title="点击报废消防车辆">
          <Tag color="cyan" >可使用</Tag>
          </Tooltip>
          </Popconfirm>
          </div>)
       }
       else{
        return(<div>
          <Tag color="#d4d2d2">已报废</Tag>
          </div>)
       }

       
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '2%',
      render: (text, record) =>{
        const editable=isEditing(record);
        // console.log(editable)
        // this.state.dataSource.length >= 1
        if(dataSource.length >= 1){
          return  editable ? (
            <span>
               <Popconfirm title="确定删除车辆信息?" onConfirm={() =>{ 
              axios.post('http://localhost:8081/deleteCar',{license_num:record.license_num}).then(function(results){
              console.log(results)
              }).catch(function(err){
                console.log(err)
              })
              console.log(record) ;
              return handleDelete(record.license_num)}
          
            }>
              <a href="javascript:void(0);" style={{
                marginRight: 8,
              }}>删除</a>
            </Popconfirm>
            <a href="javascript:void(0);"
              onClick={() => save(record.license_num)
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
            <Popconfirm title="确定删除车辆信息?" onConfirm={() =>{ 
              axios.post('http://localhost:8081/deleteCar',{license_num:record.license_num}).then(function(results){
              console.log(results)
              }).catch(function(err){
                console.log(err)
              })
              console.log(record) ;
              return handleDelete(record.license_num)}
          
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

  const components = {
    body: {
      // row: EditableRow,
      cell: EditableCell,
    },
  };
  const mergedColumns =columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType:col.dataIndex==='scrap_state'? 'number' : 'text',
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });



    return (
      <div>
       
        <InforUpload></InforUpload>
      <Form  form={form} component={false}> 
    
      <br></br>
      <Table
      components={components}
      rowClassName={() => 'editable-row'}
      bordered
        columns={mergedColumns}
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


  export default CarInfor;
  
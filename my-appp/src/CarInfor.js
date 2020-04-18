import React,{useState,useEffect} from 'react';
import {Table,Button,Upload,message,Input,Popconfirm, Form,InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/antd.css';
import reqwest from 'reqwest';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
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

// const EditableContext = React.createContext();

// const EditableRow = ({ index, ...props }) => {
//   const [form] = Form.useForm();
//   return (
//     <Form form={form} component={false}>
//       <EditableContext.Provider value={form}>
//         <tr {...props} />
//       </EditableContext.Provider>
//     </Form>
//   );
// };

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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0])
    setSearchedColumn( dataIndex)
    // this.setState({
    //   searchText: selectedKeys[0],
    //   searchedColumn: dataIndex,
    // });
  };

 const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
    // this.setState({ searchText: '' });
  };



 const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pagination.current;
    setPagination(pager)
    // this.setState({
    //   pagination: pager,
    // });
    fetch({
      results: pagination.pageSize,
      page: pagination.current,
      // sortField: sorter.field,
      // sortOrder: sorter.order,
      ...filters,
    });
  };

 const fetch = (params = {}) => {
    // setLoading(true)
    reqwest({
      url: 'http://localhost:8081/getCarInfor',//请求表格数据
      method: 'get',
      data: {//发送到服务器的数据
        results: 10,
        ...params,
      },
     
      type: 'json',
    }).then(req => {
     const  paginations = { ...pagination };
      paginations.total = req.data.table.length;
      setLoading(false);
      setDataSource(req.data.table);
      setPagination(paginations);
      
    });
  };

  useEffect(()=>{
    fetch();
  })
   





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
    const  myData = [...dataSource];
    // const count=[...this.state.count];
    // console.log(count)
    setDataSource(myData.filter(item => item.license_num !== key))
    setPagination({total:()=>this.total-1})
    // this.setState({
    //   dataSource: dataSource.filter(item => item.license_num !== key),
    //   pagination:{total:()=>this.total-1}
    // });
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
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
           this.searchInput = node;
          }}
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
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
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
      width: '10%',
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
        // { text: '泡沫消防车', value: '泡沫消防车' },
        { text: '云梯消防车', value: '云梯消防车' },
        { text: '泵浦消防车', value: '泵浦消防车' },
        { text: '通讯指挥消防车', value: '通讯指挥消防车' },
      ],
      width: '15%',
      editable: true,
      onFilter: (value, record) => record.car_class.indexOf(value) === 0
      ,
    },
    {
      title: '车辆设备',
      dataIndex: 'car_device',
      editable: true,
    },
    {
      title: '使用情况',
      dataIndex: 'scrap_state',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '15%',
      render: (text, record) =>{
        const editable=isEditing(record);
        // console.log(editable)
        // this.state.dataSource.length >= 1
        if(dataSource.length >= 1){
          return  editable ? (
            <span>
               <Popconfirm title="Sure to delete?" onConfirm={() =>{ 
              axios.post('http://localhost:8081/deleteCar',{license_num:record.license_num}).then(function(results){
              console.log(results)
              }).catch(function(err){
                console.log(err)
              })
              console.log(record) ;
              return handleDelete(record.license_num)}
          
            }>
              <a href='#' style={{
                marginRight: 8,
              }}>Delete</a>
            </Popconfirm>
            <a href="#"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a href="#">Cancel</a>
            </Popconfirm>
          </span>
           

          ) : (
            <span>
            <Popconfirm title="Sure to delete?" onConfirm={() =>{ 
              axios.post('http://localhost:8081/deleteCar',{license_num:record.license_num}).then(function(results){
              console.log(results)
              }).catch(function(err){
                console.log(err)
              })
              console.log(record) ;
              return handleDelete(record.license_num)}
          
            }>
              <a href="#"  style={{
                marginRight: 8,
              }}>Delete</a>
            </Popconfirm>
            <a href="#"   disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
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
      
      <Form form={form} component={false}>
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
  
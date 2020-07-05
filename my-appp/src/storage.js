import React ,{useState,useEffect}from 'react';
import 'antd/dist/antd.css';
import {Table,Button,Input, Form } from 'antd';
import reqwest from 'reqwest';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

const Allstorage =()=> {

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
          url: 'http://localhost:8081/getStorage',//请求表格数据
          method: 'get',
          data: {//发送到服务器的数据
            results: 10,
            ...params,
          },
         
          type: 'json',
        }).then(req => {
            console.log(req.data.table)
          // var arr=req.data.table;
          setPages(req.data.table);
          setLoading(false);
          setDataSource(req.data.table);
         
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
        title: '零部件编号',
        dataIndex: 'part_num',
        width: '15%',
        ...getColumnSearchProps('part_num'),
      },
      {
        title: '零部件名',
        dataIndex: 'part_name',
        width: '20%',
        editable: true,
        ...getColumnSearchProps('part_name'),
        
      },
      {
        title: '零部件型号',
        dataIndex: 'model_num',
        width:"12%"
      },
      {
        title: '总数量',
        dataIndex: 'tt',
        width:"20%"
      },
    
  
    ];
  
    
      return (
        <div>
         
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
  
  
export default Allstorage;

//index.js

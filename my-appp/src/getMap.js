import React from "react";
import AMapLoader from '@amap/amap-jsapi-loader';

var text = {
    // 要展示的文字内容
    content: '四川消防',
    // 文字方向，有 icon 时为围绕文字的方向，没有 icon 时，则为相对 position 的位置
    direction: 'right',
    // 在 direction 基础上的偏移量
    offset: [-20, -5],
    // 文字样式
    style: {
        // 字体大小
        fontSize: 12,
        // 字体颜色
        fillColor: '#1890ff',
        // 描边颜色
        // strokeColor: '#fff',
        // 描边宽度
        // strokeWidth: 2,
    }
};
AMapLoader.load({
    "key": "56ecc2c78aa2a334195d11cbaf5e3a56",   // 申请好的Web端开发者Key，首次调用 load 时必填
    "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    "plugins": ['AMap.ToolBar']  //插件列表
}).then((AMap)=>{
  var  map = new AMap.Map('container',{
    zoom:10,
    // pitch:75, // 地图俯仰角度，有效范围 0 度- 83 度
    // viewMode:'3D', // 地图模式
  })
  map.on('container',()=>{  
    const circle=new AMap.circle({
      center: [104.001874,30.70864],//中心点坐标
      radius:45,
    })
    map.add(circle);
  })

//   var labelMarker = new AMap.LabelMarker({
//     name: '标注2', // 此属性非绘制文字内容，仅最为标识使用
//     position: [104.001874,30.70864],
//     // zIndex: 5,
//     // 将第一步创建的 icon 对象传给 icon 属性
//     icon: '//vdata.amap.com/icons/b18/1/2.png',
//     // 将第二步创建的 text 对象传给 text 属性
//     text: text,
// });

  var marker = new AMap.Marker({
    position: new AMap.LngLat(104.001874,30.70864),
    title:"四川消防",
    // offset: new AMap.Pixel(-10, -10),
    icon: '//vdata.amap.com/icons/b18/1/2.png',
})
map.add(marker );
  AMap.plugin(['AMap.ToolBar','AMap.Driving','AMap.Geolocation'],function(){//异步同时加载多个插件
    var toolbar = new AMap.ToolBar();
    map.addControl(toolbar);
    var driving = new AMap.Driving();//驾车路线规划
    driving.search(/*参数*/);
    var geolocated=new AMap.Geolocation();
});
 
}).catch(e => {
    console.log(e);
})

export default class extends React.Component{
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         mapZoom: 18, //地图缩放等级 （zoom）
    //         //https://lbs.amap.com/api/javascript-api/guide/abc/prepare这里有介绍key怎么申请
    //         mapKey: '8bd632e71a481a6b71e153d69a0337d3',//Key就不贴出来了奥
    //         status: {
    //             zoomEnable: true,
    //             dragEnable: true,
    //         },
    //         city:'成都',
    //         mapCenter:[ 104.001874,30.70864],//地图中心点
    //         mapMake :[104.001874,30.70864],//marker标记点
    //         // {lnglat:[116.401728,39.911984],text:'要显示的内容1'},
    //     };
    // }

//     componentDidMount() {
// axios.post("https://tsapi.amap.com/v1/track/service/add",{key:'8bd632e71a481a6b71e153d69a0337d3'}).then(function(res){
//      console.log(res)
//     }).catch(function(err){
//        console.log(err)
//     })
//     }

    render() {
        return(<div id="container" style={{width:800,height:500}}></div>)
        // let {mapCenter, mapMake, mapZoom, mapKey, status,city} = this.state;
        // return <div style={{width:'800px',height:'500px'}}>
        //     {/*地图创建必有参数 （key，中心点，zoom等级）*/}
        //     <Map  plugins={['ToolBar']} amapkey={mapKey} city={city} center={mapCenter} zoom={mapZoom} status={status}>
        //         {/*marker标记点创建必有参数 （position中心点）*/}
        //         <Marker position={mapMake}/>
        //     </Map>
        // </div>
    }
}

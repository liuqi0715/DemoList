$(function(){
    //回收员排名，Json数组 ,响应示例如下
    /*"listTopcRecycler": [
        {
            "id": 54833,
            "contact": "胡复学",
            "cold": 4,
            "sleep": 0,
            "silence": 0,
            "payment": 2,
            "active": 3
        }
    ]*/
    var listTopcRecycler;




    //右边圆圈里的数据
    /*"shopInfo": {
        "todayShop": 0,
        "totalShop": 7038,
        "todayOrder": 0,
        "orderTotalPrice": 0,
        "orderTotalWeight": 0
    }*/
    var shopInfo;




    //客户订单左边中间的数据，Json数组 ,响应示例如下
    /*"listCustOrder": [
        {
            "type": "新订单",
            "shopName": "一一电动车",
            "weight": 8.1,
            "totalPrice": 97.2
        }
    ]*/
    var listCustOrder;


    //左边视频数据，Json数组 ,响应示例如下
    /*"listMedia": [
        {
            "orderHeadId": 91614,
            "orderImage": "/orderImg/PO201711150002.mp4"
        }
    ]*/
    var listMedia; 




    
    //仓库的位置信息，Json数组 ,响应示例如下
    /*"wareHouse": [
        {
            "id": 5201,
            "warehouseName": "胡琳环评仓",
            "longitude": 120.206978,
            "latitude": 30.271316
        }
    ]*/
    var wareHouse;



    //冶炼厂，Json数组 ,响应示例如下
    /*"factories": [
        {
            "id": 3015,
            "companyName": "杭州宇航循环减实业",
            "contact": "雷宇航",
            "longitude": 117.159772,
            "latitude": 36.503921
        }
    ]*/
    var factories;




    //所有的店铺信息（今日有回收，下单的，其他），Json数组 ,响应示例如下
    /*"shop": [
        {
            "id": 3078,
            "longitude": 121.6523666381836,
            "latitude": 29.919376373291016,
            "shopName": "福玉车行",
            "address": "浙江宁波镇海庄市勤勇村西王20号",
            "type": "3"    //这里有三种情况type:1(今日有下单的客户)，type:2(今日有回收的客户),type:3(其他)
        }
    ]*/
    var shop;



    //仓库到冶炼厂坐标点，Json数组 ,响应示例如下
    /*"wTof": [
        {
            "sId": 3015,
            "endX": 117.159772,
            "endY": 36.503921,
            "wId": 5201,
            "startX": 120.206978,
            "startY": 30.271316
        }
    ]*/
    var wTof;




    //门店到仓库的坐标点,Json数组 ,响应示例如下
    /*"shopToWareh": [
        {
            "wId": 5201,
            "endX": 120.206978,
            "endY": 30.271316,
            "sId": 45673,
            "startX": 120.17150228966844,
            "startY": 30.245010028140115
        }
    ]*/
    var shopToWareh;
    



    //省份,Json数组 ,响应示例如下
    /*[
        {
            "provinceId": 21,
            "provinceName": "浙江省"
        }
    ]*/
    var provinces;



    //请求服务器获取数据
    $.ajax({
            type:"get",
            url:"/visualMap/getData",
            dataType:"json",
            success:function(result){
                if(result){
                    listTopcRecycler=result.listTopcRecycler;
                    shopInfo=result.shopInfo;
                    listCustOrder=result.listCustOrder;
                    listMedia=result.listCustOrder;
                    //回收员排名的数据渲染
                    if(listTopcRecycler){
                        assginOption5(listTopcRecycler);
                    }
                    //右边圆圈里的数据渲染
                    if(shopInfo){
                        assginShopInfo(shopInfo);
                    }
                    //客户订单左边中间的数据渲染
                    if(listCustOrder){
                        assginlistCustOrder(listCustOrder);
                    }
                    //左边视频数据渲染
                    if(listMedia){
                        assginlistMedia(listMedia);
                    }
                }
            },
            error:function(error){

            }
        }
    );
	




    /**
     * 获取省
     */
    $.ajax({
        type:"get",
        url:"/visualMap/getProvince",
        dataType:"json",
        success:function(result){
            provinces=result;
            if(provinces){
                //getMapInfo(province[0].provinceId);
            }
        },
        error:function(error){
        }
    });
  //后端推送
  initWebSocket();
  
  
  var mapInfoDatas=null;
  var wScaleRate=$(window).width()/1920;
  var hScaleRate=$(window).height()/950;
  var vMapHeight=$('.vMap_wrap').height();
  function adapt(){
    var camera=document.getElementById("cam");
    camera.width=$(".vMap_con2_cam1_l").width();
    camera.height=$(".vMap_con2_cam1_l").height();
    $(".vMap_wrap").css("padding",10*wScaleRate+'px '+30*wScaleRate+'px '+20*wScaleRate+'px '+30*wScaleRate+'px');
    $(".vMap_logo_box").css({"width":260*wScaleRate+'px',"height":30*wScaleRate+'px',"left":420*wScaleRate+'px'});
    $(".vMap_con1").css({"height":70*hScaleRate+'px'});
    $(".vMap_con1_time h2").css({"font-size":28*hScaleRate+'px'});
    $(".vMap_con1_time h3").css({"font-size":22*hScaleRate+'px'});
    $(".vMap_con1_slc").css({"padding-top":20*hScaleRate+'px'});
    $(".vMap_con1_slc li").css({"width":150*wScaleRate+'px',"margin-right":30*wScaleRate+'px'});
    $(".vMap_con2").css({"height":560*hScaleRate+'px'});
    $(".vMap_con2_l").css({"margin-right":6*wScaleRate+'px'});
    $(".vMap_con2_order ul").css({"height":220*hScaleRate+'px'});
    $(".vMap_con2_data h3").css({"font-size":14*hScaleRate+'px'});
    $(".vMap_con2_data_outCir").css({"width":74*hScaleRate+'px',"height":74*hScaleRate+'px',"margin-bottom":5*hScaleRate+'px'});
    $(".vMap_con2_data_inCir").css({"width":64*hScaleRate+'px',"height":64*hScaleRate+'px',"line-height":64*hScaleRate+'px',"font-size":14*wScaleRate+'px'});
    $(".vMap_con3").css({"height":250*hScaleRate+'px'});
    $(".vMap_con3_l").css({"margin-right":9*wScaleRate+'px'});
    $(".vMap_con3_r").css({"margin-left":7*wScaleRate+'px'});
  }
  adapt();
  $(window).resize(function(){
    if($(window).width()>1400){
      $('.vMap_wrap').width($(window).width()*0.96);
      adapt();
    }else{
      $('.vMap_wrap').width(1200*0.96);
    }
  });
  var today=new Date();
  var week=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
  var currentDate=today.getFullYear()+'-'+((today.getMonth()+1)>9?(today.getMonth()+1):"0"+(today.getMonth()+1))+'-'+(today.getDate()>9?today.getDate():"0"+today.getDate())+" "+week[today.getDay()];
  $(".vMap_con1_time").find("h3").html(currentDate);
  function currentClock(){
    setInterval(function(){
      var time=(new Date().getHours()>9?new Date().getHours():"0"+new Date().getHours())+" : "+(new Date().getMinutes()>9?new Date().getMinutes():"0"+new Date().getMinutes())+" : "+(new Date().getSeconds()>9?new Date().getSeconds():"0"+new Date().getSeconds());
      $(".vMap_con1_time").find("h2").html(time);
    },1000);
  }
  currentClock();
  var currentDayTag=today.getDate()>9?today.getDate():"0"+today.getDate();
  var timeline=today.getFullYear()+'-'+((today.getMonth()+1)>9?(today.getMonth()+1):"0"+(today.getMonth()+1))+'-'+(today.getDate()>9?today.getDate():"0"+today.getDate());
  var timeline2=null,areaId=null,timeType="now";
  var getData=function(){
     var data={};
     data.getTime=timeline;
     data.areaId=areaId;
     data.type=timeType;
     data.end=timeline2;
     $.ajax({
        type:"POST",
        url:'../performance/getPerformance', //获取表格最右边5个圈圈里的数据
        headers: {Accept: "application/json;charset=utf-8"},
        data:data,
        dataType:'json',
        success:function(data) {
        


        var obj=eval("("+data.allMap+")");
        totalStatistics=obj.custStatisticsMap;//汇总
        custTrendStatistics=obj.custTrendStatistics;//增长趋势
        custOrderStatistics=obj.custOrderStatistics;//每日订单重量
        salesmanRankingStatistics=obj.salesmanRankingStatistics;//地推排名
        placeOrderCustNumber=obj.placeOrderCustNumber;//下单用户占比
          $("#newShop").find("span").html(totalStatistics.newCustNumber);
          $("#sumShop").find("span").html(totalStatistics.cumulativeCustNumber);
          $("#newOrder").find("span").html(totalStatistics.newCustOrderNumber);
          $("#sumOrder").find("span").html(totalStatistics.newCustOrderPrice);
          $("#newTon").find("span").html(totalStatistics.newCustOrderWeight);
        },
        error:function(n){
          console.log(n);
        }
      });
  };
// getData();
 var option1 = {
      backgroundColor: '#090915',
      title: {
          text: '新增订单',
          textStyle:{
            color:["#FFF"],
            fontSize:18*wScaleRate
          }
      },
      tooltip : {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
          }
      },
      legend: {
          data:['老用户订单数','新用户订单数'],
          top:5,
          right:5,
          textStyle:{
            color:["#FFF"],
            fontSize:14*wScaleRate
          }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis : {
          type : 'category',
          boundaryGap : false,
          nameTextStyle: {
              color: '#fff',
              fontSize: 14*wScaleRate
          },
          splitLine: {
              show: false
          },
          axisLine: {
              lineStyle: {
                  color: '#eee'
              }
          },
          data : [currentDayTag-6+"日", currentDayTag-5+"日", currentDayTag-4+"日", currentDayTag-3+"日", currentDayTag-2+"日", currentDayTag-1+"日", currentDayTag+"日"]
      },
      yAxis : {
          type : 'value',
          nameTextStyle: {
              color: '#fff',
              fontSize: 14*wScaleRate
          },
          splitLine: {
              show: false
          },
          axisLine: {
              lineStyle: {
                  color: '#eee'
              }
          }
      },
      series : [
          {
              name:'老用户订单数',
              type:'line',
              stack: '总量',
              areaStyle: {normal: {}},
              color: ["#406498"],
              data:[820, 892, 931, 734, 860, 830, 790]
          },
          {
              name:'新用户订单数',
              type:'line',
              stack: '总量',
              areaStyle: {normal: {}},
              color: ["#9B4E54"],
              data:[160, 142, 111, 84, 120, 130, 91]
          }      
        ]
    };
    var option2 = {
      title: {
          text: '回收电池数量&加权平均收购价格',
          textStyle:{
            color:["#FFF"],
            fontSize:18*wScaleRate
          }
      },
      tooltip : {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
          }
      },
      legend: {
          top:5,
          right:5,
          align:'left',
          itemWidth:40,
          itemHeight:10,
          itemGap:5,
          textStyle:{
            color:["#FFF"],
            fontSize:14*wScaleRate
          },
          data: [
            {name:'回收量',icon: 'bar',textStyle: {fontSize: 10}},
            // {name:'库存量',icon: 'bar',textStyle: {fontSize: 10}},
            {name:'回收均价',textStyle: {fontSize: 10}},
          ]
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis : [
          {
              type : 'category',
              boundaryGap : false,
              nameTextStyle: {
                  color: '#fff',
                  fontSize: 14*wScaleRate
              },
              splitLine: {
                  show: false
              },
              axisLine: {
                  lineStyle: {
                      color: '#eee'
                  }
              },
              data : [currentDayTag-6+"日", currentDayTag-5+"日", currentDayTag-4+"日", currentDayTag-3+"日", currentDayTag-2+"日", currentDayTag-1+"日", currentDayTag+"日"]
          }
      ],
      yAxis : [
          {
            name: '回收量',
              type : 'value',
              scale: true,
              nameTextStyle: {
                  color: '#fff',
                  fontSize: 14*wScaleRate
              },
              splitLine: {
                  show: false
              },
              axisLine: {
                  lineStyle: {
                      color: '#eee'
                  }
              },
              min:100000,
              max:246733.88,
              axisLabel: {
                  formatter: '{value}'
              }
          },
          {
              name: '回收均价',
              type: 'value',
              scale: true,
              nameTextStyle: {
                  color: '#fff',
                  fontSize: 14*wScaleRate
              },
              splitLine: {
                  show: false
              },
              axisLine: {
                  lineStyle: {
                      color: '#eee'
                  }
              },
              min:8,
              max:9.39,
              axisLabel: {
                  formatter: '{value}'
              }
          }
      ],
      series : [
          {
              name:'回收量',
              type:'line',
              stack: '总量',
              color:["#3872BB"],
              areaStyle: {normal: {}},
              data:[153362.00, 116618.56, 127017.18,169146.25,224529.59, 166390.55, 246733.88]
          },
          // {
          //     name:'库存量',
          //     type:'line',
          //     stack: '总量',
          //     color:["#36B1D2"],
          //     areaStyle: {normal: {}},
          //     data:[220, 182, 191, 234, 290, 330, 310]
          // },
          {
              name:'回收均价',
              type:'line',
              stack: '总量',
              color:["#96B651"],
              data:[9.39, 9.17, 8.95, 8.66, 9.38, 9.34, 9.37]
          }     
        ]
    };
    var option3 = {
      title: {
          text: '下单率',
          left: 'center',
          top: 'middle',
          textStyle:{
            color:["#FFF"],
            fontSize:12*wScaleRate
          }
      },
      tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [
          {
              name:'下单率',
              type:'pie',
              radius: ['50%', '70%'],
              color:['#55C1E5',"#F39533"],
              avoidLabelOverlap: false,
              label: {
                  normal: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      show: true,
                      textStyle: {
                          fontSize: 30*wScaleRate,
                          fontWeight: 'bold'
                      }
                  }
              },
              labelLine: {
                  normal: {
                      show: false
                  }
              },
              data:[
               {   value:1851,
                   name:'下单用户'
               },
               {   value:30165, 
                   name:'未下单用户'
               },
              ]
          }
        ]
    };
    var option4 = {
      title: {
          text: '收单率',
          left: 'center',
          top: 'middle',
          textStyle:{
            color:["#FFF"],
            fontSize:12*wScaleRate
          }
      },
      tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [
          {
              name:'收单率',
              type:'pie',
              radius: ['50%', '70%'],
              color:['#55C1E5',"#F39533"],
              avoidLabelOverlap: false,
              label: {
                  normal: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      show: true,
                      textStyle: {
                          fontSize: 30*wScaleRate,
                          fontWeight: 'bold'
                      }
                  }
              },
              labelLine: {
                  normal: {
                      show: false
                  }
              },
              data:[
               {   value:682,
                   name:'已回收'
               },
               {   value:168, 
                   name:'未回收'
               },
              ]
          }
        ]
    };
   


  var chart1 = echarts.init(document.getElementById('chart1'));
  var chart2 = echarts.init(document.getElementById('chart2'));
  var chart3 = echarts.init(document.getElementById('chart3'));
  var chart4 = echarts.init(document.getElementById('chart4'));

  chart1.setOption(option1);
  chart2.setOption(option2);
  chart3.setOption(option3);
  chart4.setOption(option4);

  // var map = new BMap.Map('vMap');
  // map.centerAndZoom(new BMap.Point(116.404269,39.916042), 6);
  // map.enableScrollWheelZoom();
  // map.disable3DBuilding();
  // map.setMinZoom(4);
  // map.setMaxZoom(10);
  // var  mapStyle ={ 
  //         features: "land",//隐藏地图上的poi
  //         style : "midnight"  //设置地图风格为高端黑
  //     }
  // map.setMapStyle(mapStyle);
  //         var randomCount = 300;

  //       var data = [];

  //       var citys = [ "石家庄", "济南", "南京", "合肥", "杭州"];

  //       // 构造数据
  //       while (randomCount--) {
  //           var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
  //           data.push({
  //               geometry: {
  //                   type: 'Point',
  //                   coordinates: [cityCenter.lng - 2 + Math.random() * 4, cityCenter.lat - 2 + Math.random() * 4]
  //               },
  //               count: 30 * Math.random()
  //           });
  //       }

  //       var dataSet = new mapv.DataSet(data);

  //       var options = {
  //           fillStyle: 'rgba(55, 50, 250, 0.8)',
  //           shadowColor: 'rgba(255, 250, 50, 1)',
  //           shadowBlur: 20,
  //           max: 100,
  //           size: 50,
  //           label: {
  //               show: true,
  //               fillStyle: 'white',
  //               // shadowColor: 'yellow',
  //               // font: '20px Arial',
  //               // shadowBlur: 10,
  //           },
  //           globalAlpha: 0.5,
  //           gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
  //           draw: 'honeycomb'
  //       }

  //       var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);

var myChart = echarts.init(document.getElementById('vMap'));  
  
var geoCoordMap = {    
    '山东': [117.024967,36.682785],
    '安徽': [117.563205,31.765229],
    '江苏': [118.595978,32.976494]
};  
var initMapDate = [  
   {'name':'山东','map_x':'116.932939','map_y':'35.8336','value':'10325位用户'},
   {'name':'安徽','map_x':'117.611472','map_y':'32.792215','value':'9847位用户'},
   {'name':'江苏','map_x':'118.595978','map_y':'32.976494','value':'6488位用户'} 
]; 
// var SHData = [  
//     [{name:'上海'},{name:'包头',value:95}],  
//     [{name:'上海'},{name:'昆明',value:90}],  
//     [{name:'上海'},{name:'广州',value:80}],  
//     [{name:'上海'},{name:'郑州',value:70}],  
//     [{name:'上海'},{name:'长春',value:60}],  
//     [{name:'上海'},{name:'重庆',value:50}],  
//     [{name:'上海'},{name:'长沙',value:40}],  
//     [{name:'上海'},{name:'北京',value:30}],  
//     [{name:'上海'},{name:'丹东',value:20}],  
//     [{name:'上海'},{name:'大连',value:10}]  
// ];  
  
// var GZData = [  
//     [{name:'广州'},{name:'福州',value:95}],  
//     [{name:'广州'},{name:'太原',value:90}],  
//     [{name:'广州'},{name:'长春',value:80}],  
//     [{name:'广州'},{name:'重庆',value:70}],  
//     [{name:'广州'},{name:'西安',value:60}],  
//     [{name:'广州'},{name:'成都',value:50}],  
//     [{name:'广州'},{name:'常州',value:40}],  
//     [{name:'广州'},{name:'北京',value:30}],  
//     [{name:'广州'},{name:'北海',value:20}],  
//     [{name:'广州'},{name:'海口',value:10}]  
// ]; 
var color = ['#a6c84c', '#ffa022', '#46bee9'];  
var convertData = function (data) {  
    var res = [];  
    for (var i = 0; i < data.length; i++) {  
        var dataItem = data[i];  
        var fromCoord = [dataItem[1].map_x,dataItem[1].map_y];
        var toCoord = geoCoordMap[dataItem[0].name]; 
        if (fromCoord && toCoord) {  
            res.push({  
                fromName: dataItem[1].shop_name,  
                toName: dataItem[0].name,  
                coords: [fromCoord, toCoord],
                name: dataItem[1].shop_name+"至"+dataItem[0].name+"仓库",  
                value: [dataItem.cust_address] 
            });  
        }  
    }  
    return res;  
};
var convertData1 = function (toCo,data) {  
    var res = [];  
    for (var i = 0; i < data.length; i++) {  
        var dataItem = data[i];  
        var fromCoord = [dataItem.map_x,dataItem.map_y];
        var toCoord = toCo.map; 
        if (fromCoord && toCoord) {  
            res.push({  
                fromName: dataItem.shop_name,  
                toName: toCo.name,  
                coords: [fromCoord, toCoord],
                name: dataItem.shop_name+"至"+toCo.name+"仓库",  
                value: [dataItem.cust_address] 
            });  
        }  
    }  
    return res;  
}; 
if (!Array.prototype.forEach) {  
    Array.prototype.forEach = function(callback, thisArg) {  
        var T, k;  
        if (this == null) {  
            throw new TypeError(" this is null or not defined");  
        }  
        var O = Object(this);  
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32  
        if ({}.toString.call(callback) != "[object Function]") {  
            throw new TypeError(callback + " is not a function");  
        }  
        if (thisArg) {  
            T = thisArg;  
        }  
        k = 0;  
        while (k < len) {  
            var kValue;  
            if (k in O) {  
                kValue = O[k];  
                callback.call(T, kValue, k, O);  
            }  
            k++;  
        }  
    };  
} 
var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';  
var JNData = [],HFData=[],JSData=[]; 
var toObj={};
var bmapStyle={
                    styleJson: [
                    {
                              'featureType': 'land',     //调整土地颜色
                              'elementType': 'geometry',
                              'stylers': {
                                        'color': '#081734'
                              }
                    },
                    {
                              'featureType': 'building',   //调整建筑物颜色
                              'elementType': 'geometry',
                              'stylers': {
                                        'color': '#04406F',
                                        'visibility': 'off'
                              }
                    },
                   {
                              'featureType': 'building',   //调整建筑物标签是否可视
                              'elementType': 'labels',
                              'stylers': {
                              'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'highway',     //调整高速道路颜色
                              'elementType': 'geometry',
                              'stylers': {
                              'color': '#015B99'
                              }
                    },
                    {
                              'featureType': 'highway',    //调整高速名字是否可视
                              'elementType': 'labels',
                              'stylers': {
                              // 'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'arterial',   //调整一些干道颜色
                              'elementType': 'geometry',
                              'stylers': {
                              'color':'#003051'
                              }
                    },
                    {
                              'featureType': 'arterial',
                              'elementType': 'labels',
                              'stylers': {
                              'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'green',
                              'elementType': 'geometry',
                              'stylers': {
                              'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'water',
                              'elementType': 'geometry',
                              'stylers': {
                                        'color': '#044161'
                              }
                    },
                    {
                              'featureType': 'subway',    //调整地铁颜色
                              'elementType': 'geometry.stroke',
                              'stylers': {
                              'color': '#003051',
                              'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'subway',
                              'elementType': 'labels',
                              'stylers': {
                              'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'railway',
                              'elementType': 'geometry',
                              'stylers': {
                              'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'railway',
                              'elementType': 'labels',
                              'stylers': {
                              'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'all',     //调整所有的标签的边缘颜色
                              'elementType': 'labels.text.stroke',
                              'stylers': {
                                        'color': '#313131',
                              }
                    },
                    {
                              'featureType': 'all',     //调整所有标签的填充颜色
                              'elementType': 'labels.text.fill',
                              'stylers': {
                                        'color': '#FFFFFF',
                              }
                    },
                    {
                              'featureType': 'manmade',   
                              'elementType': 'geometry',
                              'stylers': {
                              'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'manmade',
                              'elementType': 'labels',
                              'stylers': {
                              'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'local',
                              'elementType': 'geometry',
                              'stylers': {
                              'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'local',
                              'elementType': 'labels',
                              'stylers': {
                              'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'subway',
                              'elementType': 'geometry',
                              'stylers': {
                                        'lightness': -65,
                                        'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'railway',
                              'elementType': 'all',
                              'stylers': {
                                        'lightness': -40,
                                        'visibility': 'off'
                              }
                    },
                    {
                              'featureType': 'boundary',
                              'elementType': 'geometry',
                              'stylers': {
                                        'color': '#8b8787',
                                        'weight': '1',
                                        'lightness': -29
                              }
                    }]
                  };
toObj.name='济南';
var toObj1={},toObj2={};
toObj1.name='合肥';
toObj2.name='江苏';
var vmapZoom=14;
var initMapStart=false;
var afterMapStart=false;
var initMapClick=null;
var series = [];  
var mapData=null,mapData1=null;
var mapDatas=null;
var bmapCenter=[117.188107,34.271553];
var selectedAddress=null,addrGeo = new BMap.Geocoder();
var jsData=null,sdData=null,ahData=null;
//加载静态数据
$.ajax({
    type: "get",
    url: "js/vmapDatah.json",
    dataType : "json",
    success: function(data){
       hfData=data;
    },
    error:function(XMLHttpRequest, textStatus, errorThrown){
       console.log(XMLHttpRequest);
       console.log(textStatus);
       console.log(errorThrown);
    }
 });

var drawJiangsu=function(){
    initMapStart=false;
    afterMapStart=true;
    series=[];
    var jsGroup1=[],jsGroup2=[];
    var gap=1,gap1=1;
    $.ajax({
      type: "get",
      async:false,
      url: "js/jsData.json", // 获取江苏数据
      success: function(data){
         jsData=data;
      },
      error:function(XMLHttpRequest, textStatus, errorThrown){
      console.log(XMLHttpRequest);
      console.log(textStatus);
      console.log(errorThrown);
      }
    }); 
    while(gap<1000){
      var dataArray1=[];
      gap=gap+60;
      dataArray1.push(toObj2);
      dataArray1.push(jsData[gap]);
      JSData.push(dataArray1);
    }
    var randomCust=[];
    for(var z=0;z<100;z++){
        var orderStart=Math.random()*2000;
        var step=Math.random()*100;
        var nums=parseInt(orderStart+step);
        randomCust.push(jsData[nums]);
    }
    var mapgroup1=[],mapgroup2=[],mapgroup3=[];
    for(var j=0;j<300;j++){
        mapgroup1.push(jsData[j]);
    };
    for(var k=300;k<800;k++){
        mapgroup2.push(jsData[k]);
    }; 
    for(var l=800;l<jsData.length;l++){
        mapgroup3.push(jsData[l]);
    }; 
    [['江苏', JSData]].forEach(function (item, i){  
        series.push(
               {  
                    name: '下单用户',  
                    type: 'effectScatter',   
                    coordinateSystem: 'bmap',  
                    zlevel: 10,  
                    rippleEffect: {  
                        brushType: 'fill',
                        scale:5 
                    },  
                    label: {  
                        normal: {  
                            show: false,  
                            position: 'right',  
                            formatter: '{b}'  
                        }  
                    },  
                    symbolSize: 7, 
                    effect : {
                        show: true,
                        shadowBlur : 0
                    }, 
                    itemStyle: {
                        normal: {
                            color: '#FA8695',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    }, 
                    data: randomCust.map(function (dataItem) {  
                        return {  
                            name: dataItem.shop_name,  
                            value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                        };  
                    })         
              }
//              {  
//                  name: item[0],  
//                  type: 'lines',  
//                  coordinateSystem: 'bmap',  
//                  zlevel: 1,  
//                  effect: {  
//                      show: true,  
//                      period: 16,  
//                      trailLength: 0.3,  
//                      color: '#fff',  
//                      symbolSize: 5  
//                  },  
//                  lineStyle: {  
//                      normal: {  
//                          color: color[i],  
//                          width: 0,  
//                          curveness: 0.2  
//                      }  
//                  },  
//                  data: convertData(item[1])  
//              },  
//              {  
//                  name: item[0] ,  
//                  type: 'lines',  
//                  coordinateSystem: 'bmap',  
//                  zlevel: 2,  
//                  effect: {  
//                      show: true,  
//                      period: 6,  
//                      trailLength: 0,  
//                      symbol: planePath,  
//                      symbolSize: 0  
//                  },  
//                  lineStyle: {  
//                      normal: {  
//                          color: color[i],  
//                          width: 2,  
//                          opacity: 0.4,  
//                          curveness: 0.2  
//                      }  
//                  },  
//                  data: convertData(item[1])  
//               }
             ); 
         });
      series.push(
        {  
              name: '盱眙仓库',  
              type: 'effectScatter',  
              coordinateSystem: 'bmap',  
              zlevel: 11,  
              rippleEffect: {  
                  brushType: 'fill',
                  scale:5 
              },  
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 25, 
              effect : {
                  show: true,
                  shadowBlur : 0
              }, 
              itemStyle: {
                  normal: {
                      color: '#32EBED',
                      shadowBlur: 10,
                      shadowColor: '#333'
                  }
              }, 
              data:[{  
                  label: {
                      text: '盱眙仓库',
                      normal:{
                        show:true,
                        textStyle:{
                          color:'#FFF',
                          fontSize:16
                        },
                        position: 'inside'
                      },
                  },
                  name: '盱眙仓库',  
                  value: [118.595978,32.976494]
              }]
          },
          {  
              name: '新沂仓库',  
              type: 'effectScatter',  
              coordinateSystem: 'bmap',  
              zlevel: 11,  
              rippleEffect: {  
                  brushType: 'fill',
                  scale:5 
              },  
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 25, 
              effect : {
                  show: true,
                  shadowBlur : 0
              }, 
              itemStyle: {
                  normal: {
                      color: '#9DD3F2',
                      shadowBlur: 10,
                      shadowColor: '#333'
                  }
              }, 
              data:[{  
                  label: {
                      text: '新沂仓库',
                      normal:{
                        show:true,
                        textStyle:{
                          color:'#FFF',
                          fontSize:16
                        },
                        position: 'inside'
                      },
                  },
                  name: '新沂仓库',  
                  value: [118.241233,34.377846]
              }]
         },
         {  
              name: '新春兴冶炼厂',  
              type: 'effectScatter',  
              coordinateSystem: 'bmap',  
              zlevel: 3,  
              rippleEffect: {  
                  brushType: 'fill',
                  scale:5 
              },  
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 25, 
              effect : {
                  show: true,
                  shadowBlur : 0
              }, 
              itemStyle: {
                  normal: {
                      color: '#CB8EFA',
                      shadowBlur: 10,
                      shadowColor: '#333'
                  }
              }, 
              data:[{  
                  label: {
                      text: '新春兴冶炼厂',
                      normal:{
                        show:true,
                        textStyle:{
                          color:'#FFF',
                          fontSize:16
                        },
                        position: 'inside'
                      },
                  },
                  name: '新春兴冶炼厂',  
                  value: [117.90306,34.402946]
              }]
          },
          {  
              name: "仓库至冶炼厂",  
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 4,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0.3,  
                  color: '#FC626C',  
                  symbolSize: 8  
              },  
              lineStyle: {  
                  normal: {   
                      width: 0,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "江苏仓库",  
                    toName: "新春兴冶炼厂",  
                    coords: [[118.595978,32.976494], [117.90306,34.402946]],
                    name: "江苏仓库"+"至"+"新春兴冶炼厂",  
                    value: null
                }
              ] 
          },  
          {  
              name: "仓库至冶炼厂",    
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 5,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0,  
                  symbol: planePath,  
                  symbolSize: 0  
              },  
              lineStyle: {  
                  normal: {  
                      color: "#FFF5C9",  
                      width: 8,  
                      opacity: 0.4,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "江苏仓库",  
                    toName: "新春兴冶炼厂",  
                    coords: [[118.595978,32.976494], [117.90306,34.402946]],
                    name: "江苏仓库"+"至"+"新春兴冶炼厂",  
                    value: null
                }
              ]  
          },
          {  
              name: "仓库至冶炼厂",  
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 6,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0.3,  
                  color: '#FC626C',  
                  symbolSize: 8  
              },  
              lineStyle: {  
                  normal: {   
                      width: 0,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "江苏仓库",  
                    toName: "新春兴冶炼厂",  
                    coords: [[118.241233,34.377846], [117.90306,34.402946]],
                    name: "江苏仓库"+"至"+"新春兴冶炼厂",  
                    value: null
                }
              ] 
          },  
          {  
              name: "仓库至冶炼厂",    
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 7,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0,  
                  symbol: planePath,  
                  symbolSize: 0  
              },  
              lineStyle: {  
                  normal: {  
                      color: "#FFF5C9",  
                      width: 8,  
                      opacity: 0.4,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "江苏仓库",  
                    toName: "新春兴冶炼厂",  
                    coords: [[118.241233,34.377846], [117.90306,34.402946]],
                    name: "江苏仓库"+"至"+"新春兴冶炼厂",  
                    value: null
                }
              ]  
          },
          {  
                name: '江苏用户',  
//                type: 'effectScatter',  
                type: 'scatter', 
                coordinateSystem: 'bmap',  
                zlevel: 2,  
//                rippleEffect: {  
//                    brushType: 'fill',
//                    scale:5 
//                },  
                label: {  
                    normal: {  
                        show: false,  
                        position: 'right',  
                        formatter: '{b}'  
                    }  
                },  
                symbolSize: 10, 
//                effect : {
//                    show: true,
//                    shadowBlur : 0
//                }, 
//                itemStyle: {
//                    normal: {
//                        color: '#96B651',
//                        shadowBlur: 10,
//                        shadowColor: '#333'
//                    }
//                }, 
                large: true,
                itemStyle: {
                    normal: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(37, 140, 249, 0.8)',
                        color: 'rgba(37, 140, 249, 0.8)'
                    }
                },
                data: mapgroup1.map(function (dataItem) {  
                    return {  
                        name: dataItem.shop_name,  
                        value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                    };  
                })         
          },
          {  
              name: '江苏用户',  
              type: 'scatter', 
              coordinateSystem: 'bmap',  
              zlevel: 2,    
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 10, 
              large: true,
              itemStyle: {
                  normal: {
                      shadowBlur: 20,
                      shadowColor: 'rgba(255, 255, 255, 0.8)',
                      color: 'rgba(255, 255, 255, 0.8)'
                  }
              },
              data: mapgroup2.map(function (dataItem) {  
                  return {  
                      name: dataItem.shop_name,  
                      value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                  };  
              })         
        },
        {  
            name: '江苏用户',   
            type: 'scatter', 
            coordinateSystem: 'bmap',  
            zlevel: 2,  
            label: {  
                normal: {  
                    show: false,  
                    position: 'right',  
                    formatter: '{b}'  
                }  
            },  
            symbolSize: 10, 
            large: true,
            itemStyle: {
                normal: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(14, 241, 242, 0.8)',
                    color: 'rgba(14, 241, 242, 0.8)'
                }
            },
            data: mapgroup3.map(function (dataItem) {  
                return {  
                    name: dataItem.shop_name,  
                    value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                };  
            })         
      }
      );
      var option = {  
          backgroundColor: '#404a59',  
          title : {  
              // text: '模拟迁徙',  
              // subtext: '数据纯属虚构',  
              left: 'center',  
              textStyle : {  
                  color: '#fff'  
              }  
          },  
          tooltip : {  
              position: function (pos, params, dom, rect, size) {
                  // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
                  // var obj = {top: 200};
                  var obj;
                  obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = 5;
                  obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                  return obj;
              },
              trigger: 'item' 
          },   
          bmap: {  
              center: bmapCenter,  
              zoom: vmapZoom,  
              roam: true,
              mapStyle: bmapStyle
          },  
          series: series  
      }; 
      myChart.clear();   
      myChart.setOption(option,true);
      var bmap=myChart.getModel().getComponent("bmap").getBMap();
      // myChart.on('click', function (params) {
      //     console.log(params);
      // });
      var steps=1;
      while(steps<5500){
        try //非IE
        {
            steps=steps+10;
            var temp=jsData[steps];
          var tempX=temp.map_x; 
            var tempY=temp.map_y; 
              var point1=new BMap.Point(118.595978,32.976494);
              var point2=new BMap.Point(118.241233,34.377846);
              var pointB = new BMap.Point(tempX,tempY);
              var len1 = bmap.getDistance(point1,pointB).toFixed(2);
              var len2 = bmap.getDistance(point2,pointB).toFixed(2);
              if(len1<60000){
                jsGroup1.push(jsData[steps]); 
              }
              if(len2<60000){
                jsGroup2.push(jsData[steps]); 
              }
         
        }
        catch(e)//IE
        {
          console.log(steps);
        }
      }
      setTimeout(function(){  
        series=[];
          var toCo1={},toCo2={};
          toCo1.name="须臾仓库";
          toCo1.map=[118.595978,32.976494];
          toCo2.name="新沂仓库";
          toCo2.map=[118.241233,34.377846];
              [['江苏', JSData]].forEach(function (item, i){  
                  series.push(
                         {  
                              name: '下单用户',  
                              type: 'effectScatter',   
                              coordinateSystem: 'bmap',  
                              zlevel: 10,  
                              rippleEffect: {  
                                  brushType: 'fill',
                                  scale:5 
                              },  
                              label: {  
                                  normal: {  
                                      show: false,  
                                      position: 'right',  
                                      formatter: '{b}'  
                                  }  
                              },  
                              symbolSize: 7, 
                              effect : {
                                  show: true,
                                  shadowBlur : 0
                              }, 
                              itemStyle: {
                                  normal: {
                                      color: '#FA8695',
                                      shadowBlur: 10,
                                      shadowColor: '#333'
                                  }
                              }, 
                              data: randomCust.map(function (dataItem) {  
                                  return {  
                                      name: dataItem.shop_name,  
                                      value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                                  };  
                              })         
                        },
                        {  
                            name: item[0],  
                            type: 'lines',  
                            coordinateSystem: 'bmap',  
                            zlevel: 12,  
                            effect: {  
                                show: true,  
                                period: 16,  
                                trailLength: 0.3,  
                                color: '#fff',  
                                symbolSize: 5  
                            },  
                            lineStyle: {  
                                normal: {  
                                    color: color[i],  
                                    width: 0,  
                                    curveness: 0.2  
                                }  
                            },  
                            data: convertData1(toCo1,jsGroup1)  
                        },  
                        {  
                            name: item[0] ,  
                            type: 'lines',  
                            coordinateSystem: 'bmap',  
                            zlevel: 13,  
                            effect: {  
                                show: true,  
                                period: 6,  
                                trailLength: 0,  
                                symbol: planePath,  
                                symbolSize: 0  
                            },  
                            lineStyle: {  
                                normal: {  
                                    color: color[i],  
                                    width: 2,  
                                    opacity: 0.4,  
                                    curveness: 0.2  
                                }  
                            },  
                            data: convertData1(toCo1,jsGroup1)  
                         },
                         {  
                            name: item[0],  
                            type: 'lines',  
                            coordinateSystem: 'bmap',  
                            zlevel: 14,  
                            effect: {  
                                show: true,  
                                period: 16,  
                                trailLength: 0.3,  
                                color: '#fff',  
                                symbolSize: 5  
                            },  
                            lineStyle: {  
                                normal: {  
                                    color: color[i],  
                                    width: 0,  
                                    curveness: 0.2  
                                }  
                            },  
                            data: convertData1(toCo2,jsGroup2)  
                        },  
                        {  
                            name: item[0] ,  
                            type: 'lines',  
                            coordinateSystem: 'bmap',  
                            zlevel: 15,  
                            effect: {  
                                show: true,  
                                period: 6,  
                                trailLength: 0,  
                                symbol: planePath,  
                                symbolSize: 0  
                            },  
                            lineStyle: {  
                                normal: {  
                                    color: color[i],  
                                    width: 2,  
                                    opacity: 0.4,  
                                    curveness: 0.2  
                                }  
                            },  
                            data: convertData1(toCo2,jsGroup2)  
                         }
                       ); 
                   });
                series.push(
                  {  
                        name: '盱眙仓库',  
                        type: 'effectScatter',  
                        coordinateSystem: 'bmap',  
                        zlevel: 31,  
                        rippleEffect: {  
                            brushType: 'fill',
                            scale:5 
                        },  
                        label: {  
                            normal: {  
                                show: false,  
                                position: 'right',  
                                formatter: '{b}'  
                            }  
                        },  
                        symbolSize: 25, 
                        effect : {
                            show: true,
                            shadowBlur : 0
                        }, 
                        itemStyle: {
                            normal: {
                                color: '#32EBED',
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        }, 
                        data:[{  
                            label: {
                                text: '盱眙仓库',
                                normal:{
                                  show:true,
                                  textStyle:{
                                    color:'#FFF',
                                    fontSize:16
                                  },
                                  position: 'inside'
                                },
                            },
                            name: '盱眙仓库',  
                            value: [118.595978,32.976494]
                        }]
                    },
                    {  
                        name: '新沂仓库',  
                        type: 'effectScatter',  
                        coordinateSystem: 'bmap',  
                        zlevel: 31,  
                        rippleEffect: {  
                            brushType: 'fill',
                            scale:5 
                        },  
                        label: {  
                            normal: {  
                                show: false,  
                                position: 'right',  
                                formatter: '{b}'  
                            }  
                        },  
                        symbolSize: 25, 
                        effect : {
                            show: true,
                            shadowBlur : 0
                        }, 
                        itemStyle: {
                            normal: {
                                color: '#9DD3F2',
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        }, 
                        data:[{  
                            label: {
                                text: '新沂仓库',
                                normal:{
                                  show:true,
                                  textStyle:{
                                    color:'#FFF',
                                    fontSize:16
                                  },
                                  position: 'inside'
                                },
                            },
                            name: '新沂仓库',  
                            value: [118.241233,34.377846]
                        }]
                   },
                   {  
                        name: '新春兴冶炼厂',  
                        type: 'effectScatter',  
                        coordinateSystem: 'bmap',  
                        zlevel: 31,  
                        rippleEffect: {  
                            brushType: 'fill',
                            scale:5 
                        },  
                        label: {  
                            normal: {  
                                show: false,  
                                position: 'right',  
                                formatter: '{b}'  
                            }  
                        },  
                        symbolSize: 25, 
                        effect : {
                            show: true,
                            shadowBlur : 0
                        }, 
                        itemStyle: {
                            normal: {
                                color: '#CB8EFA',
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        }, 
                        data:[{  
                            label: {
                                text: '新春兴冶炼厂',
                                normal:{
                                  show:true,
                                  textStyle:{
                                    color:'#FFF',
                                    fontSize:16
                                  },
                                  position: 'inside'
                                },
                            },
                            name: '新春兴冶炼厂',  
                            value: [117.90306,34.402946]
                        }]
                    },
                    {  
                        name: "仓库至冶炼厂",  
                        type: 'lines',  
                        coordinateSystem: 'bmap',  
                        zlevel: 4,  
                        effect: {  
                            show: true,  
                            period: 6,  
                            trailLength: 0.3,  
                            color: '#FC626C',  
                            symbolSize: 8  
                        },  
                        lineStyle: {  
                            normal: {   
                                width: 0,  
                                curveness: 0.2  
                            }  
                        },  
                        data: [
                          {  
                              fromName: "江苏仓库",  
                              toName: "新春兴冶炼厂",  
                              coords: [[118.595978,32.976494], [117.90306,34.402946]],
                              name: "江苏仓库"+"至"+"新春兴冶炼厂",  
                              value: null
                          }
                        ] 
                    },  
                    {  
                        name: "仓库至冶炼厂",    
                        type: 'lines',  
                        coordinateSystem: 'bmap',  
                        zlevel: 5,  
                        effect: {  
                            show: true,  
                            period: 6,  
                            trailLength: 0,  
                            symbol: planePath,  
                            symbolSize: 0  
                        },  
                        lineStyle: {  
                            normal: {  
                                color: "#FFF5C9",  
                                width: 8,  
                                opacity: 0.4,  
                                curveness: 0.2  
                            }  
                        },  
                        data: [
                          {  
                              fromName: "江苏仓库",  
                              toName: "新春兴冶炼厂",  
                              coords: [[118.595978,32.976494], [117.90306,34.402946]],
                              name: "江苏仓库"+"至"+"新春兴冶炼厂",  
                              value: null
                          }
                        ]  
                    },
                    {  
                        name: "仓库至冶炼厂",  
                        type: 'lines',  
                        coordinateSystem: 'bmap',  
                        zlevel: 6,  
                        effect: {  
                            show: true,  
                            period: 6,  
                            trailLength: 0.3,  
                            color: '#FC626C',  
                            symbolSize: 8  
                        },  
                        lineStyle: {  
                            normal: {   
                                width: 0,  
                                curveness: 0.2  
                            }  
                        },  
                        data: [
                          {  
                              fromName: "江苏仓库",  
                              toName: "新春兴冶炼厂",  
                              coords: [[118.241233,34.377846], [117.90306,34.402946]],
                              name: "江苏仓库"+"至"+"新春兴冶炼厂",  
                              value: null
                          }
                        ] 
                    },  
                    {  
                        name: "仓库至冶炼厂",    
                        type: 'lines',  
                        coordinateSystem: 'bmap',  
                        zlevel: 7,  
                        effect: {  
                            show: true,  
                            period: 6,  
                            trailLength: 0,  
                            symbol: planePath,  
                            symbolSize: 0  
                        },  
                        lineStyle: {  
                            normal: {  
                                color: "#FFF5C9",  
                                width: 8,  
                                opacity: 0.4,  
                                curveness: 0.2  
                            }  
                        },  
                        data: [
                          {  
                              fromName: "江苏仓库",  
                              toName: "新春兴冶炼厂",  
                              coords: [[118.241233,34.377846], [117.90306,34.402946]],
                              name: "江苏仓库"+"至"+"新春兴冶炼厂",  
                              value: null
                          }
                        ]  
                    },
                    {  
                          name: '江苏用户',  
//                        type: 'effectScatter',  
                          type: 'scatter', 
                          coordinateSystem: 'bmap',  
                          zlevel: 2,  
//                        rippleEffect: {  
//                            brushType: 'fill',
//                            scale:5 
//                        },  
                          label: {  
                              normal: {  
                                  show: false,  
                                  position: 'right',  
                                  formatter: '{b}'  
                              }  
                          },  
                          symbolSize: 10, 
//                        effect : {
//                            show: true,
//                            shadowBlur : 0
//                        }, 
//                        itemStyle: {
//                            normal: {
//                                color: '#96B651',
//                                shadowBlur: 10,
//                                shadowColor: '#333'
//                            }
//                        }, 
                          large: true,
                          itemStyle: {
                              normal: {
                                  shadowBlur: 20,
                                  shadowColor: 'rgba(37, 140, 249, 0.8)',
                                  color: 'rgba(37, 140, 249, 0.8)'
                              }
                          },
                          data: mapgroup1.map(function (dataItem) {  
                              return {  
                                  name: dataItem.shop_name,  
                                  value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                              };  
                          })         
                    },
                    {  
                        name: '江苏用户',  
                        type: 'scatter', 
                        coordinateSystem: 'bmap',  
                        zlevel: 2,    
                        label: {  
                            normal: {  
                                show: false,  
                                position: 'right',  
                                formatter: '{b}'  
                            }  
                        },  
                        symbolSize: 10, 
                        large: true,
                        itemStyle: {
                            normal: {
                                shadowBlur: 20,
                                shadowColor: 'rgba(255, 255, 255, 0.8)',
                                color: 'rgba(255, 255, 255, 0.8)'
                            }
                        },
                        data: mapgroup2.map(function (dataItem) {  
                            return {  
                                name: dataItem.shop_name,  
                                value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                            };  
                        })         
                  },
                  {  
                      name: '江苏用户',   
                      type: 'scatter', 
                      coordinateSystem: 'bmap',  
                      zlevel: 2,  
                      label: {  
                          normal: {  
                              show: false,  
                              position: 'right',  
                              formatter: '{b}'  
                          }  
                      },  
                      symbolSize: 10, 
                      large: true,
                      itemStyle: {
                          normal: {
                              shadowBlur: 20,
                              shadowColor: 'rgba(14, 241, 242, 0.8)',
                              color: 'rgba(14, 241, 242, 0.8)'
                          }
                      },
                      data: mapgroup3.map(function (dataItem) {  
                          return {  
                              name: dataItem.shop_name,  
                              value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                          };  
                      })         
                }
                );
                var option = {  
                    backgroundColor: '#404a59',  
                    title : {  
                        // text: '模拟迁徙',  
                        // subtext: '数据纯属虚构',  
                        left: 'center',  
                        textStyle : {  
                            color: '#fff'  
                        }  
                    },  
                    tooltip : {  
                        position: function (pos, params, dom, rect, size) {
                            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
                            // var obj = {top: 200};
                            var obj;
                            obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = 5;
                            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                            return obj;
                        },
                        trigger: 'item' 
                    },   
                    bmap: {  
                        center: bmapCenter,  
                        zoom: vmapZoom,  
                        roam: true,
                        mapStyle: bmapStyle
                    },  
                    series: series  
                }; 
                myChart.clear();   
                myChart.setOption(option,true);
                var bmap=myChart.getModel().getComponent("bmap").getBMap();
                bmap.addEventListener("zoomend", function(){    
                    if(this.getZoom()<8&&afterMapStart==true){
                       myChart.clear();
                       setTimeout(function(){
                         series=[];
                         drawAll(mapInfoDatas);
                         initMap();
                       },100);
                    }  
                   });
                //检查点1
      },100);
  }
  //描绘江苏
var drawAnhui=function(){
    initMapStart=false;
    afterMapStart=true;
    series=[];
    var gap=1;
    $.ajax({
      type: "get",
      async:false,
      url: "js/ahData.json", // 获取安徽数据
      success: function(data){
         ahData=data;
      },
      error:function(XMLHttpRequest, textStatus, errorThrown){
      console.log(XMLHttpRequest);
      console.log(textStatus);
      console.log(errorThrown);
      }
    });
    while(gap<1000){
      var dataArray1=[];
      gap=gap+60;
      dataArray1.push(toObj1);
      dataArray1.push(ahData[gap]);
      HFData.push(dataArray1);
    }
    var randomCust=[];
    for(var z=0;z<300;z++){
        var orderStart=Math.random()*2000;
        var step=Math.random()*100;
        var nums=parseInt(orderStart+step);
        randomCust.push(ahData[nums]);
    }
    console.log(randomCust);
    var mapgroup1=[],mapgroup2=[],mapgroup3=[];
    for(var j=0;j<300;j++){
      mapgroup1.push(ahData[j]);
    };
    for(var k=300;k<800;k++){
      mapgroup2.push(ahData[k]);
    }; 
    for(var l=800;l<ahData.length;l++){
      mapgroup3.push(ahData[l]);
    }; 
    [['合肥', HFData]].forEach(function (item, i){  
        series.push(
                {  
                    name: '下单用户',  
                    type: 'effectScatter',   
                    coordinateSystem: 'bmap',  
                    zlevel: 10,  
                    rippleEffect: {  
                        brushType: 'fill',
                        scale:5 
                    },  
                    label: {  
                        normal: {  
                            show: false,  
                            position: 'right',  
                            formatter: '{b}'  
                        }  
                    },  
                    symbolSize: 7, 
                    effect : {
                        show: true,
                        shadowBlur : 0
                    }, 
                    itemStyle: {
                        normal: {
                            color: '#FA8695',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    }, 
                    data: randomCust.map(function (dataItem) {  
                        return {  
                            name: dataItem.shop_name,  
                            value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                        };  
                    })         
              }
//              {  
//                  name: item[0],  
//                  type: 'lines',  
//                  coordinateSystem: 'bmap',  
//                  zlevel: 1,  
//                  effect: {  
//                      show: true,  
//                      period: 16,  
//                      trailLength: 0.3,  
//                      color: '#fff',  
//                      symbolSize: 5  
//                  },  
//                  lineStyle: {  
//                      normal: {  
//                          color: color[i],  
//                          width: 0,  
//                          curveness: 0.2  
//                      }  
//                  },  
//                  data: convertData(item[1])  
//              },  
//              {  
//                  name: item[0] ,  
//                  type: 'lines',  
//                  coordinateSystem: 'bmap',  
//                  zlevel: 2,  
//                  effect: {  
//                      show: true,  
//                      period: 6,  
//                      trailLength: 0,  
//                      symbol: planePath,  
//                      symbolSize: 0  
//                  },  
//                  lineStyle: {  
//                      normal: {  
//                          color: color[i],  
//                          width: 2,  
//                          opacity: 0.4,  
//                          curveness: 0.2  
//                      }  
//                  },  
//                  data: convertData(item[1])  
//                 }
              ); 
          });
      series.push(
        {  
              name: '蚌埠仓库',  
              type: 'effectScatter',  
              coordinateSystem: 'bmap',  
              zlevel: 31,  
              rippleEffect: {  
                  brushType: 'fill',
                  scale:5 
              },  
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 25, 
              effect : {
                  show: true,
                  shadowBlur : 0
              }, 
              itemStyle: {
                  normal: {
                      color: '#32EBED',
                      shadowBlur: 10,
                      shadowColor: '#333'
                  }
              }, 
              data:[{  
                  label: {
                      text: '蚌埠仓库',
                      normal:{
                        show:true,
                        textStyle:{
                          color:'#FFF',
                          fontSize:16
                        },
                        position: 'inside'
                      },
                  },
                  name: '蚌埠仓库',  
                  value: [117.209238,32.962369]
              }]
          },
          {  
              name: '宿州仓库',  
              type: 'effectScatter',  
              coordinateSystem: 'bmap',  
              zlevel: 31,  
              rippleEffect: {  
                  brushType: 'fill',
                  scale:5 
              },  
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 25, 
              effect : {
                  show: true,
                  shadowBlur : 0
              }, 
              itemStyle: {
                  normal: {
                      color: '#9DD3F2',
                      shadowBlur: 10,
                      shadowColor: '#333'
                  }
              }, 
              data:[{  
                  label: {
                      text: '宿州仓库',
                      normal:{
                        show:true,
                        textStyle:{
                          color:'#FFF',
                          fontSize:16
                        },
                        position: 'inside'
                      },
                  },
                  name: '宿州仓库',  
                  value: [116.997584,33.612819]
              }]
         },
        {  
              name: '合肥仓库',  
              type: 'effectScatter',  
              coordinateSystem: 'bmap',  
              zlevel: 31,  
              rippleEffect: {  
                  brushType: 'fill',
                  scale:5 
              },  
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 25, 
              effect : {
                  show: true,
                  shadowBlur : 0
              }, 
              itemStyle: {
                  normal: {
                      color: '#FAAA74',
                      shadowBlur: 10,
                      shadowColor: '#333'
                  }
              }, 
              data:[{  
                  label: {
                      text: '合肥仓库',
                      normal:{
                        show:true,
                        textStyle:{
                          color:'#FFF',
                          fontSize:16
                        },
                        position: 'inside'
                      },
                  },
                  name: '合肥仓库',  
                  value: [117.563205,31.765229]
              }]
          },
         {  
              name: '界首冶炼厂',  
              type: 'effectScatter',  
              coordinateSystem: 'bmap',  
              zlevel: 31,  
              rippleEffect: {  
                  brushType: 'fill',
                  scale:5 
              },  
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 25, 
              effect : {
                  show: true,
                  shadowBlur : 0
              }, 
              itemStyle: {
                  normal: {
                      color: '#CB8EFA',
                      shadowBlur: 10,
                      shadowColor: '#333'
                  }
              }, 
              data:[{  
                  label: {
                      text: '界首冶炼厂',
                      normal:{
                        show:true,
                        textStyle:{
                          color:'#FFF',
                          fontSize:16
                        },
                        position: 'inside'
                      },
                  },
                  name: '界首冶炼厂',  
                  value: [115.398643,33.226193]
              }]
          },
          {  
              name: "仓库至冶炼厂",  
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 4,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0.3,  
                  color: '#FC626C',  
                  symbolSize: 8  
              },  
              lineStyle: {  
                  normal: {   
                      width: 0,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "安徽仓库",  
                    toName: "界首冶炼厂",  
                    coords: [[117.209238,32.962369], [115.398643,33.226193]],
                    name: "安徽仓库"+"至"+"界首冶炼厂",  
                    value: null
                }
              ] 
          },  
          {  
              name: "仓库至冶炼厂",    
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 5,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0,  
                  symbol: planePath,  
                  symbolSize: 0  
              },  
              lineStyle: {  
                  normal: {  
                      color: "#FFF5C9",  
                      width: 8,  
                      opacity: 0.4,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "安徽仓库",  
                    toName: "界首冶炼厂",  
                    coords: [[117.209238,32.962369], [115.398643,33.226193]],
                    name: "安徽仓库"+"至"+"界首冶炼厂",  
                    value: null
                }
              ]  
          },
          {  
              name: "仓库至冶炼厂",  
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 6,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0.3,  
                  color: '#FC626C',  
                  symbolSize: 8  
              },  
              lineStyle: {  
                  normal: {   
                      width: 0,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "安徽仓库",  
                    toName: "界首冶炼厂",  
                    coords: [[116.997584,33.612819], [115.398643,33.226193]],
                    name: "安徽仓库"+"至"+"界首冶炼厂",  
                    value: null
                }
              ] 
          },  
          {  
              name: "仓库至冶炼厂",    
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 7,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0,  
                  symbol: planePath,  
                  symbolSize: 0  
              },  
              lineStyle: {  
                  normal: {  
                      color: "#FFF5C9",  
                      width: 8,  
                      opacity: 0.4,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "安徽仓库",  
                    toName: "界首冶炼厂",  
                    coords: [[116.997584,33.612819], [115.398643,33.226193]],
                    name: "安徽仓库"+"至"+"界首冶炼厂",  
                    value: null
                }
              ]  
          },
          {  
              name: "仓库至冶炼厂",  
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 8,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0.3,  
                  color: '#FC626C',  
                  symbolSize: 8  
              },  
              lineStyle: {  
                  normal: {   
                      width: 0,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "安徽仓库",  
                    toName: "界首冶炼厂",  
                    coords: [[117.563205,31.765229], [115.398643,33.226193]],
                    name: "安徽仓库"+"至"+"界首冶炼厂",  
                    value: null
                }
              ] 
          },  
          {  
              name: "仓库至冶炼厂",    
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 9,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0,  
                  symbol: planePath,  
                  symbolSize: 0  
              },  
              lineStyle: {  
                  normal: {  
                      color: "#FFF5C9",  
                      width: 8,  
                      opacity: 0.4,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "安徽仓库",  
                    toName: "界首冶炼厂",  
                    coords: [[117.563205,31.765229], [115.398643,33.226193]],
                    name: "安徽仓库"+"至"+"界首冶炼厂",  
                    value: null
                }
              ]  
          },
          {  
                name: '合肥用户',  
//                type: 'effectScatter',  
                type: 'scatter', 
                coordinateSystem: 'bmap',  
                zlevel: 2,  
//                rippleEffect: {  
//                    brushType: 'fill',
//                    scale:5 
//                },  
                label: {  
                    normal: {  
                        show: false,  
                        position: 'right',  
                        formatter: '{b}'  
                    }  
                },  
                symbolSize: 10, 
//                effect : {
//                    show: true,
//                    shadowBlur : 0
//                }, 
//                itemStyle: {
//                    normal: {
//                        color: '#96B651',
//                        shadowBlur: 10,
//                        shadowColor: '#333'
//                    }
//                }, 
                large: true,
                itemStyle: {
                    normal: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(37, 140, 249, 0.8)',
                        color: 'rgba(37, 140, 249, 0.8)'
                    }
                },
                data: mapgroup1.map(function (dataItem) {  
                    return {  
                        name: dataItem.shop_name,  
                        value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                    };  
                })         
          },
          {  
              name: '合肥用户',  
              type: 'scatter', 
              coordinateSystem: 'bmap',  
              zlevel: 2,    
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 10, 
              large: true,
              itemStyle: {
                  normal: {
                      shadowBlur: 20,
                      shadowColor: 'rgba(255, 255, 255, 0.8)',
                      color: 'rgba(255, 255, 255, 0.8)'
                  }
              },
              data: mapgroup2.map(function (dataItem) {  
                  return {  
                      name: dataItem.shop_name,  
                      value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                  };  
              })         
        },
        {  
            name: '合肥用户',   
            type: 'scatter', 
            coordinateSystem: 'bmap',  
            zlevel: 2,  
            label: {  
                normal: {  
                    show: false,  
                    position: 'right',  
                    formatter: '{b}'  
                }  
            },  
            symbolSize: 10, 
            large: true,
            itemStyle: {
                normal: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(14, 241, 242, 0.8)',
                    color: 'rgba(14, 241, 242, 0.8)'
                }
            },
            data: mapgroup3.map(function (dataItem) {  
                return {  
                    name: dataItem.shop_name,  
                    value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                };  
            })         
      }
      );
      var option = {  
          backgroundColor: '#404a59',  
          title : {  
              // text: '模拟迁徙',  
              // subtext: '数据纯属虚构',  
              left: 'center',  
              textStyle : {  
                  color: '#fff'  
              }  
          },  
          tooltip : {  
              position: function (pos, params, dom, rect, size) {
                  // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
                  // var obj = {top: 200};
                  var obj;
                  obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = 5;
                  obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                  return obj;
              },
              trigger: 'item' 
          },   
          bmap: {  
              center: bmapCenter,  
              zoom: vmapZoom,  
              roam: true,
              mapStyle: bmapStyle
          },  
          series: series  
      }; 
      myChart.clear();   
      myChart.setOption(option,true);
      var bmap=myChart.getModel().getComponent("bmap").getBMap();
      var steps=1;
      var ahGroup1=[],ahGroup2=[],ahGroup3=[];
      while(steps<9800){
        try //非IE
        {
            steps=steps+20;
            var temp=ahData[steps];
          var tempX=temp.map_x; 
            var tempY=temp.map_y; 
              var point1=new BMap.Point(117.209238,32.962369);
              var point2=new BMap.Point(116.997584,33.612819);
              var point3=new BMap.Point(117.563205,31.765229);
              var pointB = new BMap.Point(tempX,tempY);
              var len1 = bmap.getDistance(point1,pointB).toFixed(2);
              var len2 = bmap.getDistance(point2,pointB).toFixed(2);
              var len3 = bmap.getDistance(point3,pointB).toFixed(2);
              if(len1<60000){
                ahGroup1.push(ahData[steps]); 
              }
              if(len2<60000){
                ahGroup2.push(ahData[steps]); 
              }
              if(len3<60000){
                ahGroup3.push(ahData[steps]); 
              }
         
        }
        catch(e)//IE
        {
          console.log(steps);
        }
      }
      console.log(ahGroup1.length);
      console.log(ahGroup2.length);
      console.log(ahGroup3.length);
      setTimeout(function(){
          series=[];
          var toCo1={},toCo2={},toCo3={};
          toCo1.name="蚌埠仓库";
          toCo1.map=[117.209238,32.962369];
          toCo2.name="宿州仓库";
          toCo2.map=[116.997584,33.612819];
          toCo3.name="合肥仓库";
          toCo3.map=[117.563205,31.765229];
           [['合肥', HFData]].forEach(function (item, i){  
        series.push(
                {  
                    name: '下单用户',  
                    type: 'effectScatter',   
                    coordinateSystem: 'bmap',  
                    zlevel: 10,  
                    rippleEffect: {  
                        brushType: 'fill',
                        scale:5 
                    },  
                    label: {  
                        normal: {  
                            show: false,  
                            position: 'right',  
                            formatter: '{b}'  
                        }  
                    },  
                    symbolSize: 7, 
                    effect : {
                        show: true,
                        shadowBlur : 0
                    }, 
                    itemStyle: {
                        normal: {
                            color: '#FA8695',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    }, 
                    data: randomCust.map(function (dataItem) {  
                        return {  
                            name: dataItem.shop_name,  
                            value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                        };  
                    })         
              },
              {  
                  name: item[0],  
                  type: 'lines',  
                  coordinateSystem: 'bmap',  
                  zlevel: 15,  
                  effect: {  
                      show: true,  
                      period: 16,  
                      trailLength: 0.3,  
                      color: '#fff',  
                      symbolSize: 5  
                  },  
                  lineStyle: {  
                      normal: {  
                          color: color[i],  
                          width: 0,  
                          curveness: 0.2  
                      }  
                  },  
                  data: convertData1(toCo1,ahGroup1)
              },  
              {  
                  name: item[0] ,  
                  type: 'lines',  
                  coordinateSystem: 'bmap',  
                  zlevel: 16,  
                  effect: {  
                      show: true,  
                      period: 6,  
                      trailLength: 0,  
                      symbol: planePath,  
                      symbolSize: 0  
                  },  
                  lineStyle: {  
                      normal: {  
                          color: color[i],  
                          width: 2,  
                          opacity: 0.4,  
                          curveness: 0.2  
                      }  
                  },  
                  data: convertData1(toCo1,ahGroup1)  
                 },
                               {  
                  name: item[0],  
                  type: 'lines',  
                  coordinateSystem: 'bmap',  
                  zlevel: 17,  
                  effect: {  
                      show: true,  
                      period: 16,  
                      trailLength: 0.3,  
                      color: '#fff',  
                      symbolSize: 5  
                  },  
                  lineStyle: {  
                      normal: {  
                          color: color[i],  
                          width: 0,  
                          curveness: 0.2  
                      }  
                  },  
                  data: convertData1(toCo2,ahGroup2)
              },  
              {  
                  name: item[0] ,  
                  type: 'lines',  
                  coordinateSystem: 'bmap',  
                  zlevel: 18,  
                  effect: {  
                      show: true,  
                      period: 6,  
                      trailLength: 0,  
                      symbol: planePath,  
                      symbolSize: 0  
                  },  
                  lineStyle: {  
                      normal: {  
                          color: color[i],  
                          width: 2,  
                          opacity: 0.4,  
                          curveness: 0.2  
                      }  
                  },  
                  data: convertData1(toCo2,ahGroup2)  
                 },              {  
                  name: item[0],  
                  type: 'lines',  
                  coordinateSystem: 'bmap',  
                  zlevel: 19,  
                  effect: {  
                      show: true,  
                      period: 16,  
                      trailLength: 0.3,  
                      color: '#fff',  
                      symbolSize: 5  
                  },  
                  lineStyle: {  
                      normal: {  
                          color: color[i],  
                          width: 0,  
                          curveness: 0.2  
                      }  
                  },  
                  data: convertData1(toCo3,ahGroup3)
              },  
              {  
                  name: item[0] ,  
                  type: 'lines',  
                  coordinateSystem: 'bmap',  
                  zlevel: 20,  
                  effect: {  
                      show: true,  
                      period: 6,  
                      trailLength: 0,  
                      symbol: planePath,  
                      symbolSize: 0  
                  },  
                  lineStyle: {  
                      normal: {  
                          color: color[i],  
                          width: 2,  
                          opacity: 0.4,  
                          curveness: 0.2  
                      }  
                  },  
                  data: convertData1(toCo3,ahGroup3)  
                 }
              ); 
          });
      series.push(
        {  
              name: '蚌埠仓库',  
              type: 'effectScatter',  
              coordinateSystem: 'bmap',  
              zlevel: 11,  
              rippleEffect: {  
                  brushType: 'fill',
                  scale:5 
              },  
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 25, 
              effect : {
                  show: true,
                  shadowBlur : 0
              }, 
              itemStyle: {
                  normal: {
                      color: '#32EBED',
                      shadowBlur: 10,
                      shadowColor: '#333'
                  }
              }, 
              data:[{  
                  label: {
                      text: '蚌埠仓库',
                      normal:{
                        show:true,
                        textStyle:{
                          color:'#FFF',
                          fontSize:16
                        },
                        position: 'inside'
                      },
                  },
                  name: '蚌埠仓库',  
                  value: [117.209238,32.962369]
              }]
          },
          {  
              name: '宿州仓库',  
              type: 'effectScatter',  
              coordinateSystem: 'bmap',  
              zlevel: 11,  
              rippleEffect: {  
                  brushType: 'fill',
                  scale:5 
              },  
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 25, 
              effect : {
                  show: true,
                  shadowBlur : 0
              }, 
              itemStyle: {
                  normal: {
                      color: '#9DD3F2',
                      shadowBlur: 10,
                      shadowColor: '#333'
                  }
              }, 
              data:[{  
                  label: {
                      text: '宿州仓库',
                      normal:{
                        show:true,
                        textStyle:{
                          color:'#FFF',
                          fontSize:16
                        },
                        position: 'inside'
                      },
                  },
                  name: '宿州仓库',  
                  value: [116.997584,33.612819]
              }]
         },
        {  
              name: '合肥仓库',  
              type: 'effectScatter',  
              coordinateSystem: 'bmap',  
              zlevel: 11,  
              rippleEffect: {  
                  brushType: 'fill',
                  scale:5 
              },  
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 25, 
              effect : {
                  show: true,
                  shadowBlur : 0
              }, 
              itemStyle: {
                  normal: {
                      color: '#FAAA74',
                      shadowBlur: 10,
                      shadowColor: '#333'
                  }
              }, 
              data:[{  
                  label: {
                      text: '合肥仓库',
                      normal:{
                        show:true,
                        textStyle:{
                          color:'#FFF',
                          fontSize:16
                        },
                        position: 'inside'
                      },
                  },
                  name: '合肥仓库',  
                  value: [117.563205,31.765229]
              }]
          },
         {  
              name: '界首冶炼厂',  
              type: 'effectScatter',  
              coordinateSystem: 'bmap',  
              zlevel: 3,  
              rippleEffect: {  
                  brushType: 'fill',
                  scale:5 
              },  
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 25, 
              effect : {
                  show: true,
                  shadowBlur : 0
              }, 
              itemStyle: {
                  normal: {
                      color: '#CB8EFA',
                      shadowBlur: 10,
                      shadowColor: '#333'
                  }
              }, 
              data:[{  
                  label: {
                      text: '界首冶炼厂',
                      normal:{
                        show:true,
                        textStyle:{
                          color:'#FFF',
                          fontSize:16
                        },
                        position: 'inside'
                      },
                  },
                  name: '界首冶炼厂',  
                  value: [115.398643,33.226193]
              }]
          },
          {  
              name: "仓库至冶炼厂",  
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 4,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0.3,  
                  color: '#FC626C',  
                  symbolSize: 8  
              },  
              lineStyle: {  
                  normal: {   
                      width: 0,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "安徽仓库",  
                    toName: "界首冶炼厂",  
                    coords: [[117.209238,32.962369], [115.398643,33.226193]],
                    name: "安徽仓库"+"至"+"界首冶炼厂",  
                    value: null
                }
              ] 
          },  
          {  
              name: "仓库至冶炼厂",    
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 5,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0,  
                  symbol: planePath,  
                  symbolSize: 0  
              },  
              lineStyle: {  
                  normal: {  
                      color: "#FFF5C9",  
                      width: 8,  
                      opacity: 0.4,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "安徽仓库",  
                    toName: "界首冶炼厂",  
                    coords: [[117.209238,32.962369], [115.398643,33.226193]],
                    name: "安徽仓库"+"至"+"界首冶炼厂",  
                    value: null
                }
              ]  
          },
          {  
              name: "仓库至冶炼厂",  
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 6,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0.3,  
                  color: '#FC626C',  
                  symbolSize: 8  
              },  
              lineStyle: {  
                  normal: {   
                      width: 0,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "安徽仓库",  
                    toName: "界首冶炼厂",  
                    coords: [[116.997584,33.612819], [115.398643,33.226193]],
                    name: "安徽仓库"+"至"+"界首冶炼厂",  
                    value: null
                }
              ] 
          },  
          {  
              name: "仓库至冶炼厂",    
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 7,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0,  
                  symbol: planePath,  
                  symbolSize: 0  
              },  
              lineStyle: {  
                  normal: {  
                      color: "#FFF5C9",  
                      width: 8,  
                      opacity: 0.4,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "安徽仓库",  
                    toName: "界首冶炼厂",  
                    coords: [[116.997584,33.612819], [115.398643,33.226193]],
                    name: "安徽仓库"+"至"+"界首冶炼厂",  
                    value: null
                }
              ]  
          },
          {  
              name: "仓库至冶炼厂",  
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 8,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0.3,  
                  color: '#FC626C',  
                  symbolSize: 8  
              },  
              lineStyle: {  
                  normal: {   
                      width: 0,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "安徽仓库",  
                    toName: "界首冶炼厂",  
                    coords: [[117.563205,31.765229], [115.398643,33.226193]],
                    name: "安徽仓库"+"至"+"界首冶炼厂",  
                    value: null
                }
              ] 
          },  
          {  
              name: "仓库至冶炼厂",    
              type: 'lines',  
              coordinateSystem: 'bmap',  
              zlevel: 9,  
              effect: {  
                  show: true,  
                  period: 6,  
                  trailLength: 0,  
                  symbol: planePath,  
                  symbolSize: 0  
              },  
              lineStyle: {  
                  normal: {  
                      color: "#FFF5C9",  
                      width: 8,  
                      opacity: 0.4,  
                      curveness: 0.2  
                  }  
              },  
              data: [
                {  
                    fromName: "安徽仓库",  
                    toName: "界首冶炼厂",  
                    coords: [[117.563205,31.765229], [115.398643,33.226193]],
                    name: "安徽仓库"+"至"+"界首冶炼厂",  
                    value: null
                }
              ]  
          },
          {  
                name: '合肥用户',  
//                type: 'effectScatter',  
                type: 'scatter', 
                coordinateSystem: 'bmap',  
                zlevel: 2,  
//                rippleEffect: {  
//                    brushType: 'fill',
//                    scale:5 
//                },  
                label: {  
                    normal: {  
                        show: false,  
                        position: 'right',  
                        formatter: '{b}'  
                    }  
                },  
                symbolSize: 10, 
//                effect : {
//                    show: true,
//                    shadowBlur : 0
//                }, 
//                itemStyle: {
//                    normal: {
//                        color: '#96B651',
//                        shadowBlur: 10,
//                        shadowColor: '#333'
//                    }
//                }, 
                large: true,
                itemStyle: {
                    normal: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(37, 140, 249, 0.8)',
                        color: 'rgba(37, 140, 249, 0.8)'
                    }
                },
                data: mapgroup1.map(function (dataItem) {  
                    return {  
                        name: dataItem.shop_name,  
                        value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                    };  
                })         
          },
          {  
              name: '合肥用户',  
              type: 'scatter', 
              coordinateSystem: 'bmap',  
              zlevel: 2,    
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 10, 
              large: true,
              itemStyle: {
                  normal: {
                      shadowBlur: 20,
                      shadowColor: 'rgba(255, 255, 255, 0.8)',
                      color: 'rgba(255, 255, 255, 0.8)'
                  }
              },
              data: mapgroup2.map(function (dataItem) {  
                  return {  
                      name: dataItem.shop_name,  
                      value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                  };  
              })         
        },
        {  
            name: '合肥用户',   
            type: 'scatter', 
            coordinateSystem: 'bmap',  
            zlevel: 2,  
            label: {  
                normal: {  
                    show: false,  
                    position: 'right',  
                    formatter: '{b}'  
                }  
            },  
            symbolSize: 10, 
            large: true,
            itemStyle: {
                normal: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(14, 241, 242, 0.8)',
                    color: 'rgba(14, 241, 242, 0.8)'
                }
            },
            data: mapgroup3.map(function (dataItem) {  
                return {  
                    name: dataItem.shop_name,  
                    value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                };  
            })         
      }
      );
      var option = {  
          backgroundColor: '#404a59',  
          title : {  
              // text: '模拟迁徙',  
              // subtext: '数据纯属虚构',  
              left: 'center',  
              textStyle : {  
                  color: '#fff'  
              }  
          },  
          tooltip : {  
              position: function (pos, params, dom, rect, size) {
                  // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
                  // var obj = {top: 200};
                  var obj;
                  obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = 5;
                  obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                  return obj;
              },
              trigger: 'item' 
          },   
          bmap: {  
              center: bmapCenter,  
              zoom: vmapZoom,  
              roam: true,
              mapStyle: bmapStyle
          },  
          series: series  
      }; 
      myChart.clear();   
      myChart.setOption(option,true);
      var bmap=myChart.getModel().getComponent("bmap").getBMap();
      bmap.addEventListener("zoomend", function(){    
          if(this.getZoom()<8&&afterMapStart==true){
           myChart.clear();
             setTimeout(function(){
               drawAll(mapInfoDatas);
               initMap();
             },100);
          }  
         });
      },100);
      // myChart.on('click', function (params) {
      //     console.log(params);
      // });
  }//描绘安徽
 var drawJinan=function(){
    initMapStart=false;
    afterMapStart=true;
    series=[];
    $.ajax({
      type: "get",
      async:false,
      url: "js/shandongData.json", //获取济南数据
      success: function(data){
        sdData=data;
      },
      error:function(XMLHttpRequest, textStatus, errorThrown){
      console.log(XMLHttpRequest);
      console.log(textStatus);
      console.log(errorThrown);
      }
    }); 
    for(var i=0;i<50;i++){
      var dataArray=[];
      dataArray.push(toObj);
      dataArray.push(sdData[i]);
      JNData.push(dataArray);
    }
    var randomCust=[];
    for(var z=0;z<100;z++){
        var orderStart=Math.random()*2000;
        var step=Math.random()*100;
        var nums=parseInt(orderStart+step);
        randomCust.push(sdData[nums]);
    }
    var mapgroup1=[],mapgroup2=[],mapgroup3=[];
    for(var j=0;j<500;j++){
      mapgroup1.push(sdData[j]);
    };
    for(var k=500;k<1400;k++){
      mapgroup2.push(sdData[k]);
    }; 
    for(var l=1400;l<sdData.length;l++){
      mapgroup3.push(sdData[l]);
    }; 
    series.push(
            {  
                name: '下单用户',  
                type: 'effectScatter',   
                coordinateSystem: 'bmap',  
                zlevel: 10,  
                rippleEffect: {  
                    brushType: 'fill',
                    scale:5 
                },  
                label: {  
                    normal: {  
                        show: false,  
                        position: 'right',  
                        formatter: '{b}'  
                    }  
                },  
                symbolSize: 7, 
                effect : {
                    show: true,
                    shadowBlur : 0
                }, 
                itemStyle: {
                    normal: {
                        color: '#FA8695',
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                }, 
                data: randomCust.map(function (dataItem) {  
                    return {  
                        name: dataItem.shop_name,  
                        value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                    };  
                })         
          },
         // {  
         //      name: '济南仓库',  
         //      type: 'effectScatter',  
         //      coordinateSystem: 'bmap',  
         //      zlevel: 3,  
         //      rippleEffect: {  
         //          brushType: 'fill',
         //          scale:5 
         //      },  
         //      label: {  
         //          normal: {  
         //              show: false,  
         //              position: 'right',  
         //              formatter: '{b}'  
         //          }  
         //      },  
         //      symbolSize: 25, 
         //      effect : {
         //          show: true,
         //          shadowBlur : 0
         //      }, 
         //      itemStyle: {
         //          normal: {
         //              color: '#5FF7C9',
         //              shadowBlur: 10,
         //              shadowColor: '#333'
         //          }
         //      }, 
         //      data:[{  
         //          label: {
         //              text: '济南仓库',
         //              normal:{
         //                show:true,
         //                textStyle:{
         //                  color:'#FFF',
         //                  fontSize:16
         //                },
         //                position: 'inside'
         //              },
         //          },
         //          name: '济南仓库',  
         //          value: [117.024967,36.682785]
         //      }]
         //  },
           {  
                name: '济南用户',  
//                type: 'effectScatter', 
                type: 'scatter',  
                coordinateSystem: 'bmap',  
                zlevel: 2,  
//                rippleEffect: {  
//                    brushType: 'fill',
//                    scale:5 
//                },  
                label: {  
                    normal: {  
                        show: false,  
                        position: 'right',  
                        formatter: '{b}'  
                    }  
                },  
                symbolSize: 10, 
//                effect : {
//                    show: true,
//                    shadowBlur : 0
//                }, 
//                itemStyle: {
//                    normal: {
//                        color: '#E7DC5A',
//                        shadowBlur: 10,
//                        shadowColor: '#333'
//                    }
//                },
                large: true,
                itemStyle: {
                    normal: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(255, 255, 255, 0.8)',
                        color: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                data: mapgroup3.map(function (dataItem) {  
                    return {  
                        name: dataItem.shop_name,  
                        value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                    };  
                })  
            },
            {  
                name: '济南用户',  
                type: 'scatter',  
                coordinateSystem: 'bmap',  
                zlevel: 2,  
                label: {  
                    normal: {  
                        show: false,  
                        position: 'right',  
                        formatter: '{b}'  
                    }  
                },  
                symbolSize: 10, 
                large: true,
                itemStyle: {
                    normal: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(14, 241, 242, 0.8)',
                        color: 'rgba(14, 241, 242, 0.8)'
                    }
                },
                data: mapgroup2.map(function (dataItem) {  
                    return {  
                        name: dataItem.shop_name,  
                        value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                    };  
                })  
            },
            {  
                name: '济南用户',  
                type: 'scatter',  
                coordinateSystem: 'bmap',  
                zlevel: 2,    
                label: {  
                    normal: {  
                        show: false,  
                        position: 'right',  
                        formatter: '{b}'  
                    }  
                },  
                symbolSize: 10, 
                large: true,
                itemStyle: {
                    normal: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(37, 140, 249, 0.8)',
                        color: 'rgba(37, 140, 249, 0.8)'
                    }
                },
                data: mapgroup1.map(function (dataItem) {  
                    return {  
                        name: dataItem.shop_name,  
                        value: [dataItem.map_x,dataItem.map_y].concat([dataItem.cust_address])
                    };  
                })  
            }
      );
      //描绘济南
      var option = {  
          backgroundColor: '#404a59',  
          title : {  
              // text: '模拟迁徙',  
              // subtext: '数据纯属虚构',  
              left: 'center',  
              textStyle : {  
                  color: '#fff'  
              }  
          },  
          tooltip : {  
              position: function (pos, params, dom, rect, size) {
                  // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧
                  // var obj = {top: pos[1],left :pos[0]};
                  var obj;
                  obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = 5;
                  obj[['left', 'right'][+(pos[0] < size.viewSize[1] / 2)]] = 5;
                  return obj;
              },
              trigger: 'item' 
          },   
          bmap: {  
              center: bmapCenter,  
              zoom: vmapZoom,  
              roam: true,
              mapStyle: bmapStyle
          },  
          series: series  
      }; 
      myChart.clear();   
      myChart.setOption(option,true);
      var bmap=myChart.getModel().getComponent("bmap").getBMap();
      bmap.addEventListener("zoomend", function(){    
       if(this.getZoom()<8&&afterMapStart==true){
        myChart.clear();
          setTimeout(function(){
          drawAll(mapInfoDatas);
            initMap();
          },100);
       } 
      })
  };
function initMap(){
    initMapStart=true;
    afterMapStart=false;
    for(var i=0;i<initMapDate.length;i++){
      series.push(
       {  
          name: initMapDate[i].name+'用户',  
          type: 'effectScatter',  
          coordinateSystem: 'bmap',  
          zlevel: 3,  
          rippleEffect: {  
              brushType: 'fill',
              scale:5 
          },  
          label: {  
              normal: {  
                  show: false,  
                  position: 'right',  
                  formatter: '{b}'  
              }  
          },  
          symbolSize: 45, 
          effect : {
              show: true,
              shadowBlur : 0
          }, 
          itemStyle: {
              normal: {
                  color: color[i],
                  shadowBlur: 10,
                  shadowColor: '#333'
              }
          }, 
          data:[{  
              label: {
                  text: initMapDate[i].name+'用户',
                  normal:{
                    show:true,
                    textStyle:{
                      color:'#FFF',
                      fontSize:16
                    },
                    position: 'inside'
                  },
              },
              name: initMapDate[i].name,  
              value: [initMapDate[i].map_x,initMapDate[i].map_y].concat([initMapDate[i].value])
          }]
      }
    );
  }
  var option = {  
    backgroundColor: '#404a59',  
    title : {  
        // text: '模拟迁徙',  
        // subtext: '数据纯属虚构',  
        left: 'center',  
        textStyle : {  
            color: '#fff'  
        }  
    },  
    tooltip : {  
        trigger: 'item',
        formatter: '{b0}:{c0}<br />' 
    },   
    bmap: {  
        center: [117.188107,34.271553],  
        zoom: 8,  
        roam: true,
        mapStyle: bmapStyle
    },  
    series: series  
  };   
  myChart.clear();  
  myChart.setOption(option,true);
  var bmap=myChart.getModel().getComponent("bmap").getBMap();
             var myGeo = new BMap.Geocoder();
       myGeo.getPoint("江苏  连云港市", function (point) {
         console.log(point);
       })
//  myChart.on('click', function (params) {
//      initMapClick=params.name;
//      if(initMapStart==true){
//        if(params.name=="济南"){
//          vmapZoom=13;
//          bmapCenter=[117.024967,36.682785];
//          getUsersDatas(25,drawJinan);
//        }else if(params.name=="合肥"){
//            vmapZoom=7;
//            bmapCenter=[117.563205,31.765229];
//            getUsersDatas(22,drawAnhui);
//         }else{
//            vmapZoom=7;
//            bmapCenter=[118.595978,32.976494];
//            getUsersDatas(20,drawJiangsu);
//         }
//      }
//  });
  myChart.on('dblclick', function (params) {
      initMapClick=params.name;
      if(initMapStart==true){
        if(params.name=="山东"){
          vmapZoom=9;
          bmapCenter=[117.024967,36.682785];
          getUsersDatas(25,drawJinan);
        }else if(params.name=="安徽"){
          vmapZoom=9;
          bmapCenter=[117.209238,32.962369];
          getUsersDatas(22,drawAnhui);
        }else{
            vmapZoom=9;
            bmapCenter=[118.241233,34.377846];
          getUsersDatas(20,drawJiangsu);
        }
    }
  });
//  bmap.addEventListener("zoomend", function(){   
//   if(this.getZoom()>6&&initMapStart==true&&initMapClick!="济南"){
//      series=[];
//      drawAnhui();
//   };    
//  });
 };
var drawAll=function(datas){
  var mids1=[],mids2=[],mids3=[];
  var len= datas.length;
  for(var i=0;i<len;i++){
    var item = datas[i];
    //今日有下单的
    if(item.type=="1"){
        mids3.push(item);
    }else if(item.type=="2"){//今日有回收的
        mids1.push(item);
    }else if(item.type=="3"){//其他
        mids2.push(item);
    }
  }
 /* for(var j=8000;j<14000;j++){
    mids2.push(datas[j]);
  }
  for(var k=14000;k<datas.length;k++){
    mids3.push(datas[k]);
  }*/

    series=[];
    series.push(
     {  
             name: '全国用户',  
             type: 'scatter', 
             coordinateSystem: 'bmap',  
             zlevel: 2,  
             label: {  
                 normal: {  
                     show: false,  
                     position: 'right',  
                     formatter: '{b}'  
                 }  
             },  
             symbolSize: 5, 
             large: true,
             itemStyle: {
                 normal: {
                     shadowBlur: 20,
                  shadowColor: 'rgba(193, 255, 229, 0.8)',
                  color: 'rgba(193, 255, 229, 0.8)'
                 }
             },
             data: mids1.map(function (dataItem) {  
                 return {  
                     name: dataItem.shopName,  
                     value: [dataItem.longitude,dataItem.latitude].concat([dataItem.address])
                 };  
             })         
       },
       {  
              name: '全国用户',  
              type: 'scatter', 
              coordinateSystem: 'bmap',  
              zlevel: 2,  
              label: {  
                  normal: {  
                      show: false,  
                      position: 'right',  
                      formatter: '{b}'  
                  }  
              },  
              symbolSize: 5, 
              large: true,
              itemStyle: {
                  normal: {
                      shadowBlur: 20,
                   shadowColor: 'rgba(255, 255, 255, 0.8)',
                   color: 'rgba(255, 255, 255, 0.8)'
                  }
              },
              data: mids2.map(function (dataItem) {  
                  return {  
                    name: dataItem.shopName,  
                    value: [dataItem.longitude,dataItem.latitude].concat([dataItem.address])
                  };  
              })         
        },                
        {  
             name: '全国用户',  
             type: 'scatter', 
             coordinateSystem: 'bmap',  
             zlevel: 2,  
             label: {  
                 normal: {  
                     show: false,  
                     position: 'right',  
                     formatter: '{b}'  
                 }  
             },  
             symbolSize: 5, 
             large: true,
             itemStyle: {
                 normal: {
                     shadowBlur: 20,
                  shadowColor: 'rgba(14, 241, 242, 0.8)',
                  color: 'rgba(14, 241, 242, 0.8)'
                 }
             },
             data: mids3.map(function (dataItem) {  
                 return {  
                    name: dataItem.shopName,  
                    value: [dataItem.longitude,dataItem.latitude].concat([dataItem.address])
                 };  
             })         
       }
     );
};
var getUsersDatas=function(idx,func){//获取用户数据
  var feedBack=func;
    var param=idx;
  var datas={};
  datas.op="search";
  datas.page=1;
  datas.rows=1000000;
  if(param!=null && param!=undefined){
    datas.areaId=param;
  }
  feedBack();
//    $.ajax({
//      async:true,
//        type:"POST",
//        url:'../customer/searchCustomer',
//        headers: {'Content-Type': 'application/json;charset=utf-8'},
//        data:datas,
//        dataType:'json',
//        success:function(data) {
//          mapDatas=data.rows;
//          if(feedBack!=null&&feedBack!=undefined){
//            series=[];
//            feedBack();
//          }
//            if(param==null){
//              mapInfoDatas=data;
//              drawAll(mapInfoDatas);
//                initMap();
//            }
//        },
//        error:function(n){
//          console.log(n);
//        }
//      });
};
//getUsersDatas(null,null);

var firstDone=function(){
  var datas={};
  datas.op="search";
  datas.page=1;
  datas.rows=1000000;
  $.ajax({
    async:true,
      type:"POST",
      url:'../customer/searchCustomer', //获取全国数据
      headers: {'Content-Type': 'application/json;charset=utf-8'},
      data:datas,
      dataType:'json',
      success:function(data) {
          mapInfoDatas=data;
          drawAll(mapInfoDatas);
            initMap();
      },
      error:function(n){
        console.log(n);
      }
    });
}
//firstDone();
//initMap();
      //省市区选择列表
  var getProvince=function(){//获取省
    $.ajax({
      async:false,
        type:"GET",
        url:'../performance/getAllProvince',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        dataType:'json',
        success:function(data) {
          var datas=eval("("+data.province+")");
          for(var i=0;i<datas.length;i++){
            var op=document.createElement("li");
            op.setAttribute("id",datas[i].provinceId); 
            op.appendChild(document.createTextNode(datas[i].provinceName));
            $("#vMap_slcPane").find("ul").append(op);
          }
            $(function(){
              $("#vMap_slcPane").find("li").each(function(){
                $(this).click(function(){
                  slcP=selectedAddress=$(this).html();
                  provinceIds=$(this).attr("id");
                  console.log(provinceIds);
                  if(selectedAddress=="山东省"){
                      vmapZoom=9;
                      bmapCenter=[117.024967,36.682785];
                      getUsersDatas(25,drawJinan);
                    }else if(selectedAddress=="安徽省"){
                      vmapZoom=9;
                      bmapCenter=[117.209238,32.962369];
                      getUsersDatas(22,drawAnhui);
                    }else{
                      vmapZoom=9;
                      bmapCenter=[118.241233,34.377846];
                      getUsersDatas(20,drawJiangsu);
                  }
                  $("#vprovince").find("label").html(slcP);
                  $("#vcity").find("label").html('市');
                  $("#vMap_slcPane").animate({"height":0},500);
                  vsp=null;
                });
              });  
            });
        },
        error:function(n){
          console.log(n);
        }
      });
  };
  var getCity=function(Id){//获取市
     $.ajax({
        type:"POST",
        async:false,
        url:'../performance/getCityByProvinceId',
        headers: {Accept: "application/json; charset=utf-8"},
        data:
        {
          provinceId : Id
        },
        dataType:'json',
        success:function(data) {
        var datas=eval("("+data.city+")");
        for(var i=0;i<datas.length;i++){
          var op=document.createElement("li"); 
          op.setAttribute("id",datas[i].cityId); 
          op.appendChild(document.createTextNode(datas[i].cityName));
          $("#vMap_slcPane").find("ul").append(op);
        }
              $("#vMap_slcPane").find("li").each(function(){
                $(this).click(function(){
                  slcC=$(this).html();
                  $("#vcity").find("label").html(slcC);
                  $("#vMap_slcPane").animate({"height":0},500);
                  vsp=null;
                  if(slcC=="济南市"){
                    bmapCenter=[117.024967,36.682785];
                    setTimeout(function(){
                      vmapZoom=13;
                      drawJinan();
                    },500);
                  }
                });
              });
        },
        error:function(n){
          console.log(n);
        }
      });
};
$("#vMap_slcPane").animate({"height":0},1000);
var vsp=null,slcP=null,slcC=null,provinceIds=null;//判断是否出现选择面板
  function slcPaneToggle(slc){
    var vMapSlcLi=($("#vMap_slcPane").width()-100)/5;
    var vMapSlcLiRow=$("#vMap_slcPane li").length%5==0?parseInt($("#vMap_slcPane li").length/5):parseInt($("#vMap_slcPane li").length/5)+1;
    $("#vMap_slcPane ul").css({"width":$("#vMap_slcPane").width()+26,"height":$("#vMap_slcPane ul").height()+26});
    $("#vMap_slcPane li").css({"width":vMapSlcLi});
      if(vsp!=slc){
          $("#vMap_slcPane").show();
          if(($("#vMap_slcPane li").height()+20)*vMapSlcLiRow<200){
              $("#vMap_slcPane").animate({"height":($("#vMap_slcPane li").height()+20)*vMapSlcLiRow},500);
          }else{
              $("#vMap_slcPane").animate({"height":200},500);
          }
          vsp=slc;
      }else{
          $("#vMap_slcPane").animate({"height":0},500);
          vsp=null;
          $("#vMap_slcPane").hide();
      }
  }
  $(".vMap_con1_slc li").each(function(){
    $(this).click(function(){
        var slc=$(this).attr("id");
        $("#vMap_slcPane").find("ul").empty();
        if(slc=="vprovince"){
          getProvince();
        }else if(slc=="vcity" && provinceIds!=null){
          getCity(provinceIds);
        }
        slcPaneToggle(slc);
//        }else if(slc=="vcity"&&slcP=="安徽省"){
//          $("#vMap_slcPane").find("ul").append("<li>合肥市</li>");
//          $("#vMap_slcPane").find("li").each(function(){
//             $(this).click(function(){
//              slcC=$(this).html();
//              $("#vcity").find("label").html(slcC);
//              $("#vMap_slcPane").animate({"height":0},500);
//              vsp=null;
//              bmapCenter=[117.563205,31.765229];
//              setTimeout(function(){
//                vmapZoom=14;
//                drawAnhui();
//              },500);
//             });
//          });
//        }
    });
 });


var camPics=["/jsp/visualMap/img/vmap/2.png","/jsp/visualMap/img/vmap/3.png"];
//圆圈动画
function cirMove(){
  $(".vMap_con2_data_outCir").addClass("cirOutMove");
  $(".vMap_con2_data_inCir").find("img").show();
  setTimeout(function(){
    $(".vMap_con2_data_inCir").find("img").hide();
    $(".vMap_con2_data_outCir").removeClass("cirOutMove");
  },1900);
  // setTimeout(function(){
  //   $(".vMap_con2_data_outCir").addClass("cirOutMove");
  //   $(".vMap_con2_data_inCir").css("background","url(./img/vmap/in.png)");
  // },50);
  // setTimeout(function(){
  //   $(".vMap_con2_data_inCir").css("background","url(./img/vmap/in.png) 0 -108px");
  // },200);
  // setTimeout(function(){
  //   $(".vMap_con2_data_inCir").css("background","url(./img/vmap/in.png) 0 -214px");
  // },400);
  // setTimeout(function(){
  //   $(".vMap_con2_data_inCir").css("background","url(./img/vmap/in.png) 0 -322px");
  // },600);
  // setTimeout(function(){
  //   $(".vMap_con2_data_inCir").css("background","url(./img/vmap/in.png) 0 -429px");
  // },800);
  // setTimeout(function(){
  //   $(".vMap_con2_data_inCir").css("background","url(./img/vmap/in.png) 0 -322px");
  // },1000);
  // setTimeout(function(){
  //   $(".vMap_con2_data_inCir").css("background","url(./img/vmap/in.png) 0 -214px");
  // },1200);
  // setTimeout(function(){
  //   $(".vMap_con2_data_inCir").css("background","url(./img/vmap/in.png) 0 -108px");
  // },1400);
  // setTimeout(function(){
  //   $(".vMap_con2_data_inCir").css("background","url(./img/vmap/in.png)");
  // },1600);
  // setTimeout(function(){
  //   $(".vMap_con2_data_inCir").css("background","url(./img/vmap/n.png)");
  //   $(".vMap_con2_data_outCir").removeClass("cirOutMove");
  // },1800);
}
//订单信息更新
function orderMove(){
  var moveH=$(".vMap_con2_order li").height();
  $("#vtype").find("li").eq(0).animate({"margin-top":-moveH},1000,function(){
    $(this).css({"margin-top":0}).appendTo($("#vtype").find("ul"));
  });
  $("#vshop").find("li").eq(0).animate({"margin-top":-moveH},1000,function(){
    $(this).css({"margin-top":0}).appendTo($("#vshop").find("ul"));
  });
  $("#vton").find("li").eq(0).animate({"margin-top":-moveH},1000,function(){
    $(this).css({"margin-top":0}).appendTo($("#vton").find("ul"));
  });
  $("#vasset").find("li").eq(0).animate({"margin-top":-moveH},1000,function(){
    $(this).css({"margin-top":0}).appendTo($("#vasset").find("ul"));
    setTimeout(orderMove,1000);
  });
}
/*$.ajax({
 type: "get",
 url: "js/vmapRoll.json",
 dataType : "json",
 success: function(data){
   for(var i=0;i<data.length;i++){
      if(data[i].type=="新订单"){
        var type_li="<li>"+data[i].type+"</li>";
        $("#vtype").find("ul").append(type_li);
      }else{
        var type_li="<li class='vmap_new'>"+data[i].type+"</li>";
        $("#vtype").find("ul").append(type_li);
      }
      $("#vshop").find("ul").append("<li>"+data[i].shop_name+"</li>");
      $("#vton").find("ul").append("<li>"+data[i].ton+"</li>");
      $("#vasset").find("ul").append("<li>"+data[i].price+"</li>");
   }
   orderMove();
   playCam();
  },
  error:function(XMLHttpRequest, textStatus, errorThrown){
      console.log(XMLHttpRequest);
      console.log(textStatus);
      console.log(errorThrown);
  }
 });*/
var camPics1=["/jsp/visualMap/img/vmap/4.png","/jsp/visualMap/img/vmap/5.png","/jsp/visualMap/img/vmap/6.png"];
for(var i=0;i<camPics.length;i++){
  var img="<img width='100%' height='100%' src="+camPics[i]+">";
  $(".vMap_con2_cam1_r").find("li").eq(i).append(img);
}
for(var j=0;j<camPics1.length;j++){
  var img="<img width='100%' height='100%' src="+camPics1[j]+">";
  $(".vMap_con2_cam2").find("li").eq(j).append(img);
}
function checkhHtml5()   
    {   
        if (typeof(Worker) === "undefined")     
        {   
            if(navigator.userAgent.indexOf("MSIE 9.0")<=0)  
       {  
       alert("定制个性地图示例：IE9以下不兼容，推荐使用百度浏览器、chrome、firefox、safari、IE10");   
       }  
            
        }  
    }
 checkhHtml5();  
 
 
 /**
  * 回收员排行数据渲染
  * param 
         a：服务端的数据
  */
 function assginOption5(a){
	 var option5 = {
		      title: {
		          text: '回收员排名',
		          textStyle:{
		            color:["#FFF"],
		            fontSize:18*wScaleRate
		          }
		      },
		      tooltip : {
		          trigger: 'axis',
		          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		          }
		      },
		      legend: {
		          top:25,
		          right:5,
		          align:'left',
		          itemWidth:10,
		          itemHeight:10,
		          itemGap:5,
		          textStyle:{
		            color:["#FFF"],          fontSize:14*wScaleRate
		          },
		          data: [
		            {name:'僵尸',icon: 'square',textStyle: {fontSize: 10}},
		            {name:'沉睡',icon: 'square',textStyle: {fontSize: 10}},
		            {name:'静默',icon: 'square',textStyle: {fontSize: 10}},
		            {name:'交易',icon: 'square',textStyle: {fontSize: 10}},
		            {name:'活跃',icon: 'square',textStyle: {fontSize: 10}} 
		          ]
		      },
		      grid: {
		          left: '3%',
		          right: '4%',
		          bottom: '3%',
		          containLabel: true
		      },
		      xAxis:  {
		          type: 'value',
		          position: 'top',
		          nameTextStyle: {
		              color: '#fff',
		              fontSize: 14*wScaleRate
		          },
		          splitLine: {
		              show: false
		          },
		          axisLine: {
		              lineStyle: {
		                  color: '#eee'
		              }
		          }
		      },
		      yAxis: {
		          type: 'category',
		          nameTextStyle: {
		              color: '#fff',
		              fontSize: 14*wScaleRate
		          },
		          splitLine: {
		              show: false
		          },
		          axisLine: {
		              lineStyle: {
		                  color: '#eee'
		              }
		          },
		          //data: ['李文森','董新廷','杨彪','张伟','张昆明','杨玉洋','范俊朋']
		          data: []
		        },
		      series: [
		          {
		              name: '僵尸',
		              type: 'bar',
		              stack: '地推排名',
		              color: ['#ADB9D3'],
		              barMaxWidth : 10,
//		                label: {
//		                    normal: {
//		                        show: true,
//		                        position: 'insideRight'
//		                    }
//		                },
		              //data: [33, 32, 32, 35, 52, 30, 44]
		              data: []
		            },
		          {
		              name: '沉睡',
		              type: 'bar',
		              stack: '地推排名',
		              color: ['#DA9496'],
		              barMaxWidth : 10,
//		                label: {
//		                    normal: {
//		                        show: true,
//		                        position: 'insideRight'
//		                    }
//		                },
		              //data: [124, 136, 105, 138, 94, 235, 215]
		              data: []
		            },
		          {
		              name: '静默',
		              type: 'bar',
		              stack: '地推排名',
		              color: ['#D7E0C5'],
		              barMaxWidth : 10,
//		                label: {
//		                    normal: {
//		                        show: true,
//		                        position: 'insideRight'
//		                    }
//		                },
		              //data: [230, 192, 201, 244, 301, 340, 320]
		              data: []
		            },
		          {
		              name: '交易',
		              type: 'bar',
		              stack: '地推排名',
		              color: ['#C0B4CC'],
		              barMaxWidth : 10,
//		                label: {
//		                    normal: {
//		                        show: true,
//		                        position: 'insideRight'
//		                    }
//		                },
		              //data: [1170, 1232, 1221, 1174, 1201, 1351, 1432]
		              data: []
		          },
		          {
		              name: '活跃',
		              type: 'bar',
		              stack: '地推排名',
		              color: ['#C2D8E3'],
		              barMaxWidth : 10,
//		                label: {
//		                    normal: {
//		                        show: true,
//		                        position: 'insideRight'
//		                    }
//		                },
		              //data: [818, 837, 908, 926, 1288, 1330, 1324]
		              data: []
		          }
		        ]
		    };
	var chart5 = echarts.init(document.getElementById('chart5'));
    for(var i=0;i<a.length;i++){
        var item = a[i];
        option5.yAxis.data[i]=item.contact;
        //僵尸
        option5.series[0].data[i]=item.cold;
        //沉睡
        option5.series[1].data[i]=item.sleep;
        //静默
        option5.series[2].data[i]=item.silence;
        //交易
        option5.series[3].data[i]=item.payment;
        //活跃
        option5.series[4].data[i]=item.active;
    }
    chart5.setOption(option5);
 }





/**
 * 渲染右边小圆圈里面的数据
 * @param {*
 * } a 
 */
function assginShopInfo(a){
    //新增门店
    $('#todayShop').text(a.todayShop);
    //累计门店
    $('#totalShop').text(a.totalShop);
    //新增订单
    $('#todayOrder').text(a.todayOrder);
    //新订单总额
    $('#orderTotalPrice').text(a.orderTotalPrice);
    //新订单总重
    $('#orderTotalWeight').text(a.orderTotalWeight);
}

/**
 * 左边客户订单的数据
 */
function assginlistCustOrder(data){
    for(var i=0;i<data.length;i++){
        $("#vtype").find("ul").append("<li>"+data[i].type+"</li>")
        $("#vshop").find("ul").append("<li>"+data[i].shopName+"</li>");
        $("#vton").find("ul").append("<li>"+data[i].weight+"</li>");
        $("#vasset").find("ul").append("<li>"+data[i].totalPrice+"</li>");
     }
     orderMove();
     //playCam();
}
//视频播放
function assginlistMedia(a){
    var camVideo=[];//["img/vmap/cam/1.mp4","img/vmap/cam/2.mp4","img/vmap/cam/3.mp4","img/vmap/cam/4.mp4","img/vmap/cam/5.mp4","img/vmap/cam/6.mp4","img/vmap/cam/7.mp4","img/vmap/cam/8.mp4","img/vmap/cam/9.mp4","img/vmap/cam/10.mp4","img/vmap/cam/11.mp4","img/vmap/cam/12.mp4","img/vmap/cam/13.mp4","img/vmap/cam/14.mp4","img/vmap/cam/15.mp4","img/vmap/cam/16.mp4","img/vmap/cam/17.mp4","img/vmap/cam/18.mp4","img/vmap/cam/19.mp4","img/vmap/cam/20.mp4","img/vmap/cam/21.mp4","img/vmap/cam/22.mp4","img/vmap/cam/23.mp4","img/vmap/cam/24.mp4",,"img/vmap/cam/25.mp4","img/vmap/cam/26.mp4","img/vmap/cam/27.mp4","img/vmap/cam/28.mp4","img/vmap/cam/29.mp4"];
    for(item in a){
        camVideo[i]=item.orderImage;
    }
    var camera=document.getElementById("cam");
    camera.width=$(".vMap_con2_cam1_l").width();
    camera.height=$(".vMap_con2_cam1_l").height();
    var camCount=0,camTime=0,camTik=0,camLoad=true,camClockInit=true;
    var playCam=function(){
      if(camLoad==true){
        camLoad=false;
        var cv='<source src='+camVideo[camCount]+' type="video/mp4">'
        $("#cam").empty().append(cv);
        camera.load();
        camera.onloadedmetadata=function(){
          camTime=parseInt(camera.duration);
          camera.play();
          if(camClockInit==true){
            camClockInit=false;
            var camClock=setInterval(function(){
              if(camTik<camTime){
                 camTik++;
              }else{
                 camTik=0;
                 camLoad=true;
                 if(camCount<camVideo.length-1){
                    camCount++;
                 }else{
                    camCount=0;
                 } 
              }
            },1000);
          }
        };
      }
      setTimeout(playCam,500);
    }
}

/**
 * 后端推送
 */
function initWebSocket(){
    var socket = new SockJS('http://localhost:8888/wspb');
    stompClient = Stomp.over(socket);
    var key = getOrgId();
    var url = "/visualMap/getData/"+key;
    stompClient.connect({}, function (frame) {
        stompClient.subscribe(url, function (response) {
        	var json = JSON.parse(response.body);
        	console.log(json);
            //var json=eval('('+response.body+')');
            //最新的客户订单20条
            listCustOrder = json.listCustOrder;
            assginlistCustOrder(listCustOrder);
            /*
            *  新增门店（今日）
            *  累计门店  
            *  新增订单（今日）
            *  新订单总额（今日）
            *  新订单总量（今日，单位t）
            */
            shopInfo=json.shopInfo;
            assginShopInfo(shopInfo);
            
            //视频10条
            listMedia=json.listMedia;
            assginlistMedia(listMedia);

            //门店到仓库的坐标
            wTof=json.wTof;
            
            //仓库到冶炼厂的坐标
            shopToWareh=json.wTof;
        });
    });
}



/**
 * 获取地图的数据
 * param 省份id
 */
function getMapInfo(provinceId){

    var param = {
        "provinceId":provinceId
    };

	//请求地图数据
	$.ajax({
        type:"get",
		url:"/visualMap/getMapInfo",
        dataType:"json",
        data:param,
		success:function (result){
            if(result){
                //仓库的位置信息
                wareHouse=result.wareHouse;
                
                drawWareHouse(wareHouse);
                //冶炼厂
                factories=result.factories;

                //所有的店铺信息（今日有回收，下单的，其他）
                shop=result.shop;
                drawAll(shop);
                //仓库到冶炼厂坐标点
                wTof=result.wTof;
                //门店到仓库的坐标点
                shopToWareh=result.shopToWareh;
            }
		},
		error:function(error){
			
		}
    });
}


});
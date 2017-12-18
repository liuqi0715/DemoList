var app = angular.module("myHome", []);
app.controller("myCtrl", ["$scope","$http",function ($scope,$http) {
 
    var myChartA = echarts.init(document.getElementById('inwentory'));
    optionA = {
        color: ['#A3D4E1'],
        title : {
             text: '点击查看详情',
            // subtext: '纯属虚构'
            textStyle:{ //设置主标题风格
                color:'white',//设置主标题字体颜色
                fontStyle:'',//主标题文字风格
                fontSize:14,
                fontWeight:'normal',
                // cursor: pointer,
                
                },
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            // data:['蒸发量','降水量']
        },
        grid: {         //控制Echarts图的位置
            left: '-8%',
            right: '1%',
            top:"1%",
            bottom: '1%',   //Echarts距离底部的距离--------------
            containLabel: true
        },
        label:{ 
            normal:{ 
            show: true, 
            position: 'top'
                } 
            },
       
        xAxis : [
            {
                type : 'category',
                data : ['体验','僵尸','沉睡','静默','下单','交易','活跃',],
                axisLine:{              //这个属性是改变坐标轴X轴颜色，和字体颜色
                    lineStyle:{
                        color:'white',
                        width:1,//这里是为了突出显示加上的,这里是X轴宽度
                    }
                },
            }
        ],
        yAxis : [
            
            {
                show : false,   //是否显示Y轴
                type : 'value',
                min: 50,
                max: 1000,
                splitNumber:10,			//200

            },

        ],
        series : [
            {
                name:'用户类型',
                type:'bar',
                data:[], //需要对接真实数据---------------------------------------------------------------
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
            {
                type:'bar',
                barWidth : 2,//柱图宽度
            }
   
        ]
    };


    if (optionA && typeof optionA === "object") {
        myChartA.setOption(optionA, true);
    }


//为这个柱状图添加点击方法
myChartA.on('click', function (params) {
    
                     console.log(params,params.name,"点击的-----")
    
                        })


//中间第二部分折线图

var myChartB = echarts.init(document.getElementById('line'));
optionB = {
    title: {
        // text: '折线图堆叠',
        // subtext:"单位：元",
        subtextStyle:{
            color:"white"
        }
    },
    tooltip: {
        trigger: 'axis',
        //formatter: "{a}"
    },
    legend: {
        // data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    toolbox: {
       /*  feature: {
            saveAsImage: {}
        } */
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],           //这里接受X轴的数据--------------------------------------
        
        axisLine:{              //这个属性是改变坐标轴X轴颜色，和字体颜色
                 lineStyle:{
                     color:'white',
                     width:1,//这里是为了突出显示加上的,这里是X轴宽度
                 }
             },
        splitLine: {        //这里设置的是分割线条的颜色
            lineStyle: {
                color: "red"
            }
        },
    },
    yAxis: {
        type: 'value',
        min: "",
        max: "",
        splitNumber:"",			//200
        axisLine:{              //这个属性是改变坐标轴X轴颜色，和字体颜色
            lineStyle:{
                color:'white',
                width:1,//这里是为了突出显示加上的,这里是X轴宽度
            }
        },
        splitLine: {        //这里设置的是分割线条的颜色
            lineStyle: {
                color: "#6A8888"
            }
        },
    },
    series: [
      
        {
            name:'订单量',
            type:'line',
            // stack: '总量',     不注释掉会显示为所有的加和
            itemStyle:{     //这里是为了改变折线线条颜色
                normal:{
                    lineStyle:{
                        color:"#9BBB59"
                    }
                }
            },
            data:[]
        },

        {
            name:'下单量',
            type:'line',
            itemStyle:{     //这里是为了改变线条颜色
                normal:{
                    lineStyle:{
                        color:"#4BACC6"
                    }
                }
            },
            // stack: '总量',
            data:[]
        },

    ]
};
if (optionB && typeof optionB === "object") {
    myChartB.setOption(optionB, true);
}

//顶部第四个饼图
var myChartPie = echarts.init(document.getElementById('onePie'));
var myChartPie2 = echarts.init(document.getElementById('twoPie'));
app.title = '嵌套环形图';

optionPie = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    textStyle: {
        fontSize: '16',
        fontWeight: 'normal',
        color:'#AFC879'
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['','']
    },
     color:['#FDEADA', 'white'],
    series: [
        {
            name:'下单率',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '80%'],
            startAngle:50,  //设置开始角度，偏移量
            selectedOffset:15,//设置偏移角度
            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:"10%", selected:true},
              
                {value:1548, name:'下单率'}
            ]
        },
  
    ]
};

optionPie2 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    textStyle: {
        fontSize: '16',
        fontWeight: 'normal',
        color:'#AFC879'
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['','']
    },
     color:['#FDEADA', 'white'],
    series: [
        {
            name:'取消率',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '80%'],
            startAngle:50,  //设置开始角度，偏移量
            selectedOffset:15,//设置偏移角度
            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'10%', selected:true},
              
                {value:1548, name:'取消率'}
            ]
        },
  
    ]
};

if (optionPie && typeof optionPie === "object") {
    myChartPie.setOption(optionPie, true);
}
if (optionPie2 && typeof optionPie2 === "object") {
    myChartPie2.setOption(optionPie2, true);
}




var pOrder = [];    //订单量
var orderNum = [];  //下单量
var orderDate = []; //订单日期

$scope.getTopDate = function(){
    $.ajax({
        type: "post",
        url: "/analysis/getStoresOrderAnalysis",	        
        data: {
            "areaId":"",
            "Start":"",
            "end":"",
        },
        dataType : "json",
        success : function(data){  
            console.log("data--------------",data);
           $scope.tradingStatistics = data.tradingStatistics; //下单数

           optionPie.series[0].data[0].name = data.tradingStatistics.orderRate;//下单率
            var a = parseFloat(data.tradingStatistics.orderRate)/10
            //console.log(a)
           optionPie.series[0].data[0].value = 335*a;

           optionPie2.series[0].data[0].name = data.tradingStatistics.cancellationRate;//取消率
            var b = parseFloat(data.tradingStatistics.cancellationRate)/10
           optionPie2.series[0].data[0].value = 335*b;

          // console.log(optionPie.series[0].data[0].value,"----");
           
           for(var i=0;i<data.orderQuantityStatistics.oList.length;i++){
           
            optionB.xAxis.data.push(data.orderQuantityStatistics.oList[i].orderDate);
            optionB.series[0].data.push(data.orderQuantityStatistics.oList[i].orderNumber);
            optionB.series[1].data.push(data.orderQuantityStatistics.oList[i].custodNu);

            
           
           }
        //    optionB.yAxis.min = data.orderQuantityStatistics.min-(data.orderQuantityStatistics.min%200);
        //    optionB.yAxis.max = data.orderQuantityStatistics.max+(200-(data.orderQuantityStatistics.max%200));
        //    optionB.yAxis.splitNumber = Math.ceil((data.orderQuantityStatistics.max-data.orderQuantityStatistics.min)/200);


           optionB.yAxis.min = data.orderQuantityStatistics.min;
           optionB.yAxis.max = data.orderQuantityStatistics.max;
           optionB.yAxis.splitNumber = Math.ceil((data.orderQuantityStatistics.max-data.orderQuantityStatistics.min)/5);
           console.log( optionB.yAxis.min,optionB.yAxis.max,optionB.yAxis.splitNumber,"--------???");
           for( var i= 0; i<data.storeTag.length;i++){
            optionA.series[0].data.push(data.storeTag[i].custNumber);
           }
           // console.log(orderDate,"aaaaa");
       
          // console.log(optionB.series[0],optionB.series[1],"eeee")
           myChartA.setOption(optionA);
           myChartB.setOption(optionB);
           myChartPie.setOption(optionPie);
           myChartPie2.setOption(optionPie2);
           $scope.$apply();
        },
        error:function(error){
            console.log(error);
        }
     });
}
$scope.getTopDate();

//中间表格部分----------------------
var pageNumber = 0;//第几页
$scope.nowPage = 1;
$scope.getTableDate=function(){
    pageNumber++
    $.ajax({
        type: "post",
        url: "/analysis/custTradStatistics",	        
        data: {
            "areaId":"",
            "Start" :"",
            "end" :"",
            "pageSize":"11",
            "pageNumber":pageNumber
        },
        dataType : "json",
        success : function(data){  
           // console.log("data--------------",data);
            $scope.custTradStatistics = data.rows;
            $scope.totalPage = Math.ceil(data.total/data.pageSize);    //总页数
            $scope.$apply();
        },
        error:function(error){
            console.log(error);
        }
     });
}
$scope.getTableDate();
//对中间表格进行操作,点击时候出现下面的数据----------------------;
var custId ;
$scope.check = function(i){
    console.log(i,"当前点击的数据信息------------");
    custId = i.custId;
    $.ajax({
        type: "post",
        url: "/analysis/getOrderByCust",
        
        data: {
            "custId":i.custId,
            "start" :"",
            "end" :"",
            "pageSize":8,
            "pageNumber":"1"
            },
        dataType : "json",
        success: function(data){  

          //  console.log(data,"data--------------------");
            $scope.orderInfos = data.rows;
            $scope.totalNum = Math.ceil(data.total/data.pageSize);//总页数

            $scope.$apply();
        },
        error:function(info){
            console.log(info);
        }
     });
}
//下一页;
$scope.next = function(){
    if($scope.nowPage>=$scope.totalPage){
        console.log("没有数据了");
        
    }else if($scope.totalPage==1){
        console.log("没有数据了-----")
    }else{
        $scope.nowPage++;
        pageNumber++;
        $scope.totalPage--;
        $.ajax({
            type: "post",
            url: "/analysis/custTradStatistics",	        
            data: {
                "areaId":"",
                "Start" :"",
                "end" :"",
                "pageSize":"11",
                "pageNumber":pageNumber
            },
            dataType : "json",
            success : function(data){  
              //  console.log("data--------------",data);
                $scope.custTradStatistics = data.rows; 
    
                $scope.$apply();
            },
            error:function(error){
                console.log(error);
            }
         });
    }
  
};
//底部的表格分页2
$scope.nowPage2 = 1;
var pageNumber2 = 1;//第几页

$scope.next2 = function(){
    console.log(custId,"接收传过来点击的ID");
    if($scope.nowPage2>=$scope.totalNum){
        console.log("没有数据了---");
        
    }else if($scope.totalNum==1){
        console.log("就只有一页数据-----")
    }else{
        $scope.nowPage2++;
        pageNumber2++;
        $scope.totalNum--;
        $.ajax({
            type: "post",
            url: "/analysis/getOrderByCust",
            
            data: {
                "custId":custId,
                "start" :"",
                "end" :"",
                "pageSize":8,
                "pageNumber":pageNumber2
                },
            dataType : "json",
            success: function(data){  
    
               // console.log(data,"data--------------------");
                $scope.orderInfos = data.rows;    
                $scope.$apply();
            },
            error:function(info){
                console.log(info);
            }
         });
    }
}
//分页1上一页------------
$scope.prev = function(){
    $scope.nowPage--;
    if($scope.nowPage<1){
        console.log("没有数据了");
        $scope.nowPage = 1;
    }else{
        
        pageNumber--;
        $scope.totalPage++;
        $.ajax({
            type: "post",
            url: "/analysis/custTradStatistics",	        
            data: {
                "areaId":"",
                "Start" :"",
                "end" :"",
                "pageSize":"11",
                "pageNumber":pageNumber
            },
            dataType : "json",
            success : function(data){  
              //  console.log("data--------------",data);
                $scope.custTradStatistics = data.rows; 
    
                $scope.$apply();
            },
            error:function(error){
                console.log(error);
            }
         });
    }
        
    
}
$scope.prev2 = function(){
    $scope.nowPage2--;
    if($scope.nowPage2<1){
        console.log("没有数据了");
        $scope.nowPage2 = 1;
    }else{
        console.log(pageNumber2,$scope.totalNum)
        pageNumber2--;
        $scope.totalNum++;
        $.ajax({
            type: "post",
            url: "/analysis/getOrderByCust",	        
            data: {
                "custId":custId,
                "Start" :"",
                "end" :"",
                "pageSize":"8",
                "pageNumber":pageNumber2
            },
            dataType : "json",
            success : function(data){  
              //  console.log(data,"data--------------------");
                $scope.orderInfos = data.rows;    
                $scope.$apply();
            },
            error:function(error){
                console.log(error);
            }
         });
    }
        
    
}

}]);



var app = angular.module("myHome", []);
app.controller("myCtrl", function ($scope,$http) {
    
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
                data:[100, 150, 170, 232, 256, 767, 136], //需要对接真实数据---------------------------------------------------------------
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
        data: [1,2,3,4,5,4,6,7,8,9,8,9,10,11,12,13,46,47,46,17,18,19,13,46,49,5,6,54,46,48,46],           //这里接受X轴的数据--------------------------------------
        
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
        min: 0,
        max: 90,
        splitNumber:10,			//200
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
            name:'平均价格',
            type:'line',
            // stack: '总量',
            data:[50, 52,63, 65, 67, 51, 41, 24, 57, 68, 46, 69, 59, 44, 66, 54, 69, 63,91, 42, 69, 58, 41, 53, 59, 53, 61, 69, 59, 60, 95, 54, 69,58,55,53,68,69,59,57],			//接受数据++++++++++++++++++++++++
            itemStyle : {

                normal : {
                    color:"white",
                    lineStyle:{
                        color:'#4F81BD'
                    }
                }
            }
        },
        {
            name:'下单量趋势',
            type:'line',
            // stack: '总量',     不注释掉会显示为所有的加和
            itemStyle:{     //这里是为了改变折线线条颜色
                normal:{
                    lineStyle:{
                        color:"#9BBB59"
                    }
                }
            },
            data:[50, 52,63, 65, 67, 51, 41, 24, 57, 68, 46, 69, 59, 94, 66, 54, 69, 63,91, 42, 69, 58, 81, 53, 59, 53, 61, 69, 59, 60, 95, 54, 69,58,55,53,68,69,59,57]
        },

        {
            name:'推广量趋势',
            type:'line',
            itemStyle:{     //这里是为了改变线条颜色
                normal:{
                    lineStyle:{
                        color:"#4BACC6"
                    }
                }
            },
            // stack: '总量',
            data:[20, 15, 10,  12, 11,20, 32, 15, 24, 30, 20, 22, 34, 19, 14, 20, 34, 20, 32, 21, 34, 26, 27, 24, 26, 17, 28, 10, 19, 29, 24, 29, 34, 20, 32, 31, 34, 26, 27, 24]
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
        data:['直达','营销广告']
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
                {value:335*0.5, name:'10%', selected:true},
              
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
        data:['直达','营销广告']
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
                {value:335*0.5, name:'10%', selected:true},
              
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
});


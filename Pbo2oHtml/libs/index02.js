var app = angular.module("myHome", []);
app.controller("myCtrl", function ($scope,$http) {
    
    var myChartE = echarts.init(document.getElementById('express'));
    
    
          var  optionE = {
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                label:{ 
                    normal:{ 
                    show: true, 
                    position: 'top'
                    } 
                },
                grid: {
                    // left: '3%',
                    // right: '4%',
                    // bottom: '10%',
                    // top:"3%",
                    left: '2%',
                    right: '1%',
                    top:"4%",
                    bottom: '1%',   //Echarts距离底部的距离--------------
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['一天内', '两天内', '三天内', '逾一天', '逾二天', '逾三天', '以上'],
                        axisTick: {
                            alignWithLabel: true
                        },
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
                        type : 'value',
                        axisLine:{              //这个属性是改变坐标轴X轴颜色，和字体颜色
                            lineStyle:{
                                color:'white',
                                width:1,//这里是为了突出显示加上的,这里是X轴宽度
                            }
                        },
                    }
                ],
                series : [
                    {
                        name:'直接访问',
                        type:'bar',
                        barWidth: '60%',
                        data:[10, 52, 200, 134, 190, 130, 220],
                        itemStyle:{             //改变柱子的颜色
                            normal:{
                                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                color: function (params){
                                    var colorList = ['#9BBB59','#9BBB59','#9BBB59','#C0504D'];
                                    return colorList[params.dataIndex];
                                }
                            },
    
                        }
    
    
                    },
    
                ]
            };
    
    
    
            if (optionE && typeof optionE === "object") {
                myChartE.setOption(optionE, true);
            }
    //顶部第四个方块第二个图
    var myChartA = echarts.init(document.getElementById('inwentory02'));
    optionA = {
        color: ['#2fa2b7'],
        title : {
            //  text: '点击查看详情',
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
            left: '2%',
            right: '1%',
            top:"4%",
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
                data : ['体验','僵尸','沉睡','静默','交易','活跃',],
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
                show : true,   //是否显示Y轴
                type : 'value',
                min: 50,
                max: 1000,
                splitNumber:10,			//200
                axisLine:{              //这个属性是改变坐标轴X轴颜色，和字体颜色
                    lineStyle:{
                        color:'white',
                        width:1,//这里是为了突出显示加上的,这里是X轴宽度
                    }
                },

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
                barWidth : 1,//柱图宽度
            }
            // {
            //     name:'降水量',
            //     type:'bar',
            //     data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
            //     markPoint : {
            //         data : [
            //             {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
            //             {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
            //         ]
            //     },
            //     markLine : {
            //         data : [
            //             {type : 'average', name : '平均值'}
            //         ]
            //     }
            // }
        ]
    };


    if (optionA && typeof optionA === "object") {
        myChartA.setOption(optionA, true);
    }
    //中间部分两个一样的图------------------------------------------------------


    var myChartSame = echarts.init(document.getElementById('barOne'));

    app.title = '坐标轴刻度与标签对齐';
    
    optionSame = {
        color: ['#54A1B3'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top:"12%",
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ['15', '14', '13', '12', '11', '10', '9','8','7','6','5','4','3','2','1'],
                axisTick: {
                    alignWithLabel: true
                },
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
                type : 'value',
                position:'right',
                 axisLine:{              //这个属性是改变坐标轴X轴颜色，和字体颜色
                        lineStyle:{
                            color:'white',
                            width:1,//这里是为了突出显示加上的,这里是X轴宽度
                        }
                    },
            }
        ],
        series : [
            {
                name:'直接访问',
                type:'bar',
                barWidth: '60%',
                data:[10, 52, 200, 334, 390, 330, 220,'150','160',10, 52, 200,10, 52, 200,]
            }
        ]
    };
    
    if (optionSame && typeof optionSame === "object") {
        myChartSame.setOption(optionSame, true);
    }

    //两个柱状图的一个
    
    var myChartSame02 = echarts.init(document.getElementById('barTwo'));
    
        app.title = '坐标轴刻度与标签对齐';
        
        optionSame02 = {
            color: ['#54A1B3'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:"12%",
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data :  ['15', '14', '13', '12', '11', '10', '9','8','7','6','5','4','3','2','1'],
                    axisTick: {
                        alignWithLabel: true
                    },
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
                    type : 'value',
                    position:'right',
                     axisLine:{              //这个属性是改变坐标轴X轴颜色，和字体颜色
                            lineStyle:{
                                color:'white',
                                width:1,//这里是为了突出显示加上的,这里是X轴宽度
                            }
                        },
                }
            ],
            series : [
                {
                    name:'直接访问',
                    type:'bar',
                    barWidth: '60%',
                    data:[10, 52, 200, 334, 390, 330, 220,'150','160',10, 52, 200,10, 52, 200,]
                }
            ]
        };
        
        if (optionSame02 && typeof optionSame02 === "object") {
            myChartSame02.setOption(optionSame02, true);
        }  

})
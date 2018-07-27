
angular.module("myAppD",[])
    .controller("myCtrD",["$scope","$http","$filter",function($scope,$http,$filter) {
        var today = new Date();
        $scope.date = $filter('date')(today, 'yyyy-MM-dd');  //日期控件被调用后赋值开始结束日期---------

         var wh =  window.innerHeight
        $("#r-result").css({"height":wh-65+"px"})
        var chartData = [];
        //JS逻辑部分-----------------------------------------------------


        var map = new BMap.Map("r-result");
        map.enableScrollWheelZoom(true);
        map.centerAndZoom(new BMap.Point(118.112917, 24.435153), 20);

        var myIcon = new BMap.Icon("images/dingwei.png",new BMap.Size(33, 41), {
            anchor: new BMap.Size(5, 10),		//图标的定位点相对于图标左上角的偏移值。
            imageSize:new BMap.Size(10, 10)		//图标的大小
        });
        /**
         * 仓库图标
         * @type {BMap.Icon}
         */
        var wsIcon = new BMap.Icon("images/cangku.png", new BMap.Size(100,157),{
            anchor: new BMap.Size(10, 22),		//图标的定位点相对于图标左上角的偏移值。
            imageSize:new BMap.Size(30, 30)		//图标的大小
        });
        var iconS = new BMap.Icon("images/qi.png", new BMap.Size(33,41),
            {
                anchor: new BMap.Size(10, 22),		//图标的定位点相对于图标左上角的偏移值。
                imageSize:new BMap.Size(30, 30)		//图标的大小
            })
        // http://lbsyun.baidu.com/jsdemo/img/fox.gif
        var iconE = new BMap.Icon("images/end.png", new BMap.Size(303,141),
            {
                anchor: new BMap.Size(10, 22),		//图标的定位点相对于图标左上角的偏移值。
                imageSize:new BMap.Size(30, 30)		//图标的大小
            })


        var paramslist=[]       //存储每次查询的参数，判断是否重复查询
        var cLt=-1;    //查询次数


        var colorList=["green","red","black","yellow","blue"]

        function ShowRoute(a,b,c) {

            if (paramslist.indexOf(c.recycleID+c.day)!=-1){
                alert("已查询过此数据！")
                console.log(paramslist,"paramslist")
            }else {
                $.ajax({
                    type: "post",
                    url: "http://192.168.0.56:6888/OrderInfo/getRecycleTrail",
                    // url: "http://xdll.buypb.cn/OrderInfo/getRecycleTrail",

                    data:JSON.stringify(c),
                    dataType : "json",
                    contentType: "application/json",
                    success: function(userInfo){

                        var chartData=[];
                        var startLine=[];
                        var endLine=[];
                        var abc=[];
                        var start =[];
                        var end = [];//终点
                        var allList = [];
                        if (userInfo.errorinfo==null){

                            // console.log(userInfo.data)
                            // if($scope.hasSave==true){
                            //     if (userInfo.data.trailList.length>0){
                            //         if (trailList.indexOf(c.recycleID+c.day)==-1){
                            //             trailList[c.recycleID+c.day]=userInfo.data.trailList
                            //             console.log("trailList",trailList)
                            //         }else {
                            //             trailList = trailList;
                            //             console.log("trailList已存在的：",trailList)
                            //         }
                            //         for(i in trailList){
                            //             // if (trailList[i].length>0){
                            //             //     for (var j=0;j<trailList[i].length;j++){
                            //             //         // console.log(trailList[i][j],"其中的每一项")
                            //             //
                            //             //     }
                            //             // }
                            //
                            //             /**
                            //              * 将所有数据的第一个点作为中心点，便于观察
                            //              */
                            //             map.centerAndZoom(new BMap.Point(trailList[i][0].longitude, trailList[i][0].latitude), 18);
                            //
                            //                 /**
                            //                  *描绘出起点
                            //                  */
                            //                 start = trailList[i][1];
                            //                 var firstP = new BMap.Point(start[0].longitude, start[0].latitude);
                            //                 var startP = new BMap.Marker(firstP,{icon:iconI});
                            //                 startLine.push(new BMap.Point(start[0].longitude, start[0].latitude));
                            //                 map.addOverlay(startP);
                            //
                            //         }
                            //     }else {
                            //         console.log("此回收员当前条件没有数据");
                            //         console.log("trailList已存在的：",trailList)
                            //     }
                            //
                            //
                            //
                            //
                            // }else {
                            //
                            // }
                            if (userInfo.data.trailList.length>0){
                                paramslist.push(c.recycleID+c.day)
                                if ($scope.hasSave == true){
                                    if(cLt>5){
                                        cLt=0
                                    }else {
                                        cLt++
                                    }

                                }
                                allList = userInfo.data.trailList;

                                abc = (userInfo.data.trailList).slice(1,userInfo.data.trailList.length-2);
                                /**
                                 * 计算两点之间的距离
                                 * 这里只计算中间值的距离，起点和终点不再计算范围内，因此使用abc
                                 * 计算思路：
                                 * @type {Array}
                                 */
                                var testLen=[]
                                var newPoint=[]
                                for (var i=0;i<abc.length;i++){
                                    testLen.push(new BMap.Point(allList[i].longitude, allList[i].latitude))
                                }
                                for (var i=0;i<testLen.length-1;i=i+2){
                                    var p1 = new BMap.Point(testLen[i].lng,testLen[i].lat);
                                    var p2 = new BMap.Point(testLen[i+1].lng,testLen[i+1].lat);
                                    var DISTANCE = map.getDistance(p1,p2).toFixed(2)
                                    if (DISTANCE<100){
                                        newPoint.push(p1)
                                    }else{
                                        newPoint.push(p1,p2)
                                    }
                                }
                                console.log(newPoint,"p1p1p1")
                                /**
                                 *描绘出起点
                                 */
                                start.push((userInfo.data.trailList[0]));
                                console.log(start)
                                for (var i=0;i<start.length;i++){
                                    var firstP = new BMap.Point(start[i].longitude, start[i].latitude);
                                    var startP = new BMap.Marker(firstP,{icon:iconS});
                                    startLine.push(new BMap.Point(start[i].longitude, start[i].latitude));
                                    map.addOverlay(startP);
                                }

                                /**
                                 * 描绘终点
                                 */
                                end.push(userInfo.data.trailList[userInfo.data.trailList.length-1]);
                                for (var i=0;i<end.length;i++ ){
                                    var lastP = new BMap.Point(end[i].longitude, end[i].latitude);
                                    var endP = new BMap.Marker(lastP,{icon:iconE});
                                    endLine.push(new BMap.Point(end[i].longitude, end[i].latitude));
                                    map.addOverlay(endP);
                                }
                                console.log(end,"end")


                                //重新定义中心点坐标
                                map.centerAndZoom(new BMap.Point(abc[Math.ceil((abc.length)/2)].longitude, abc[Math.ceil((abc.length)/2)].latitude), 15);

                                /**
                                 * 这里对abc进行重定义，拿出适合百度地图的经纬度对象
                                 * newPoint已经进行过处理这里不需要在写  chartData == newPoint;
                                 */

                                startLine.push(newPoint[0]);
                                endLine.push(newPoint[newPoint.length-1]);

                                /**
                                 * 这里终点各点的线就出来了  new Bmap.Polyline
                                 */
                                var polyline = new BMap.Polyline(newPoint,{ strokeColor: colorList[cLt], strokeWeight: 2, strokeOpacity: 0.5 })
                                map.addOverlay(polyline);

                                /**
                                 * 描绘起点间终点间的线;
                                 * 即：起点和abc第一个点，终点和abc的最后一个点之间的线
                                 */
                                var startpolyline = new BMap.Polyline(startLine,{ strokeColor: colorList[cLt], strokeWeight: 2, strokeOpacity: 0.5 })
                                map.addOverlay(startpolyline);
                                var endpolyline = new BMap.Polyline(endLine,{ strokeColor: colorList[cLt], strokeWeight: 2, strokeOpacity: 0.5 })
                                map.addOverlay(endpolyline);

                                /**
                                 * 这里对重定义的点进行描绘，for循环他娘的每次只拿到最后一个点，因此使用$.each
                                 * 但是重定义的点没有保留time，好气哦
                                 */
                                $.each(newPoint,function (i,v) {
                                    var firstPoint = v
                                    var m1 = new BMap.Marker(firstPoint,{icon:myIcon});

                                    map.addOverlay(m1);
                                })


                                // $.each(allList, function (item, value) {
                                //     var firstPoint = new BMap.Point(value.longitude, value.latitude);
                                //     var m1 = new BMap.Marker(firstPoint,{icon:myIcon});
                                //
                                //     var content= "<span style='font-size: 10px;color: red'>"+ value.time+"</span>";
                                //     map.addOverlay(m1);
                                //     addClickHandler(content,m1);
                                //
                                // });

                            }else {
                                console.log("此回收员暂无数据");
                                alert("此回收员当前条件下暂无数据")
                            }
                            if(userInfo.data.wsList.length>0){
                                for (var i=0;i<userInfo.data.wsList.length;i++){
                                    var wspoint = new BMap.Point(userInfo.data.wsList[i].longitude,userInfo.data.wsList[i].latitude);
                                    var wsmarker = new BMap.Marker(wspoint,{icon:wsIcon});
                                    map.addOverlay(wsmarker);
                                }

                            }else {
                                alert("暂无仓库数据。")

                            }


                        }else {
                            console.log(userInfo.errorinfo.errormessage);
                            alert(userInfo.errorinfo.errormessage)
                        }


                    },
                    error:function(error){
                        console.log(error);
                        alert("服务器异常！")
                    }
                });
            }

        }

        var opts={
            width:0,
            height:0,
            title:"??"
        }
        function addClickHandler(content,marker){
            marker.addEventListener("mouseover",function(e){
                // console.log(e.target,abc)
                marker.setLabel(new BMap.Label(content,{offset:new BMap.Size(-40,-35)}))
                var label = this.getLabel()
                label.setStyle({
                    border:"1px solid red",
                    borderRadius: "2px",
                    // width: auto,
                    height: "30px",
                    lineHeight:"30px",
                    textAlign:"center",
                    color:"red",
                    padding:"0 2px 0 2px",
                    "display":"block"

                });//设置标签边框宽度为0

            });
            marker.addEventListener("mouseout",function(e){
                var label = this.getLabel()
                label.setContent("");//设置标签内容为空
                label.setStyle({borderWidth:"0px",
                    "display":"none"
                });//设置标签边框宽度为0

            });

        }

        function openInfo(content,e){
            var p = e.target;
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
            map.openInfoWindow(infoWindow,point); //开启信息窗口
        }
        function closeInfo(content,e){
            var p = e.target;
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
            map.closeInfoWindow(infoWindow,point); //开启信息窗口
        }

        function showPath(startPoint, EndPoint)
        {
                console.log(startPoint,EndPoint)
            // WalkingRoute DrivingRoute
            var walking = new BMap.WalkingRoute(maps, { renderOptions: { maps: maps, autoViewport: true } });
            walking.search(startPoint, EndPoint);

            walking.setSearchCompleteCallback(function (rs) {
                 abc = rs;
                var pts = walking.getResults().getPlan(0).getRoute(0).getPath();
                maps.addOverlay(new BMap.Polyline(pts, { strokeColor: "green", strokeWeight: 5, strokeOpacity: 1 }));
            });
        }
        $scope.recyleData=[]
        $scope.recyleId=[];//绑定点击的回收员

        function getRecyeData() {
                $.ajax({
                    type: "post",
                    // url: "http://xdll.buypb.cn/recyclesDataAnalysis/getBuyMoblie",
                    url:"http://192.168.0.156/recyclesDataAnalysis/getBuyMoblie",
                    dataType : "json",
                    data:{},
                    success: function(resp){
                        // console.log(resp.data);
                        $scope.recyleData = resp.data;
                        $scope.$apply();
                    },
                    error:function () {
                        alert("服务器异常");
                    }
                })
            }
        getRecyeData();
        $scope.touchPro = function () {

            if ($scope.recyleId.id==undefined){
                console.log("没有找到id")
            }else if($scope.recyleId.id==null){
                console.log("id为空")
            }else {
                // console.log($scope.recyleId.id);//拿到当前点击的回收员id

                getdata.recycleID = $scope.recyleId.id
            }


        }
        /**
         * 获取查询时间
         */
        laydate.render({
            elem: '#time',
            format:"yyyy-MM-dd",
            done:function (value) {
                // console.log(value)
                getdata.day = value;
            }
        });
        /**
         * 保留数据
         */
        $scope.hasSave = false;
        $scope.saveData = function () {
            $scope.hasSave =  !$scope.hasSave;
            if($scope.hasSave==false){
                console.log("====false")

            }else if ($scope.hasSave==true){
                console.log("====true")

            }
        }
        /**
         * 查询数据
         */
        var  getdata={
            recycleID:$scope.recyleId.id,
            day:$scope.date
        }
        $scope.search = function () {
            // console.log(getdata)
            if($scope.hasSave==false){
                map.clearOverlays();
                abc=[];
                start =[];
                end = [];//终点
                allList=[];       //存放多次查询的数据
                cLt=-1;    //查询次数
                chartData=[];
                startLine=[];
                endLine=[];
                paramslist=[]
                console.log("清除覆盖物")


            }else {
                // console.log("保留了数据")
            }
            if($scope.recyleId.id==undefined){
                alert("请选择回收员")
            }else if ($scope.recyleId.id==null){
                alert("请选择回收员")
            }else {

                ShowRoute($scope.recyleId.id,$scope.date,getdata)

            }

        }
        $scope.delect = function () {
             map.clearOverlays();
             abc=[];
             start =[];
             end = [];//终点
             allList=[];       //存放多次查询的数据
             cLt=-1;    //查询次数
             chartData=[];
             startLine=[];
             endLine=[];
        }
    }])


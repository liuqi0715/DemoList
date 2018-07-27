
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
        var orderIcon = new BMap.Icon("images/order.png",new BMap.Size(30, 30),{
            anchor: new BMap.Size(15, 25),		//图标的定位点相对于图标左上角的偏移值。
            imageSize:new BMap.Size(30, 30)		//图标的大小
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
                anchor: new BMap.Size(15, 15),		//图标的定位点相对于图标左上角的偏移值。
                imageSize:new BMap.Size(30, 30)		//图标的大小
            })
        // http://lbsyun.baidu.com/jsdemo/img/fox.gif
        var iconE = new BMap.Icon("images/end.png", new BMap.Size(303,141),
            {
                anchor: new BMap.Size(15, 15),		//图标的定位点相对于图标左上角的偏移值。
                imageSize:new BMap.Size(30, 30)		//图标的大小
            })


        var paramslist=[]       //存储每次查询的参数，判断是否重复查询
        var cLt=-1;    //查询次数

        $scope.info="这是一个错误信息"
        $scope.hasWrong = false;
        $scope.know = function () {
            $scope.hasWrong = false;
        }
        var colorList=["green","red","black","yellow","blue"]

        function ShowRoute(a,b,c) {

            if (paramslist.indexOf(c.recycleID+c.day)!=-1){
                // alert("已查询过此数据！")
                $scope.info="数据量较大时请勿重复查询"
                $scope.hasWrong = true;
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
                            paramslist.push(c.recycleID+c.day)
                            if ($scope.hasSave == true){
                                if(cLt>5){
                                    cLt=0
                                }else {
                                    cLt++
                                }

                            }
                            if(userInfo.data.trailList.length==0){
                                console.log("此回收员暂无数据");
                                // alert("此回收员当前条件下暂无数据")
                                $scope.info="此回收员当前条件下暂无数据"
                                $scope.hasWrong = true;
                                $scope.$apply();

                            }else  if (0<userInfo.data.trailList.length<3){

                                abc = userInfo.data.trailList;
                                start.push((userInfo.data.trailList[0]));
                                console.log(start)
                                for (var i=0;i<start.length;i++){
                                    console.log(start[i])

                                    var firstP = new BMap.Point(start[i].longitude, start[i].latitude);
                                    var startP = new BMap.Marker(firstP,{icon:iconS});
                                    map.addOverlay(startP);
                                    startP.setAnimation(BMAP_ANIMATION_BOUNCE)
                                }
                                /**
                                 * 描绘终点
                                 */
                                end.push(userInfo.data.trailList[userInfo.data.trailList.length-1]);
                                for (var i=0;i<end.length;i++ ){
                                    var lastP = new BMap.Point(end[i].longitude, end[i].latitude);
                                    var endP = new BMap.Marker(lastP,{icon:iconE});
                                    map.addOverlay(endP);
                                    endP.setAnimation(BMAP_ANIMATION_BOUNCE)
                                    map.centerAndZoom(lastP, 15);
                                }

                                $.each(userInfo.data.trailList, function (item, value) {
                                    var firstPoint = new BMap.Point(value.longitude, value.latitude);
                                    if(value.orderNo==null){
                                        var m1 = new BMap.Marker(firstPoint,{icon:myIcon});
                                    }else {
                                        var m1 = new BMap.Marker(firstPoint,{icon:orderIcon});

                                    }
                                    if (value.orderNo==null){
                                        var content= "<span style='font-size: 10px;color: red'>"+ value.time+"</span>";
                                    }else {
                                        var content= "<span style='font-size: 10px;color: red'>"+ value.time+"订单号:"+value.orderNo+"</span>";
                                    }

                                    map.addOverlay(m1);
                                    addClickHandler(content,m1);
                                });
                                $.each(abc, function (item, value) {
                                    chartData.push(new BMap.Point(value.longitude, value.latitude));
                                })
                                // 描绘中间线
                                var polyline = new BMap.Polyline(chartData,{ strokeColor: colorList[cLt], strokeWeight: 2, strokeOpacity: 0.5 })
                                map.addOverlay(polyline);

                                map.addOverlay(polyline);
                            }else if (userInfo.data.trailList.length>2){

                                allList = userInfo.data.trailList;

                                abc = (userInfo.data.trailList)
                                /**
                                 * 计算亮点之间的距离
                                 * @type {Array}
                                 */
                                // var testLen=[]
                                // var newPoint=[]
                                // for (var i=0;i<allList.length;i++){
                                //     testLen.push(new BMap.Point(allList[i].longitude, allList[i].latitude))
                                // }
                                // for (var i=0;i<testLen.length-1;i=i+2){
                                //     var p1 = new BMap.Point(testLen[i].lng,testLen[i].lat);
                                //     var p2 = new BMap.Point(testLen[i+1].lng,testLen[i+1].lat);
                                //     var DISTANCE = map.getDistance(p1,p2).toFixed(2)
                                //     if (DISTANCE<100){
                                //         newPoint.push(p1)
                                //     }else{
                                //         newPoint.push(p1,p2)
                                //     }
                                // }



                                /**
                                 *描绘出起点
                                 */

                                start.push((userInfo.data.trailList[0]));
                                console.log(start,"start")
                                for (var i=0;i<start.length;i++){
                                    var firstP = new BMap.Point(start[i].longitude, start[i].latitude);
                                    var startP = new BMap.Marker(firstP,{icon:iconS});
                                    map.addOverlay(startP);
                                    startP.setAnimation(BMAP_ANIMATION_BOUNCE)
                                }
                                /**
                                 * 描绘终点
                                 */
                                end.push(userInfo.data.trailList[userInfo.data.trailList.length-1]);
                                for (var i=0;i<end.length;i++ ){
                                    var lastP = new BMap.Point(end[i].longitude, end[i].latitude);
                                    var endP = new BMap.Marker(lastP,{icon:iconE});
                                    map.addOverlay(endP);
                                    endP.setAnimation(BMAP_ANIMATION_BOUNCE)
                                }
                                console.log(end,"end")
                                //重新定义中心点坐标
                                map.centerAndZoom(new BMap.Point(end[0].longitude, end[0].latitude), 15);
                                $.each(abc, function (item, value) {
                                    chartData.push(new BMap.Point(value.longitude, value.latitude));
                                })
                                // 描绘中间线
                                var polyline = new BMap.Polyline(chartData,{ strokeColor: colorList[cLt], strokeWeight: 2, strokeOpacity: 0.5 })
                                map.addOverlay(polyline);
                                /**
                                 * 描绘起点间的线
                                 */
                                // var startpolyline = new BMap.Polyline(startLine,{ strokeColor: colorList[cLt], strokeWeight: 2, strokeOpacity: 0.5 })
                                // map.addOverlay(startpolyline);
                                // var endpolyline = new BMap.Polyline(endLine,{ strokeColor: colorList[cLt], strokeWeight: 2, strokeOpacity: 0.5 })
                                // map.addOverlay(endpolyline);

                                //描绘中间过程点
                                // console.log(allList,"allList")

                                $.each(allList, function (item, value) {
                                    var firstPoint = new BMap.Point(value.longitude, value.latitude);
                                    var m1 = new BMap.Marker(firstPoint,{icon:myIcon});
                                    var content= "<span style='font-size: 10px;color: red'>"+ value.time+"订单号:"+value.orderNo+"</span>";
                                    map.addOverlay(m1);
                                    addClickHandler(content,m1);
                                });

                            }

                            if(userInfo.data.wsList.length>0){
                                for (var i=0;i<userInfo.data.wsList.length;i++){
                                    var wspoint = new BMap.Point(userInfo.data.wsList[i].longitude,userInfo.data.wsList[i].latitude);
                                    var wsmarker = new BMap.Marker(wspoint,{icon:wsIcon});
                                    map.addOverlay(wsmarker);
                                }

                            }else {
                                // alert("暂无仓库数据。")
                                if(userInfo.data.trailList.length==0){

                                }else {
                                    $scope.info="暂无仓库数据"
                                    $scope.hasWrong = true;
                                    $scope.$apply();
                                }

                            }
                        }else {
                            console.log(userInfo.errorinfo.errormessage);
                            // alert(userInfo.errorinfo.errormessage)
                            $scope.info=userInfo.errorinfo.errormessage;
                            $scope.hasWrong = true;
                            $scope.$apply();
                        }

                    },
                    error:function(error){
                        console.log(error);
                        // alert("服务器异常！")
                        $scope.info="服务器异常";
                        $scope.hasWrong = true;
                        $scope.$apply();
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
                    // alert("服务器异常");
                    $scope.info="服务器异常";
                    $scope.hasWrong = true;
                    $scope.$apply();
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
                // alert("请选择回收员")
                $scope.info="请选择回收员";
                $scope.hasWrong = true;
            }else if ($scope.recyleId.id==null){
                // alert("请选择回收员")
                $scope.info="请选择回收员";
                $scope.hasWrong = true;
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


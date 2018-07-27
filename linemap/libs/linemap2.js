
angular.module("myAppD",[])
    .controller("myCtrD",["$scope","$http","$filter",function($scope,$http,$filter) {
        var today = new Date();
        $scope.date = $filter('date')(today, 'yyyy-MM-dd');  //日期控件被调用后赋值开始结束日期---------



        var chartData = [];
        //JS逻辑部分-----------------------------------------------------
        var map = new BMap.Map("allmap");
        map.enableScrollWheelZoom(true);
        map.centerAndZoom(new BMap.Point(118.10000, 24.46667), 11);
        var walking = new BMap.WalkingRoute(map, { renderOptions: { map: map, autoViewport: true} });
        var startpoint = new BMap.Point(118.112917, 24.435153);
        var endpoint = new BMap.Point(118.1086487, 24.439108);
        walking.search(startpoint, endpoint);
        //通过setSearchCompleteCallback回调事件可以把步行间的坐标信息获取
        walking.setSearchCompleteCallback(function (rs) {
            var pts = walking.getResults().getPlan(0).getRoute(0).getPath();
            console.log("getResults:",walking.getResults())
            for (var i = 0; i < pts.length; i++) {
                chartData.push(new BMap.Point(pts[i].lat, pts[i].lng));
            }
            console.log("chartData:",chartData)
        });
        var walkings = new BMap.WalkingRoute(map, { renderOptions: { map: map, autoViewport: true} });
        var twoPoint = new BMap.Point(118.1286555, 24.4491888);
        walkings.search(endpoint, twoPoint);
        walkings.setSearchCompleteCallback(function (rs) {
            var pts = walkings.getResults().getPlan(0).getRoute(0).getPath();
            for (var i = 0; i < pts.length; i++) {
                chartData.push(new BMap.Point(pts[i].lat, pts[i].lng));
            }
        });
        //用来存放途经点的坐标
        var viaRouteData = [];
        viaRouteData.push(endpoint);
        $(function () {
            $("#btn_show").click(function () {
                //这边故意让它晚一秒运行，因为上面获取坐标信息是比较慢又是异步
                setTimeout(ShowRoute, 1000);
            });
        });
        var maps = new BMap.Map("r-result");
        maps.enableScrollWheelZoom(true);
        maps.centerAndZoom(new BMap.Point(118.112917, 24.435153), 15);
        function ShowRoute() {
            // var firstPoint;
            // var endPoint;
            // var newChartData = [];
            // //对坐标点重新定义
            // $.each(chartData, function (item, value) {
            //     newChartData.push(new BMap.Point(value.lat, value.lng));
            // });
            // //为了获得起点及终点的坐标值,方便对它进行文字处理
            // firstPoint = newChartData[0];
            // endPoint = newChartData[newChartData.length - 1];
            // //加载地图

            // //把步行线路的坐标集合转化成折线
            // var polyline = new BMap.Polyline(newChartData, { strokeColor: "red", strokeWeight: 6, strokeOpacity: 0.5 });
            // maps.addOverlay(polyline);
            //
            // //对起点、终点、途经点做一个简单的处理，泡泡跟文字提示
            // var m1 = new BMap.Marker(firstPoint);
            // var m2 = new BMap.Marker(endPoint);
            // maps.addOverlay(m1);
            // maps.addOverlay(m2);
            // var lab1 = new BMap.Label("起点", { position: firstPoint });
            // var lab2 = new BMap.Label("终点", { position: endPoint });
            // maps.addOverlay(lab1);
            // maps.addOverlay(lab2);

            // $.each(viaRouteData, function (item, value) {
            //     var m = new BMap.Marker(value);
            //     maps.addOverlay(m);
            //     var lab = new BMap.Label("途经点", { position: value });
            //     maps.addOverlay(lab);
            // });

            var chartData=[];
            $.ajax({
                type: "get",
                url: "static/tsconfig.json",

                dataType : "json",
                success: function(userInfo){

                    console.log(userInfo.trailList,"==")
                    var abc = userInfo.trailList;
                    console.log(abc.length,"??")
                    $.each(abc, function (item, value) {
                        chartData.push(new BMap.Point(value.longitude, value.latitude));
                        console.log("value:",value)
                    })


                    console.log(chartData,"chartData")
                    // 百度地图API功能




                    for (var i = 0; i < chartData.length-1; i++) {
                        var startPoint = chartData[i];
                        var endPoint = chartData[i + 1];
                        // showPath(startPoint, endPoint);
                        console.log(chartData[i],"chartData[i]")
                    }
                    $.each(abc, function (item, value) {
                        var firstPoint = new BMap.Point(value.longitude, value.latitude);
                        var m1 = new BMap.Marker(firstPoint);
                        maps.addOverlay(m1);
                        var lab1 = new BMap.Label(item+1, { position: firstPoint });
                        maps.addOverlay(lab1);
                    });

                    $scope.$apply();

                },
                error:function(info){
                    console.log(info);
                }
            });
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

    }])


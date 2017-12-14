$(function(){
    var map = new BMap.Map("mapDiu");//在百度地图容器中创建一个地图
    var point = new BMap.Point(114.066112, 22.548515);//定义一个中心点坐标
    var mapY0;//纬度
    var mapX0;//经度
    var zoom;//地图缩放级别
    var marker=[];
    var points=[]
    var content;
    var pointCollection;
    //创建和初始化地图函数：
    function initMap() {
        createMap();//创建地图
        setMapEvent();//设置地图事件
        //addMapControl();//向地图添加控件
        data()
        
    }
        
    
    //setTimeout(initMap(),3000)
    
    //创建地图函数：
    function createMap() {
        /* var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
        var point = new BMap.Point(114.066112, 22.548515);//定义一个中心点坐标 */
        map.centerAndZoom(point, 8);//设定地图的中心点和坐标并将地图显示在地图容器中
        window.map = map;//将map变量存储在全局
        //map.centerAndZoom(new BMap.Point(114.066112, 22.548515), 5);
        //map.enableScrollWheelZoom();
    }

    //地图事件设置函数：
    function setMapEvent() {
        map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
        map.enableScrollWheelZoom();//启用地图滚轮放大缩小
        map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
        map.enableKeyboard();//启用键盘上下左右键移动地图
    }

    //地图控件添加函数：
    function addMapControl() {
        //向地图中添加缩放控件
        var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_ZOOM });
        map.addControl(ctrl_nav);
        //向地图中添加缩略图控件
        var ctrl_ove = new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1 });
        map.addControl(ctrl_ove);
        //向地图中添加比例尺控件
        var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
        map.addControl(ctrl_sca);
    }
    //通过IP实现定位
    function myFun(result) {
        var cityName = result.name;
        map.setCenter(cityName);
        //alert("当前定位城市:"+cityName);
        //console.log("当前地图中心点：" + map.getCenter().lng + "," + map.getCenter().lat);
    }
    var myCity = new BMap.LocalCity();
    myCity.get(myFun); 


    
    
//地图缩放++地图移动++获取地图中心点并向后台发送请求
    
    function data(){
        $.ajax({
            url: "/index/getCustForPosition",
            type: "post",
            data: {}, 
            dataType: "json",
            success: function (data) {
                if(data){
                //console.log(data,"ditu shuju+++++")
                     var opts = {
                        width : 250,     // 信息窗口宽度
                        height: 180,     // 信息窗口高度
                        //title : "信息窗口" , // 信息窗口标题
                        enableMessage:true//设置允许信息窗发送短息
                       };
                    var myIcon = new BMap.Icon("/images/home/stroe2.png", new BMap.Size(100, 100), {
                        anchor: new BMap.Size(10, 10),				//这里是定位点距离图片左上角的偏移量。默认图片中心点作为anchor位置
                        infoWindowAnchor: new BMap.Size(10, 0)		//这里是打开info窗口的位置
                    });//用于已接急单 
                    var option = {
                            size: BMAP_POINT_SIZE_SMALL,
                            shape: BMAP_POINT_SHAPE_WATERDROP,
                            color: '#00ccff'
                        }
                    var content=[];
                    if (document.createElement('canvas').getContext) { 
                        //console.log("11")
                        for(var i=0;i<data.length;i++) {								 
                            content[data[i].mapX+"/"+data[i].mapY] = "<div style='height:60px;'><img style='height:60px;' src=" + data[i].shopImage + "></div>" + "<p style='margin:12px;margin-left:0;font-size:12px'>账号：" + data[i].custPhone + "<span style='font-size:12px;float:right;'>联系人：" + data[i].custName + "</span></p>" +
                                "<p style='margin:12px; margin-left:0;font-size:12px'>店名：" + data[i].shopName + "</p><hr><p style='margin:10px;margin-left:0;font-size:12px'>地址：" + data[i].address + "<span style='font-size:12px;float:right;'>总重量：" + data[i].totalQuantity + "</p>"
                            ;//点击点出现的内容
                            
                            points.push(new BMap.Point(data[i].mapX, data[i].mapY))
                            var pointCollection = new BMap.PointCollection(points, option,{icon:myIcon});  // 初始化PointCollection	
                        }
                    }else{
                        alert("请再IE8以上浏览器上查看。")
                    }
                     
                    map.addOverlay(pointCollection);  // 添加Overlay
                
                    pointCollection.addEventListener("click",function(e){
                        
                        var point = new BMap.Point(e.point.lng, e.point.lat);
                        var infoWindow = new BMap.InfoWindow(content[e.point.lng+"/"+e.point.lat],opts);  // 创建信息窗口对象 
                        map.openInfoWindow(infoWindow,point); //开启信息窗口
                        
                        }
                    );
                }else{
                    console.log("no map data")
                }
                

            }
        });
    }
    //点击图表上的点来实现定位----------------
    $(document).on('click', '.d', function () {
        //当前被点击的控件改变背景色
        $(this).css("background", "#b2e0b2");
    


        var id = $(this).find("td:eq(0)").text();
        var data = { userId: id };
        $.ajax({
            url: "/index/getRecyclerAddress",
            type: "post",
            data: data,
            dataType: "json",
            success: function (data) {
            //	console.log(data);
                mapY = data.mapY;
                mapX = data.mapX;
                theLocation(mapX, mapY);
                theLocation(mapX, mapY);
                theLocation(mapX, mapY);

            }
        });
    })

     // 地图用经纬度设置定位
    function theLocation(a, b) {
        if (a != "" && b != "") {
            map.clearOverlays();
            var new_point = new BMap.Point(a, b);
            var myIcon = new BMap.Icon("/images/home/car1.png",new BMap.Size(30, 30), {
                anchor: new BMap.Size(5, 22),		//图标的定位点相对于图标左上角的偏移值。
                imageSize:new BMap.Size(30, 30)		//图标的大小
            });
            var marker = new BMap.Marker(new_point, { icon: myIcon });  // 创建标注
            map.addOverlay(marker);              // 将标注添加到地图中
            map.panTo(new_point);
            map.setZoom(18);	//定位后自动放大
        } else {
            console.log("no position")
        }
    }
    // var a=setInterval(initMap(),3000)
    // clearInterval(a,4000)
    
     initMap(); 
    // ------------------------------------------------点击放大地图的一个方法---------------------------------------------------
  
    $("#enlarge").click(function(){
     
      $("#mapDiu").animate({"width":"100%","height":"630px","top":"160px"},3000)
      $("#enSmall").css({"display":"block"})
    
      });
      $("#enSmall").click(function(){
        $("#mapDiu").animate({"width":"25%","height":"190px","top":"590px"},3000);
        $("#enSmall").css({"display":"none"})
      })
})
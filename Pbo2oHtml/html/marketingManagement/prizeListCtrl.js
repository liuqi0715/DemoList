var app = angular.module("prize", []);
app.controller('listCtrl', ['$scope','$http','pageList', 'alertBox', function($scope, $http, pageList, alertBox) {
    $scope.currentState = 1;
    $scope.currentPage = 1;
    $scope.initPage = 0;
    $scope.totalPage = 1;
    $scope.searchPage = null;
    $scope.searchObj = {};
    $scope.searchObj.state = {};
    $scope.searchObj.type = {};
    $scope.typeShow = false;
    $scope.statusShow = false;
    $scope.itemTitle = ["奖品图片","奖品名称","奖品类型","积分值","奖品数量","公司名称","状态","操作"];
    $scope.prizeState = [
        {
            prizeState:"已上架",
            prizeStateId:1
        },{
            prizeState:"未上架",
            prizeStateId:0
        }
    ];
    $scope.prizeModel = [
        {
            prizeModel:"实物",
            prizeModelId:1
        },{
            prizeModel:"虚物",
            prizeModelId:2
        }
    ];
    $scope.toggleTypes = function(){
    	$scope.typeShow = !$scope.typeShow;
    };
    $scope.toggleStatus = function(){
    	$scope.statusShow = !$scope.statusShow;
    };
    $scope.slcTypes = function(types){
    	$scope.searchObj.type = types;
        $scope.typeShow = false;
    };
    $scope.slcStatus = function(status){
    	$scope.searchObj.state = status;
        $scope.statusShow = false;
    };
//    $scope.goodsState = [{
//        name: "在售",
//        buttonTitle:"奖品下架",
//        state: 1
//    }, {
//        name: "已售完",
//        buttonTitle:"奖品上架",
//        state: 2
//    }, {
//        name: "已下架",
//        buttonTitle:"奖品上架",
//        state: 3
//    }];
    if($(window).width()<1755){
    	$scope.pageCount = 4;
    }else{
    	$scope.pageCount = 5;
    };
    $scope.goPublish = function(){
        var appElement = document.querySelector('[ng-controller=editCtrl]');
        var $scope = angular.element(appElement).scope();
        $scope.pageState = 0;
        $scope.pageShow(0);
    };
    $scope.creatList = function(init,pages){
        var list = pageList.createList(pages);
        if(pages <= 10){
            $scope.pageList = list;
        }else{
            if(init < (pages-10)){
                var array = list.slice(init,init+9);
                var obj = {};
                obj.page = "...";
                obj.id = "detail";
                array.push(obj);
            }else{
                var array = list.slice(init,init+10);
            }
            $scope.pageList = array;
        }
    };
//    $scope.getState = function(idx) {
//        $scope.currentState = $scope.goodsState[idx].state;
//        $scope.getGoodsList();
//    };
    $scope.getGoodsList = function() {
        var param = {
            "pageCount": $scope.pageCount,
            "currentPage": $scope.currentPage,
            "prizesName":$scope.searchObj.name,
            "prizesType":$scope.searchObj.type.prizeModelId,
            "prizesStatus":$scope.searchObj.state.prizeStateId
        };
        console.log(param);
        $.ajax({
            type:"POST",
            url:'prizeManagementController/searchPrizesList',
            headers: {Accept: "application/json;charset=utf-8"},
            data:param,
            dataType:'json',
            success:function(resp) {
            	console.log(resp);
                $scope.totalPage = resp.totalPage;
                $scope.creatList($scope.initPage,$scope.totalPage);
                $scope.goodsList = resp.rows;
                $scope.$apply();
            },
            error:function(n){
                console.log(n);
            }
        });
    };
    $scope.getGoodsList();
    $scope.edit = function(good) {
        var appElement = document.querySelector('[ng-controller=editCtrl]');
        var $scope = angular.element(appElement).scope();
        $scope.pageState = 1;
        $scope.pageShow();
        $scope.goods.goodsId = good.prizesId;
        $scope.goods.goodsName = good.prizesName;
    };
    $scope.isActivePage = pageList.isActivePage;
    $scope.selectPage = function(page){
        if(page.id == "detail"){
            $scope.currentPage = $scope.pageList[8].page;
            $scope.initPage = $scope.pageList[7].page;
            $scope.creatList($scope.initPage,$scope.totalPage);
        }else{
            $scope.currentPage = page.page;
        }
        $scope.getGoodsList();
    }
    $scope.goFirst = function() {
        $scope.currentPage = 1;
        $scope.initPage = 0;
        $scope.creatList($scope.initPage,$scope.totalPage);
        $scope.getGoodsList();
    };
    $scope.goLast = function() {
        $scope.currentPage = $scope.totalPage;
        if($scope.totalPage>10){
            $scope.initPage = $scope.totalPage - 10;
            $scope.creatList($scope.initPage,$scope.totalPage);
        }
        $scope.getGoodsList();
    };
    $scope.goPrev = function(){
        if($scope.currentPage>10){
            $scope.currentPage = $scope.currentPage - 10;
            $scope.initPage = $scope.currentPage - 1;
        }else{
            $scope.currentPage = 1;
            $scope.initPage = 0;
        }
        $scope.creatList($scope.initPage,$scope.totalPage);
        $scope.getGoodsList();
    };
    $scope.previous = function() {
        if($scope.currentPage == 1){
            alertBox.show("已是最前一页");
            return;
        }
        if ($scope.currentPage > 1) {
            if($scope.currentPage == $scope.pageList[0].page){
                $scope.initPage = $scope.pageList[0].page-2;
                $scope.creatList($scope.initPage,$scope.totalPage);
                $scope.currentPage = $scope.currentPage - 1;
            }else{
                $scope.currentPage = $scope.currentPage - 1;
            }
        } else {
            $scope.currentPage = 1;
            $scope.initPage = 0;
            $scope.creatList($scope.initPage,$scope.totalPage);
        } 
        $scope.getGoodsList();
    };
    $scope.next = function() {
        if($scope.currentPage == $scope.totalPage){
            alertBox.show("已是最后一页");
            return;
        }
        if ($scope.currentPage < $scope.totalPage) {
            if($scope.pageList[8]){
                if($scope.currentPage == $scope.pageList[8].page){
                    $scope.initPage = $scope.pageList[0].page;
                    $scope.creatList($scope.initPage,$scope.totalPage);
                    $scope.currentPage = $scope.currentPage + 1;
                }else{
                    $scope.currentPage = $scope.currentPage + 1;
                }
            }else{
                $scope.currentPage = $scope.currentPage + 1;
            }
        } else {
            $scope.currentPage = $scope.totalPage;
        }
        $scope.getGoodsList();
    };
    $scope.search = function() {
        if(!parseInt($scope.searchPage) || $scope.searchPage<=0){
            alertBox.show("输入不正确");
            return;
        }
        if($scope.searchPage > $scope.totalPage){
            alertBox.show("搜索页数不能大于总页数");
            return;
        }
        $scope.initPage = $scope.searchPage - 1;
        $scope.creatList($scope.initPage,$scope.totalPage);
        $scope.currentPage = $scope.searchPage;
        $scope.getGoodsList();
    };
    //奖品下架
//    $scope.updateGoodsStatus = function() {
//        var selectedIds=[];
//        for (var i = 0; i < $scope.goodsList.length; i++) {
//         if($scope.goodsList[i].isChecked==true){
//             selectedIds.push($scope.goodsList[i].goodsId);
//         }
//        }
//        if(selectedIds.length==0){
//            alertBox.show("请先选择奖品！");
//            return;
//        }
//        var sendJson = {
//            "data": {
//                "goodsIds": selectedIds
//            }
//        };
//        if($scope.currentState==3||$scope.currentState==2){
//            sendJson.data.status=2;
//        }else if($scope.currentState==1){
//            sendJson.data.status=3;
//        }
//
//        var param = JSON.stringify(sendJson);
//
//    };
//    $scope.selectedAll=false;
//    $scope.selectOne= function(good,idx) {
//        $scope.goodsList[idx].isChecked=!$scope.goodsList[idx].isChecked;
//        $scope.countSelected();
//    };
//    $scope.checkAll=function(){
//         $scope.selectedAll=!$scope.selectedAll;
//         if($scope.selectedAll==true){
//             for (var i = 0; i < $scope.goodsList.length; i++) {
//                 $scope.goodsList[i].isChecked=true;
//             }
//         }else{
//             for (var i = 0; i < $scope.goodsList.length; i++) {
//                 $scope.goodsList[i].isChecked=false;
//             }
//         }
//    };
//    $scope.countSelected = function(){
//      var counts = 0;
//        for (var i = 0; i < $scope.goodsList.length; i++) {
//            if($scope.goodsList[i].isChecked == true){
//              counts++;
//            }
//        }
//        if(counts == $scope.goodsList.length){
//          $scope.selectedAll=true;
//        }else{
//          $scope.selectedAll=false;
//        }
//    };
    $scope.getAllTags=function(){
        var sendJson = {
            "data": {}
        };
        var param = JSON.stringify(sendJson);
//        goods.getAllGoodsTag(param).then(function(data){
//            if (data.data.errorInfo == null) {
//                $scope.goodsTagsGroup=data.data.data.listGoodsTag;
//                for(var i=0;i<$scope.goodsTagsGroup.length;i++){
//                    $scope.goodsTagsGroup[i].check=false;
//                }
//            } else {
//                alertBox.show(data.data.errorInfo);
//            }
//        });
    };
    $scope.tagsBoxShow=false;
    $scope.selectedTagId=null;
    $scope.checkTags=function(idx){
        for(var i=0;i<$scope.goodsTagsGroup.length;i++){
            $scope.goodsTagsGroup[i].check=false;
        }
        $scope.goodsTagsGroup[idx].check=true;
        $scope.selectedTagId=$scope.goodsTagsGroup[idx].tagId;
    };
    $scope.editTagsSave=function(){
        if($scope.selectedTagId==null){
            alertBox.show("请先选择标签！");
            return;
        }
        var sendJson = {
            "data": {
                "tagId": $scope.selectedTagId,
                "goodsIds":$scope.selectedIds
            }
        };
        var param = JSON.stringify(sendJson);
    };
    $scope.editTagsCancel=function(){
        $scope.closeEditTagBox();
    };
    $scope.closeEditTagBox=function(){
        $scope.tagsBoxShow=false;
        for(var i=0;i<$scope.goodsTagsGroup.length;i++){
            $scope.goodsTagsGroup[i].check=false;
        }
        $scope.selectedIds=[];
        $scope.selectedTagId=null;
    };
//    $scope.editGoodsTags=function(){
//        $scope.selectedIds=[];
//        $scope.selectedGoodNums = 0;
//        for (var i = 0; i < $scope.goodsList.length; i++) {
//         if($scope.goodsList[i].isChecked==true){
//             $scope.selectedGoodNums++;
//             $scope.selectedIds.push($scope.goodsList[i].goodsId);
//         } 
//        }
//        if($scope.selectedIds.length==0){
//            alertBox.show("请先选择奖品！");
//            return;
//        }
//        $scope.tagsBoxShow=true;
//        $scope.getAllTags();
//    };

    $scope.searchGoods=function(){
        $scope.currentPage=1;
        $scope.getGoodsList();
    };

}]);

app.factory('alertBox', ['$timeout', function ($timeout) {
      var factory = {};
      factory.show = function (type,param,func) {
          var _this = this;
          if(arguments.length<2){
              var types = 1;  
              var param = type; 
          }else{
              var types = type; 
          }
          if(types == 1){
              var temperlate = "<div class='alertBox inner-center'><p>"+param+"</p><div class='alertBox_btn'>确定</div></div>"
          }else{
              var temperlate = "<div class='picPane' id='confirmBox'><div class='alertBox inner-center'><span>"+param+"</span><div class='alertBox_slc'><button id='abCancle' class='btn btn-default'>取消</button><button id='abSure' class='btn btn-danger'>确定</button></div></div></div>"
          }
          $("body").append(temperlate);
          if(types == 1){
              $timeout(function(){
                  _this.hide();
              },2000);
          }
          $('.alertBox_btn').click(function(){
              _this.hide();
          });
          $('#abCancle').click(function(){
              _this.destroy();
          });
          $('#abSure').click(function(){
              if(func){
                  func();
              }
          });
      };
      factory.hide = function () {
          $(".alertBox").remove();
      }
      factory.destroy = function () {
          $("#confirmBox").remove();
      }
      return factory;
    }]);

    //加载动画
    app.service('showLoading', function() {
        this.showLoad=function(){
          var loads='<div class="loadBg"><div class="loadBox"><div class="loading"></div><div class="loadword">数据加载中...</div></div></div>';
          $("body").after(loads);
        };
        this.closeLoad=function(){
          $(".loadBg").remove();
        };
    })

    app.factory('pageList', ['$http', function ($http) {

      var factory = {};
      factory.createList = function (pages) {
        var list = [];
        for(var i=0;i<pages;i++){
            var obj = {};
            obj.page = i+1;
            obj.id = i+1;
            list.push(obj);
        };
        return list;
      };
      factory.isActivePage = function(a,b){
          if(a == b){
              return true;
          }
      };

      return factory;
}]);
    
    
app.controller('editCtrl', ['$scope','alertBox', function($scope,alertBox) {
    var E = window.wangEditor;
    var editor = new E('#editor');
    editor.customConfig.uploadImgServer = getUrl("/prizeManagementController/uploadGoodsDetailImg")+"?loginToken="+getLoginToken();
    editor.customConfig.uploadFileName = 'file';
    editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
            insertImg(result.data.imgList.imgUrl);
        }
    }
    editor.create();
    $scope.canEdit = true;
    $scope.bulkDatas = {};
    $scope.bulkDatas.price = null;
    $scope.bulkDatas.rest = null;
    $scope.bulkDatas.weight = null;
    $scope.choosePics = false;
    $scope.choosePics1 = false;
    $scope.typeName = null;
    $scope.slcTypeName = "选择类型";
    $scope.addModelNums = 0;
    $scope.addModelPane = [];
    $scope.goodsTypeShow = false;
    $scope.unify = true;
    $scope.paneShow = false;
    $scope.multiple = false;
    $scope.itemTitle = [], $scope.items = [];
    $scope.catalogs = []; // 商品分类选择数组
    $scope.goodsTags = []; // 商品标签
    $scope.goodsTypes = [];
    $scope.goods = {};
    $scope.goods.mainPic = [];
//    $scope.goods.expPic = null;
    $scope.goods.catId = null;
//    $scope.goods.catId1 = null;
    $scope.goods.brandId = 1;
//    $scope.goods.productSpec = 1;
//    $scope.goods.productSpecInfo = [];
    $scope.goods.goodsImgIds = [];
//    $scope.goods.goodsAttrImgIds = [];
    $scope.goods.goodsId = null;
    $scope.goods.provinceId = null;
    $scope.goods.cityId = null;
    $scope.goods.startTime = null;
    $scope.goods.endTime = null;
    $scope.goods.areaList = [];
    $scope.goods.startTime = null;
    $scope.goods.endTime = null;
    $scope.provinceShow = false;
    $scope.cityShow = false;
    $scope.areaShow = false;
    $scope.itemTitle = ["区域","数量","操作"];
    $scope.provinceSlc = "省份";
    $scope.citySlc = "城市";
    $scope.areaSlc = "区域";
    $scope.areaList = [];
    $scope.pageState = 0;
    setTimeout(function() {
        $.datepicker.regional['zh-CN'] = {
            changeMonth: true,
            changeYear: true,
            clearText: '清除',
            clearStatus: '清除已选日期',
            closeText: '关闭',
            closeStatus: '不改变当前选择',
            prevText: '<上月',
            prevStatus: '显示上月',
            prevBigText: '<<',
            prevBigStatus: '显示上一年',
            nextText: '下月>',
            nextStatus: '显示下月',
            nextBigText: '>>',
            nextBigStatus: '显示下一年',
            currentText: '今天',
            currentStatus: '显示本月',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            monthStatus: '选择月份',
            yearStatus: '选择年份',
            weekHeader: '周',
            weekStatus: '年内周次',
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            dayStatus: '设置 DD 为一周起始',
            dateStatus: '选择 m月 d日, DD',
            dateFormat: 'yy-mm-dd',
            firstDay: 1,
            initStatus: '请选择日期',
            isRTL: false
        };
        $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
        $("#date_start").prop("readonly", true).datepicker({
            changeMonth: true,
            dateFormat: "yy-mm-dd",
            onClose: function(selectedDate) {
                $("#date_end").datepicker("option", "minDate", selectedDate);
                $scope.goods.startTime = $("#date_start").val();
            }
        }).css("z-index",1000);
        $("#date_end").prop("readonly", true).datepicker({
            changeMonth: true,
            dateFormat: "yy-mm-dd",
            onClose: function(selectedDate) {
                $("#date_start").datepicker("option", "maxDate", selectedDate);
                $("#date_end").val($(this).val());
                $scope.goods.endTime = $("#date_end").val();
            }
        }).css("z-index",1000);
    }, 200);
//  $scope.goodsState = [{
//      name: "在售",
//      buttonTitle:"奖品下架",
//      state: 1
//   }, {
//      name: "已售完",
//      buttonTitle:"奖品上架",
//      state: 2
//   }, {
//      name: "已下架",
//      buttonTitle:"奖品上架",
//      state: 3
//  }];
    var render = function(){
        var param = {
            "prizeId": $scope.goods.goodsId,
        };
        $.ajax({
            type:"POST",
            url:'prizeManagementController/searchPrizeById',
            headers: {Accept: "application/json;charset=utf-8"},
            data:param,
            dataType:'json',
            success:function(resp) {
                console.log(resp);
                $scope.goods.mainPic = [];
                $scope.slcTypeName = resp.prizesType;
                if(resp.prizesType == "实物"){
                    $scope.goods.catId = 1
                }else{
                    $scope.goods.catId = 2
                }
                $scope.goods.shipFree = resp.shipFree;
                $scope.goods.status = resp.status;
                $scope.goods.stockQuantity = resp.prizesNum;
                $scope.goods.order = resp.prizesSort;
                $scope.goods.content = resp.prizesInstruction;
                editor.txt.html(resp.description);
                $scope.goods.condition = resp.useConditions;
                $scope.goods.progress = resp.exchangeFlow;
                $scope.goods.important = resp.impInstruction;
                $scope.areaList = resp.prizesAreaList;
                $scope.goods.mainPic = resp.prizesImageList;
                $scope.goods.startTime = resp.prizeStarttime;
                $scope.goods.endTime = resp.prizeStoptime;
                $("#date_start").val(resp.prizeStarttime);
                $("#date_end").val(resp.prizeStoptime);
                $scope.$apply();
            },
            error:function(n){
                console.log(n);
            }
        });
    };
    var getProvince = function(){
        $.ajax({
            type:"POST",
            url:'prizeManagementController/getAllProvince',
            headers: {Accept: "application/json;charset=utf-8"},
            dataType:'json',
            success:function(resp){
                $scope.province = resp;
                $scope.$apply();
            },
            error:function(n){
                console.log(n);
            }
        });
    };
    var getCity = function(){
        var param = {
            "provinceId": $scope.goods.provinceId,
        };
        $.ajax({
            type:"POST",
            url:'prizeManagementController/getCityByProvinceId',
            headers: {Accept: "application/json;charset=utf-8"},
            data:param,
            dataType:'json',
            success:function(resp) {
                $scope.city = resp;
                $scope.$apply();
            },
            error:function(n){
                console.log(n);
            }
        });
    };
    var getArea = function(){
        var param = {
            "cityId": $scope.goods.cityId,
        };
        $.ajax({
            type:"POST",
            url:'prizeManagementController/getAreaByCityId',
            headers: {Accept: "application/json;charset=utf-8"},
            data:param,
            dataType:'json',
            success:function(resp) {
                $scope.area = resp;
                $scope.$apply();
            },
            error:function(n){
                console.log(n);
            }
        });
    };
    getProvince();
    $scope.toggleProvince = function(){
        $scope.provinceShow = !$scope.provinceShow;
    };
    $scope.toggleCity = function(){
        $scope.cityShow = !$scope.cityShow;
        if($scope.cityShow == true){
            getCity();
        }
    };
    $scope.toggleArea = function(){
        $scope.areaShow = !$scope.areaShow;
        if($scope.areaShow == true){
            getArea();
        }
    };
    $scope.slcProvince = function(province){
        $scope.goods.provinceId = province.provinceId;
        $scope.goods.areaId = $scope.goods.provinceId;
        $scope.goods.cityId = null;
        $scope.citySlc = "城市";
        $scope.areaSlc = "区域";
        $scope.provinceSlc = province.provinceName;
        $scope.provinceShow = false;
    };
    $scope.slcCity = function(city){
        $scope.goods.cityId = city.cityId;
        $scope.goods.areaId = $scope.goods.cityId;
        $scope.areaSlc = "区域";
        $scope.citySlc = city.cityName;
        $scope.cityShow = false;
    };
    $scope.slcArea = function(area){
        $scope.goods.areaId = area.areaId;
        $scope.areaSlc = area.areaName;
        $scope.areaShow = false;
    };
    $scope.addArea = function(){
    	if($scope.goods.stockQuantity == null || $scope.goods.stockQuantity == 0){
    		alertBox.show("请先输入奖品数量！");
    		return;
    	}
        if($scope.goods.provinceId != null){
            var obj = {};
            if($scope.citySlc != "城市" && $scope.areaSlc != "区域"){
                obj.areaName = $scope.provinceSlc + $scope.citySlc + $scope.areaSlc;
            }else if($scope.citySlc != "城市" && $scope.areaSlc == "区域"){
                obj.areaName = $scope.provinceSlc + $scope.citySlc;
            }else if($scope.citySlc == "城市"){
                obj.areaName = $scope.provinceSlc;
            }
            obj.areaId = $scope.goods.areaId;
            obj.prizesNum = 0;
            if($scope.areaList.length>0){
                var count = 0;
                for(var i = 0;i < $scope.areaList.length;i++){
                    if($scope.areaList[i].areaId == obj.areaId){
                        count++;
                    }
                }
                if(count == 0){
                    $scope.areaList.push(obj);
                }else{
                	alertBox.show("不可添加重复区域！");
                    return;
                }
            }else{
                $scope.areaList.push(obj);
            }
            $scope.countNums();
        }
    };
    $scope.intNums = function(idx){
    	if(idx){
    		$scope.areaList[idx].prizesNum = parseInt($scope.areaList[idx].prizesNum);
    	}else{
    		$scope.goods.stockQuantity = parseInt($scope.goods.stockQuantity);
        	if(isNaN($scope.goods.stockQuantity)){
        		$scope.goods.stockQuantity = 0;
        	};
    		$scope.goods.bpPrice = parseInt($scope.goods.bpPrice);
        	if(isNaN($scope.goods.bpPrice)){
        		$scope.goods.bpPrice = 0;
        	};
    	}
    	
    };
    $scope.countNums = function(idx){
    	if(idx){
        	if(isNaN($scope.areaList[idx].prizesNum)){
        		$scope.areaList[idx].prizesNum = 0;
        	};
    	}
    	var len = $scope.areaList.length;
    	var total = 0;
    	var total1 = 0;
    	var hasVal = 0;
    	var noVal = [];
    	if(len>1){
        	for(var i = 0;i < $scope.areaList.length;i++){
        		if($scope.areaList[i].prizesNum > 0){
        			hasVal++;
        		}else{
        			noVal.push(i);
        		}
        		total = total + parseInt($scope.areaList[i].prizesNum);
        		if(i!=idx){
        			total1 = total1 + $scope.areaList[i].prizesNum;
        		}
        	}
        	if(noVal.length == 1 && total < $scope.goods.stockQuantity){
        		$scope.areaList[noVal[0]].prizesNum = $scope.goods.stockQuantity - total;
        	}else if(noVal.length == 0 && total < $scope.goods.stockQuantity){
        		alertBox.show("所输入数量总和应等于奖品数量所设值！");
        	}else if(noVal.length == 0 && total > $scope.goods.stockQuantity){
        		$scope.areaList[idx].prizesNum = $scope.goods.stockQuantity - total1;
        	}
    	}else{
    		$scope.areaList[0].prizesNum = $scope.goods.stockQuantity;
    	}
    };
    $scope.delArea = function(idx){
        $scope.areaList.splice(idx,1);
        console.log($scope.areaList);
    };
    
    $scope.pageShow = function(isNew){
        $("#pEdit").scrollTop(0);
        $("#pEdit").css("z-index",10);
        setTimeout(function(){
            $scope.paneShow = true;
            if(isNew == 0){
              $scope.goods = {};
              $scope.goods.mainPic = [];
              $scope.goods.catId = null;
              $scope.goods.brandId = 1;
              $scope.goods.goodsImgIds = [];
              $scope.goods.goodsId = null;
              $scope.goods.provinceId = null;
              $scope.goods.cityId = null;
              $scope.goods.startTime = null;
              $scope.goods.endTime = null;
              $scope.goods.areaList = [];
              $scope.provinceShow = false;
              $scope.cityShow = false;
              $scope.areaShow = false;
              $scope.provinceSlc = "省份";
              $scope.citySlc = "城市";
              $scope.areaSlc = "区域";
              $scope.areaList = [];
              $scope.slcTypeName = "选择类型";
              $scope.goods.startTime = null;
              $scope.goods.endTime = null;
              $scope.goods.shipFree = null;
              $scope.goods.status = null;
              $scope.goods.stockQuantity = null;
              $scope.goods.order = null;
              $scope.goods.content = null;
              $scope.goods.condition = null;
              $scope.goods.progress = null;
              $scope.goods.important = null;
              editor.txt.html("");
              $("#date_start").val("");
              $("#date_end").val("");
            }else{
                render();
            }
            $scope.$apply();
        },100);
        setTimeout(function(){
            $("#pEdit").css("opacity",1);
        },1100);
    };
    $scope.pageHide = function(){
        setTimeout(function(){
            $scope.paneShow = false;
            $scope.$apply();
        },100);
        setTimeout(function(){
            $("#pEdit").css("z-index",-2);
            $("#pEdit").css("opacity",0);
        },1100);
    };
    $scope.cancelOpt = function(){
        $scope.pageHide();
    };
    $scope.getGoodTags = function() {
        var sendData = {
            "data": {}
        };
        $.ajax({
            type: "post",
            url: "/goods/getAllGoodsTag/",
            contentType: 'application/json',
            data: JSON.stringify(sendData),
            dataType: "json",
            success: function(data) {
                if (data.errorInfo == null) {
                    var datas = data.data.listGoodsTag;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].check = false;
                    }
                    $scope.goodsTags = datas;
                    $scope.$apply();
                } else {
                    alertBox.show(data.errorInfo);
                }
            },
            error: function(info) {
                console.log(info);
            }
        });

    };
    $scope.delectMainPic = function(idx){
        var sendData = {
            "data": {
                "imageId":$scope.goods.mainPic[idx].imageId
            }
        };
        $scope.goods.mainPic.splice(idx, 1);
        $.ajax({
            type: "post",
            url: "prizeManagementController/deleteGoodsImg",
            contentType: 'application/json',
            data: JSON.stringify(sendData),
            dataType: "json",
            success: function(data) {
                if (data.errorInfo == null) {
                    alertBox.show(data.errorInfo);
                }
            },
            error: function(info) {
                console.log(info);
            }
        });
    };
    $scope.getThisType = function(idx) {
        for (var i = 0; i < $scope.goodsTags.length; i++) {
            $scope.goodsTags[i].check = false;
        }
        $scope.goodsTags[idx].check = true;
        $scope.goods.tagId = $scope.goodsTags[idx].tagId;
    };
//    $scope.getGoodTags();
    $scope.addValueBox = function(idx) {
      if($scope.canEdit == true){
        $scope.addModelPane[idx].boxShow = true;
        var sendData = {
            "data": {
                "attrNameId": $scope.addModelPane[idx].selectValueId
            }
        };
        $.ajax({
            type: "post",
            url: "/goods/getAttributeValue/",
            contentType: 'application/json',
            data: JSON.stringify(sendData),
            dataType: "json",
            success: function(data) {
                if (data.errorInfo == null) {
                    var datas = data.data.listAttrValue;
                    console.log(datas);
                    for (var i = 0; i < datas.length; i++) {
                        datas.check = false;
                    }
                    $scope.addModelPane[idx].modelValueHistory = datas;
                    $scope.$apply();
                } else {
                    alertBox.show(data.errorInfo);
                }
            },
            error: function(info) {
                console.log(info);
            }
        });
      }
    };
    $scope.closeValueBox = function(idx) {
        $scope.addModelPane[idx].boxShow = false;
    };
    $scope.getGoodsType = function() {
        if($scope.canEdit == true){
            $scope.goodsTypeShow = true;
            $scope.catalogs = [
                {
                    check:false,
                    catName:"实物",
                    catId:1
                },
                {
                    check:false,
                    catName:"虚物",
                    catId:2
                }
            ];
//            if ($scope.goodsTypeShow == true) {
//                var sendData = {
//                    "data": {}
//                };
//                $.ajax({
//                    type: "post",
//                    async: false,
//                    url: "/category/searchCategory",
//                    contentType: 'application/json',
//                    data: JSON.stringify(sendData),
//                    dataType: "json",
//                    success: function(data) {
//                        if (data.errorInfo == null) {
//                            var datas = data.data.listCategory;
//                            console.log(data);
//                            for (var i = 0; i < datas.length; i++) {
//                                datas[i].showChild = false;
//                                datas[i].check = false;
//                                var childDatas = datas[i].lowerCategory;
//                                if (childDatas.length > 0) {
//                                    for (var j = 0; j < childDatas.length; j++) {
//                                        childDatas[j].showChild = false;
//                                        childDatas[j].check = false;
//                                        var subChildDatas = childDatas[j].lowerCategory;
//                                        if (subChildDatas.length > 0) {
//                                            for (k = 0; k < subChildDatas.length; k++) {
//                                                subChildDatas[k].showChild = false;
//                                                subChildDatas[k].check = false;
//                                            }
//                                        }
//                                    }
//                                }
//                            }
//                            $scope.catalogs = datas;
//                        } else {
//                            alertBox.show(data.errorInfo);
//                        }
//                    },
//                    error: function(info) {
//                        console.log(info);
//                    }
//                });
//            }
        }
    };
    $scope.goodsTypeCancel = function() {
        $scope.goodsTypeShow = false;
    };
    $scope.clearAllType = function(){
        for (var i = 0; i < $scope.catalogs.length; i++) {
            $scope.catalogs[i].check = false;
            if($scope.catalogs[i].lowerCategory){
                var child = $scope.catalogs[i].lowerCategory;
                for (var j = 0; j < child.length; j++) {
                    child[j].check = false;
                    var subChild = $scope.catalogs[i].lowerCategory[j].lowerCategory;
                    for (k = 0; k < subChild.length; k++) {
                        subChild[k].check = false;
                    }
                }
            }
        }
    };
    $scope.getParentType = function(a) {
        $scope.clearAllType();
        $scope.catalogs[a].check = true;
        $scope.typeName = $scope.catalogs[a].catName;
        $scope.goods.catId1 = $scope.catalogs[a].catId;
    };
    $scope.getChildType = function(a, b) {
        $scope.clearAllType();
        $scope.catalogs[a].lowerCategory[b].check = true;
        $scope.typeName = $scope.catalogs[a].lowerCategory[b].catName;
        $scope.goods.catId1 = $scope.catalogs[a].lowerCategory[b].catId;
    };
    $scope.getSubChildType = function(a, b, c) {
        $scope.clearAllType();
        $scope.catalogs[a].lowerCategory[b].lowerCategory[c].check = true;
        $scope.typeName = $scope.catalogs[a].lowerCategory[b].lowerCategory[c].catName;
        $scope.goods.catId1 = $scope.catalogs[a].lowerCategory[b].lowerCategory[c].catId;
    };
    $scope.goodsTypeSure = function() {
        $scope.goodsTypeShow = false;
//        $scope.showUnify();
        $scope.slcTypeName = $scope.typeName;
        $scope.goods.catId = $scope.goods.catId1;
        for(var i = 0;i < $scope.addModelPane.length;i++){
            $scope.addModelPane[i].selectListShow = false;
        }
    };
//    $scope.actionChild = function(idx) {
//        if ($scope.catalogs[idx].lowerCategory.length > 0) {
//            $scope.catalogs[idx].showChild = !$scope.catalogs[idx].showChild;
//        }
//    };
    $scope.actionSubChild = function(a, b) {
        if ($scope.catalogs[a].lowerCategory[b].lowerCategory.length > 0) {
            $scope.catalogs[a].lowerCategory[b].showChild = !$scope.catalogs[a].lowerCategory[b].showChild;
        }
    };
    $scope.selectList = function(idx) { // 添加规格列表显示隐藏
        if($scope.canEdit == true){
            $scope.addModelPane[idx].selectListShow = !$scope.addModelPane[idx].selectListShow;
            if ($scope.addModelPane[idx].selectListShow == true) {
                var sendData = {
                    "data": {
                        "catId": $scope.goods.catId
                    }
                };
                $.ajax({
                    type: "post",
                    async: false,
                    url: "/goods/getCatAttribute/",
                    contentType: 'application/json',
                    data: JSON.stringify(sendData),
                    dataType: "json",
                    success: function(data) {
                        if (data.errorInfo == null) {
                            $scope.addModelPane[idx].selectList = data.data.listAttr;
                        }
                    },
                    error: function(info) {
                        console.log(info);
                    }
                });
            }
        }
    };
    $scope.getModelName = function(a, b) { // 添加规格列表选择
        for(var i=0;i<$scope.addModelPane.length;i++){
            if($scope.addModelPane[a].selectList[b].attrName == $scope.addModelPane[i].selectValue){
                alertBox.show("请勿添加重复的规格属性！");
                return;
            }
        }
        $scope.addModelPane[a].selectValue = $scope.addModelPane[a].selectList[b].attrName;
        $scope.addModelPane[a].selectValueId = $scope.addModelPane[a].selectList[b].attrNameId;
        console.log($scope.addModelPane[a].selectValueId);
        var sendData = {
            "data": {
                "attrName": $scope.addModelPane[a].selectValue,
                "catId": $scope.goods.catId,
                "inputType": 1
            }
        };
        $.ajax({
            type: "post",
            url: "/goods/addAttribute/",
            contentType: 'application/json',
            data: JSON.stringify(sendData),
            dataType: "json",
            success: function(data) {
                $scope.addModelPane[a].selectValueId = data.data.attrNameId;
            },
            error: function(info) {
                console.log(info);
            }
        });
        $scope.selectList(a);
    };
    $scope.selectListChange = function(idx) { // 添加规格列表输入
        $scope.addModelPane[idx].selectList = [];
        var obj = {};
        obj.attrName = $scope.addModelPane[idx].selectListInput;
        $scope.addModelPane[idx].selectList.push(obj);
    };
    $scope.closePicsPane = function() {
        $scope.choosePics = false;
        $("#zyupload").empty();
    };
    $scope.closePicsPane1 = function() {
        $scope.choosePics1 = false;
        $("#expload").empty();
    };
    $scope.uploadPic = function() {
        if($scope.goods.mainPic.length == 12){
            alertBox.show("图片上传数量已达上限");
            return;
        }
        $scope.choosePics = true; 
        var picsManager = $("#zyupload").zyUpload({
            width: "830px", // 宽度
            height: "600px", // 宽度
            itemWidth: "140px", // 文件项的宽度
            itemHeight: "115px", // 文件项的高度
            url: getUrl("/prizeManagementController/uploadPrizesImg")+"?loginToken="+getLoginToken(), // 上传文件的路径
            fileType: ["jpg", "png", "txt", "js", "exe"], // 上传文件的类型
            fileSize: 51200000, // 上传文件的大小
            multiple: true, // 是否可以多个文件上传
            dragDrop: true, // 是否可以拖动上传文件
            tailor: true, // 是否可以裁剪图片
            del: true, // 是否可以删除文件
            finishDel: false, // 是否在上传文件完成后删除预览
            /* 外部获得的回调接口 */
            onSelect: function(selectFiles, allFiles) { // 选择文件的回调方法
                // selectFile:当前选中的文件
                // allFiles:还没上传的全部文件
            },
            onDelete: function(file, files) { // 删除一个文件的回调方法 file:当前删除的文件
                // files:删除之后的文件
            },
            onSuccess: function(file, response) { // 文件上传成功的回调方法
                var datas = eval("(" + response + ")");
                console.log(datas);
                if (datas.systemErrorMessage == null) {
                    datas = datas.data;
                    console.log(datas);
                    if (datas.imgList) {
                        $scope.goods.mainPic.push(datas.imgList);
                        if ($scope.goods.mainPic.length > 13) {
                            
//                            $scope.goods.goodsImgIds.push(datas.imgList[0].imageId);
//                            for(var j=0;j<12;j++){
//                              tempArray1.push($scope.goods.goodsImgIds[j]);
//                            }
//                            $scope.goods.goodsImgIds = tempArray1;
                            var tempArray = [],tempArray1 = [];
                            for(var i=0;i<12;i++){
                                tempArray.push($scope.goods.mainPic[i]);
                            }
                            $scope.goods.mainPic = tempArray;
                        }
                        console.log($scope.goods.mainPic);
                        $scope.choosePics = false;  
                        $scope.$apply();
                        $("#zyupload").empty();
                    }
                } else {
                    alertBox.show(datas.errorInfo);
                }
            },
            onFailure: function(file, response) { // 文件上传失败的回调方法
                console.info("此文件上传失败：");
                console.info(file.name);
            },
            onComplete: function(response) { // 上传完成的回调方法
                // console.info(response);
            }
        });
    };
    $scope.uploadPic1 = function(a, b, parentIdx, idx) {
        if($scope.canEdit == true){
            $scope.choosePics1 = true;
            var picsManager = $("#expload").zyUpload({
                width: "830px", // 宽度
                height: "600px", // 宽度
                itemWidth: "140px", // 文件项的宽度
                itemHeight: "115px", // 文件项的高度
                url: "/upload/UploadAction", // 上传文件的路径
                fileType: ["jpg", "png", "txt", "js", "exe"], // 上传文件的类型
                fileSize: 51200000, // 上传文件的大小
                multiple: false, // 是否可以多个文件上传
                dragDrop: true, // 是否可以拖动上传文件
                tailor: true, // 是否可以裁剪图片
                del: true, // 是否可以删除文件
                finishDel: false, // 是否在上传文件完成后删除预览
                /* 外部获得的回调接口 */
                onSelect: function(selectFiles, allFiles) { // 选择文件的回调方法
                    // selectFile:当前选中的文件
                    // allFiles:还没上传的全部文件
                },
                onDelete: function(file, files) { // 删除一个文件的回调方法 file:当前删除的文件
                    // files:删除之后的文件
                },
                onSuccess: function(file, response) { // 文件上传成功的回调方法
                    var datas = eval("(" + response + ")");
                    if (datas.errorInfo == null) {
                        if (datas.data.imgList.length > 0) {
                            var obj = {};
                            obj.selectValue = a;
                            obj.modelValue = $scope.addModelPane[parentIdx].modelValueTags[idx];
                            obj.imgId = datas.data.imgList[0].imageId;
                            if($scope.goods.goodsAttrImgIds.length == 0){
                                 $scope.goods.goodsAttrImgIds.push(obj);
                            }else{
                                var count=0;
                                for(var i=0;i<$scope.goods.goodsAttrImgIds.length;i++){
                                    var con = $scope.goods.goodsAttrImgIds[i];
                                    if(con.selectValue == a && con.modelValue == $scope.addModelPane[parentIdx].modelValueTags[idx]){
                                        con.imgId = datas.data.imgList[0].imageId;
                                        count++;
                                    }
                                }
                                if(count==0){
                                  $scope.goods.goodsAttrImgIds.push(obj);
                                }
                            }
                            $scope.choosePics1 = false;
                            $("#" + a + b).attr("src", datas.data.imgList[0].litimgUrl).css("display", "block");
                            $scope.$apply();
                            $("#expload").empty();
                        }
                    } else {
                        alertBox.show(datas.errorInfo);
                    }
                },
                onFailure: function(file, response) { // 文件上传失败的回调方法
                    console.info("此文件上传失败：");
                    console.info(file.name);
                },
                onComplete: function(response) { // 上传完成的回调方法
                    // console.info(response);
                }
            });
        }
    };
    $scope.addModel = function() {
        if($scope.canEdit == true){
            if ($scope.addModelNums < 3) {
                $scope.addModelNums++;
                var data = {};
                data.selectValue = null;
                data.selectValueId = null;
                data.modelValue = null;
                data.selectListInput = null;
                data.modelValueTags = [];
                data.selectListShow = false;
                data.boxShow = false;
                data.showUpLoad = false;
                data.selectList = [];
                data.modelValueHistory = [];
                $scope.addModelPane.push(data);
            }
        }
    };
    $scope.delectModelVal = function(a, b ,relatedId) {
        if($scope.canEdit == true){
            $scope.addModelPane[a].modelValueTags.splice(b, 1);
            $scope.itemTitle = [];
            for (var i = 0; i < $scope.addModelPane.length; i++) {
                if ($scope.addModelPane[i].selectValue != null && $scope.addModelPane[i].modelValueTags.length > 0) {
                    $scope.itemTitle.push($scope.addModelPane[i].selectValue);
                }
            }
            var tempArray=[];
            for(var i=0;i<$scope.goods.goodsAttrImgIds.length;i++){
                var con = $scope.goods.goodsAttrImgIds[i];
                if(con.selectValue == relatedId && con.modelValue == $scope.addModelPane[a].modelValueTags[b]){
                    continue;
                }else{
                    tempArray.push(con);
                }
            }
            $scope.goods.goodsAttrImgIds = tempArray;
            createItems();
        }
    };
    var tableWidth = null;

//    function createItems() {
//        $scope.items = [];
//        var len = 0;
//        for (var a = 0; a < $scope.addModelPane.length; a++) {
//            if ($scope.addModelPane[a].modelValueTags.length > 0) {
//                len++;
//            }
//        }
//        switch (len) {
//            case 1:
//                var array = $scope.addModelPane[0].modelValueTags;
//                var wrap = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap1");
//                var wrap1 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap2");
//                var wrap2 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap3");
//                var wrap3 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap4");
//                var wrap4 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap5");
//                for (i = 0; i < array.length; i++) {
//                    var block = $("<div class='gp_table_item'></div>").html(array[i]);
//                    wrap.append(block);
//                    wrap1.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
//                    wrap2.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
//                    wrap3.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
//                    wrap4.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
//                };
//                $(".gp_table_body").empty().append(wrap).append(wrap1).append(wrap2).append(wrap3).append(wrap4);
//                $(".gp_table_wrap").width(tableWidth / 5);
//                setTimeout(function() {
//                    $(".gp_table_title").width(tableWidth / 5);
//                }, 50);
//                $(".gp_table_body").height(50 * array.length).css({ "line-height": 50 * array.length + "px" })
//                $("#wrap1,#wrap2").find(".gp_table_item").css({ "border-bottom": "1px solid #DDDDDD", "border-right": "1px solid #DDDDDD" });
//                $("#wrap3,#wrap4,#wrap5").find(".gp_table_item").css({ "border-bottom": "1px solid #DDDDDD" });
//                break;
//            case 2:
//                var array = $scope.addModelPane[0].modelValueTags;
//                var array1 = $scope.addModelPane[1].modelValueTags;
//                var wrap = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap1");
//                var wrap1 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap2");
//                var wrap2 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap3");
//                var wrap3 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap4");
//                var wrap4 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap5");
//                var wrap5 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap6");
//                for (i = 0; i < array.length; i++) {
//                    var block = $("<div class='gp_table_item'></div>").html(array[i]);
//                    var divWrap = $("<div class='gp_table_con'></div>");
//                    for (j = 0; j < array1.length; j++) {
//                        var block1 = $("<div class='gp_table_item'></div>").html(array1[j]);
//                        divWrap.append(block1);
//                        wrap2.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
//                        wrap3.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
//                        wrap4.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
//                        wrap5.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
//                    }
//                    wrap.append(block);
//                    wrap1.append(divWrap);
//                };
//                $(".gp_table_body").empty().append(wrap).append(wrap1).append(wrap2).append(wrap3).append(wrap4).append(wrap5);
//                $(".gp_table_wrap").width(tableWidth / 6);
//                setTimeout(function() {
//                    $(".gp_table_title").width(tableWidth / 6);
//                }, 50);
//                $(".gp_table_body").height(50 * array.length * array1.length);
//                $("#wrap1").find(".gp_table_item").height(49 * array1.length + array1.length).css({ "line-height": (49 * array1.length + array1.length) + "px", "border-bottom": "1px solid #DDDDDD", "border-right": "1px solid #DDDDDD" });
//                $("#wrap2").find(".gp_table_item").height(49).css({ "border-bottom": "1px solid #DDDDDD" });
//                $("#wrap2").find(".gp_table_con").height(49 * array1.length + array1.length).css({ "border-right": "1px solid #DDDDDD", "line-height": (49 * array1.length + array1.length) + "px" });
//                break;
//            default:
//                var array = $scope.addModelPane[0].modelValueTags;
//                var array1 = $scope.addModelPane[1].modelValueTags;
//                var array2 = $scope.addModelPane[2].modelValueTags;
//                var wrap = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap1");
//                var wrap1 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap2");
//                var wrap2 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap3");
//                var wrap3 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap4");
//                var wrap4 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap5");
//                var wrap5 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap6");
//                var wrap6 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap7");
//                for (i = 0; i < array.length; i++) {
//                    var block = $("<div class='gp_table_item'></div>").html(array[i]);
//                    var divWrap = $("<div class='gp_table_con'></div>");
//                    var divWrap3 = $("<div class='gp_table_con1'></div>");
//                    for (j = 0; j < array1.length; j++) {
//                        var block1 = $("<div class='gp_table_item'></div>").html(array1[j]);
//                        divWrap.append(block1);
//                        var divWrap1 = $("<div class='gp_table_con'></div>");
//                        for (k = 0; k < array2.length; k++) {
//                            var block2 = $("<div class='gp_table_item'></div>").html(array2[k]);
//                            divWrap1.append(block2);
//                            wrap3.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
//                            wrap4.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
//                            wrap5.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
//                            wrap6.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
//                        }
//                        divWrap3.append(divWrap1);
//                    }
//                    wrap.append(block);
//                    wrap1.append(divWrap);
//                    wrap2.append(divWrap3);
//                };
//                $(".gp_table_body").empty().append(wrap).append(wrap1).append(wrap2).append(wrap3).append(wrap4).append(wrap5).append(wrap6);
//                $(".gp_table_wrap").width(tableWidth / 7);
//                setTimeout(function() {
//                    $(".gp_table_title").width(tableWidth / 7);
//                }, 50);
//                $(".gp_table_body").height(50 * array.length * array1.length * array2.length);
//                $("#wrap1").find(".gp_table_item").height(50 * array1.length * array2.length).css({ "line-height": (50 * array1.length * array2.length - 1) + "px", "border-bottom": "1px solid #DDDDDD", "border-right": "1px solid #DDDDDD" });
//                $("#wrap2").find(".gp_table_item").height(50 * array2.length).css({ "line-height": 50 * array2.length + "px", "border-bottom": "1px solid #DDDDDD" });
//                $("#wrap2").find(".gp_table_con").height(50 * array1.length * array2.length).css({ "line-height": $("#wrap2").find(".gp_table_item").height()*array1.length + "px", "border-right": "1px solid #DDDDDD" });
//                $("#wrap3").find(".gp_table_item").height(49).css({ "line-height": 49 + "px" });
//                $("#wrap3").find(".gp_table_con").height(50 * array2.length).css({ "border-bottom": "1px solid #DDDDDD" });
//                $("#wrap3").height(50 * array.length * array1.length * array2.length -2 ).css({ "border-right": "1px solid #DDDDDD" });
//        }
//    };
//    $scope.bulk = function() {
//        var len = $(".gp_table_wrap").length;
//        console.log($(".gp_table_wrap").eq(len - 3).find("gp_table_item").find("input"));
//        if ($scope.bulkDatas.price != null && $scope.bulkDatas.price != undefined) {
//            $(".gp_table_wrap").eq(len - 3).find(".gp_table_item").find("input").val($scope.bulkDatas.price);
//        }
//        if ($scope.bulkDatas.rest != null && $scope.bulkDatas.rest != undefined) {
//            $(".gp_table_wrap").eq(len - 2).find(".gp_table_item").find("input").val($scope.bulkDatas.rest);
//        }
//        if ($scope.bulkDatas.weight != null && $scope.bulkDatas.weight != undefined) {
//            $(".gp_table_wrap").eq(len - 1).find(".gp_table_item").find("input").val($scope.bulkDatas.weight);
//        }
//    };
    $scope.getModelValue = function(idx) {
        var amp = $scope.addModelPane[idx].modelValueTags;
        var count = 0,
            count1 = 0;
        if ($scope.addModelPane[idx].modelValueHistory.length > 0) {
            for (var a = 0; a < $scope.addModelPane[idx].modelValueHistory.length; a++) {
                if ($scope.addModelPane[idx].modelValueHistory[a].check == true) {
                    if (amp.length > 0) {
                        for (var b = 0; b < amp.length; b++) {
                            if ($scope.addModelPane[idx].modelValueHistory[a].attrValue == amp[b]) {
                                count1++
                            }
                        }
                        if (count1 == 0) {
                            amp.push($scope.addModelPane[idx].modelValueHistory[a].attrValue);
                        }
                    } else {
                        amp.push($scope.addModelPane[idx].modelValueHistory[a].attrValue);
                    }
                }
            }
        }
        for (var i = 0; i < amp.length; i++) {
            if ($scope.addModelPane[idx].modelValue == amp[i]) {
                count++
            }
        }
        if (count == 0) {
            if ($scope.addModelPane[idx].modelValue != null && $scope.addModelPane[idx].modelValue != undefined) {
                amp.push($scope.addModelPane[idx].modelValue);
                // var sendData={
                // "data": {
                // "goodsId": $scope.goods.catId,
                // "attrValue": $scope.addModelPane[idx].modelValue,
                // "attrNameId": $scope.addModelPane[idx].selectValueId
                // }
                // };
                // $.ajax({
                // type: "post",
                // async:false,
                // url: "/goods/addAttributeValue/",
                // contentType:'application/json',
                // data: JSON.stringify(sendData),
                // dataType : "json",
                // success: function(data){
                // if(data.errorInfo==null){
                // $scope.addModelPane[idx].selectList=data.data.listAttr;
                // }
                // console.log(data);
                // },
                // error:function(info){
                // console.log(info);
                // }
                // });
            }
        } else {
            $scope.closeValueBox(idx);
            return;
        }
        $scope.itemTitle = [];
        for (var i = 0; i < $scope.addModelPane.length; i++) {
            if ($scope.addModelPane[i].selectValue != null && $scope.addModelPane[i].modelValueTags.length > 0) {
                $scope.itemTitle.push($scope.addModelPane[i].selectValue);
            }
        }
        createItems();
        $scope.closeValueBox(idx);
    };
    $scope.removeModelPane = function(idx) {
        if($scope.canEdit == true){
            $scope.addModelPane.splice(idx, 1);
            if ($scope.addModelNums > 0) {
                $scope.addModelNums--;
            }
            createItems();
        }
    };
    $scope.showUnify = function() {
        if($scope.canEdit == true){
            $scope.unify = true;
            $scope.multiple = false;
            $scope.goods.productSpec = 1;
        }
    };
    $scope.showMultiple = function() {
        if($scope.canEdit == true){
            if($scope.typeName == "选择分类"){
                alertBox.show("请先选择商品分类！");
                return;
            }
            $scope.unify = false;
            $scope.multiple = true;
            setTimeout(function() {
                tableWidth = $(".gp_table_head").width();
                $(".gp_table_title").width(tableWidth / 4);
            }, 50);
            $scope.goods.productSpec = 2;
        }
    };
    $scope.save = function() {
    	$scope.goods.description = editor.txt.html();
        $scope.goods.areaList = $scope.areaList;        
        $scope.goods.areaList1 = JSON.stringify($scope.goods.areaList);
        $scope.goods.mainPic1 = JSON.stringify($scope.goods.mainPic);
        var param1 = JSON.stringify($scope.goods);
        var param = JSON.parse(param1);
        $.ajax({
            type:"POST",
            url:'prizeManagementController/addPrize',
            headers: {Accept: "application/json;charset=utf-8"},
            data:param,
            dataType:'json',
            success:function(resp) {
//            	if(resp.msgcode == "Y"){
//            		alertBox.show("操作成功!");
//            	}else{
//            		alertBox.show(resp.msg);
//            	}
            	alertBox.show(resp.msg);
            },
            error:function(n){
                console.log(n);
            }
        });
//        if ($scope.goods.productSpec == 1) {
//            console.log($scope.goods);
//            var sendData = {
//                "data": $scope.goods
//            };
//            $.ajax({
//                type: "post",
//                async: false,
//                url: "/goods/addOrUpdateGoods/",
//                contentType: 'application/json',
//                data: JSON.stringify(sendData),
//                dataType: "json",
//                success: function(data) {
//                    if (data.errorInfo == null) {
//                        alertBox.show(data.success.successMsg);
//                        $state.go("app.goods.list");
//                    }
//                },
//                error: function(info) {
//                    console.log(info);
//                }
//            });
//            return;
//        }
//        var wrapLen = $(".gp_table_wrap").length;
//        var cargoNo = [],
//            price = [],
//            rest = [],
//            weight = [];
//        $(".gp_table_wrap").eq(wrapLen - 1).find(".gp_table_item").each(function() {
//            weight.push($(this).find("input").val());
//        });
//        $(".gp_table_wrap").eq(wrapLen - 2).find(".gp_table_item").each(function() {
//            rest.push($(this).find("input").val());
//        });
//        $(".gp_table_wrap").eq(wrapLen - 3).find(".gp_table_item").each(function() {
//            price.push($(this).find("input").val());
//        });
//        $(".gp_table_wrap").eq(wrapLen - 4).find(".gp_table_item").each(function() {
//            cargoNo.push($(this).find("input").val());
//        });
//        var len = 0;
//        for (var a = 0; a < $scope.addModelPane.length; a++) {
//            if ($scope.addModelPane[a].modelValueTags.length > 0) {
//                len++;
//            }
//        }
//        switch (len) {
//            case 1:
//                var array = $scope.addModelPane[0].modelValueTags;
//                for (var i = 0; i < array.length; i++) {
//                    var data = {};
//                    data[$scope.addModelPane[0].selectValueId] = $scope.addModelPane[0].modelValueTags[i];
//                    data.goodsCode = cargoNo[i];
//                    data.salePrice = price[i];
//                    data.stockQuantity = rest[i];
//                    $scope.goods.productSpecInfo.push(data);
//                }
//                break;
//            case 2:
//                var array = $scope.addModelPane[0].modelValueTags;
//                var array1 = $scope.addModelPane[1].modelValueTags;
//                var i = 0;
//                for (var a = 0; a < array.length; a++) {
//                    for (var b = 0; b < array1.length; b++) {
//                        var data = {};
//                        data[$scope.addModelPane[0].selectValueId] = array[a];
//                        data[$scope.addModelPane[1].selectValueId] = array1[b];
//                        data.goodsCode = cargoNo[i];
//                        data.salePrice = price[i];
//                        data.stockQuantity = rest[i];
//                        $scope.goods.productSpecInfo.push(data);
//                        i++;
//                    }
//                }
//                break;
//            default:
//                var array = $scope.addModelPane[0].modelValueTags;
//                var array1 = $scope.addModelPane[1].modelValueTags;
//                var array2 = $scope.addModelPane[2].modelValueTags;
//                var i = 0;
//                for (var a = 0; a < array.length; a++) {
//                    for (var b = 0; b < array1.length; b++) {
//                        for (var c = 0; c < array2.length; c++) {
//                            var data = {};
//                            data[$scope.addModelPane[0].selectValueId] = array[a];
//                            data[$scope.addModelPane[1].selectValueId] = array1[b];
//                            data[$scope.addModelPane[2].selectValueId] = array2[c];
//                            data.goodsCode = cargoNo[i];
//                            data.salePrice = price[i];
//                            data.stockQuantity = rest[i];
//                            $scope.goods.productSpecInfo.push(data);
//                            i++;
//                        }
//                    }
//                }
//        }
//        var sendData = {
//            "data": $scope.goods
//        };
//        $.ajax({
//            type: "post",
//            async: false,
//            url: "/goods/addOrUpdateGoods/",
//            contentType: 'application/json',
//            data: JSON.stringify(sendData),
//            dataType: "json",
//            success: function(data) {
//                if (data.errorInfo == null) {
//                    alertBox.show(data.success.successMsg);
//                    $state.go("app.goods.list");
//                }
//            },
//            error: function(info) {
//                console.log(info);
//            }
//        });
        console.log($scope.goods);
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
//    var reloadOrder = function() {
//        var sendData = {
//            "data": {
//                "goodsId": $stateParams.goodId
//            }
//        };
//        $.ajax({
//            type: "post",
//            url: "/goods/getGoods/",
//            contentType: 'application/json',
//            data: JSON.stringify(sendData),
//            dataType: "json",
//            success: function(data) {
//                if (data.errorInfo == null) {
//                    $scope.goods.goodsName = data.goodsName;
//                    $scope.typeName = data.catName;
//                    $scope.goods.status = data.status;
//                    $scope.goods.catId = data.catId;
//                    $scope.goods.tagId = data.tagId;
//                    $scope.goods.marketPrice = data.marketPrice;
//                    $scope.goods.goodsSn = data.goodsSn;
//                    $scope.goods.status = data.status;
//                    $scope.goods.shipFree = data.shipFree;
//                    $scope.goods.salePrice = data.salePrice;
//                    $scope.goods.goodsAttrImgIds = data.goodsImgIds;
//                    $scope.goods.goodsImgIds = data.images;
//                    $scope.goods.description = data.description;
//                    $scope.goods.stockQuantity=data.stockQuantity;
//                    var goodPics = data.goodsImgIds;
//                    var weight = data.weight;
//                    var rest = data.rest;
//                    var price = data.price;
//                    var cargoNo = data.cargoNo;
//                    $scope.canEdit = true;
//                    if (data.productSpec == 1) {
//                        $scope.showUnify();
//                    } else {
//                        $scope.showMultiple();
//                    }
//                    $scope.canEdit = false;
//                    for (var i = 0; i < $scope.goodsTags.length; i++) {
//                        if ($scope.goodsTags[i].tagName == data.tagName && $scope.goodsTags[i].tagId == data.tagId) {
//                            $scope.goodsTags[i].check = true;
//                        }
//                    }
//                    if (data.data.length > 0) {
//                        $scope.addModelPane = data.data;
//                        $scope.itemTitle = [];
//                        for (var i = 0; i < $scope.addModelPane.length; i++) {
//                            if ($scope.addModelPane[i].selectValue != null && $scope.addModelPane[i].modelValueTags.length > 0) {
//                                $scope.itemTitle.push($scope.addModelPane[i].selectValue);
//                            }
//                        }
//                        setTimeout(function() {
//                            createItems();
//                            var wrapLen = $(".gp_table_wrap").length;
//                            if (weight) {
//                                if (weight.length > 0) {
//                                    weight.forEach(function(val, idx) {
//                                        $(".gp_table_wrap").eq(wrapLen - 1).find(".gp_table_item").eq(idx).find("input").val(val);
//                                    });
//                                }
//                            }
//                            if (rest.length > 0) {
//                                rest.forEach(function(val, idx) {
//                                    $(".gp_table_wrap").eq(wrapLen - 2).find(".gp_table_item").eq(idx).find("input").val(val);
//                                });
//                            }
//                            if (price.length > 0) {
//                                price.forEach(function(val, idx) {
//                                    $(".gp_table_wrap").eq(wrapLen - 3).find(".gp_table_item").eq(idx).find("input").val(val);
//                                });
//                            }
//                            if (cargoNo.length > 0) {
//                                cargoNo.forEach(function(val, idx) {
//                                    $(".gp_table_wrap").eq(wrapLen - 4).find(".gp_table_item").eq(idx).find("input").val(val).attr("readonly","readonly");
//                                });
//                            }
//                            if(goodPics.length>0){
//                                for(var z=0;z<goodPics.length;z++){
//                                    var a=goodPics[z].selectValue;
//                                    var b=goodPics[z].modelValue;
//                                    $("#" + a + b).attr("src", goodPics[z].imageUrl).css("display", "block");
//                                }
//                            }
//                            editor.txt.html($scope.goods.description);
//                        }, 100);
//                    }
//                    
//                    // 图片
//                    var images = data.images;
//                    console.log(images.length);
//                    for (var i = 0; i < images.length; i++) {
//                        $scope.goods.mainPic.push(images[i]);
//                    }
//                    $scope.$apply();
//                } else {
//                    alertBox.show(data.errorInfo);
//                }
//            },
//            error: function(info) {
//                console.log(info);
//            }
//        });
//    };
//    if ($stateParams.goodId != null && $stateParams.goodId != undefined) {
//        reloadOrder();
//        $scope.canEdit = false;
//    }
}]);
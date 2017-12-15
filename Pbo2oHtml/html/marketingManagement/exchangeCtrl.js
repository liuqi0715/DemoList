var app = angular.module("prize", []);
app.controller('listCtrl', ['$scope','$http','pageList', 'alertBox', function($scope, $http, pageList, alertBox) {
    $scope.currentState = 1;
    $scope.currentPage = 1;
    $scope.initPage = 0;
    $scope.totalPage = 1;
    $scope.searchPage = null;
    $scope.searchObj = {};
    $scope.searchObj.shippingStatus = {};
    $scope.searchObj.shippingMode = {};
    $scope.searchObj.laborName = {};
    $scope.searchObj.shippingStatus.shippingStatusId = null;
    $scope.searchObj.shippingMode.shippingMode = null;
    $scope.searchObj.laborName.userId = null;
    $scope.editBoxShow = false;
    $scope.selectedGood = {};
    $scope.selectedGood.areaId = null;
    $scope.goods = {};
    $scope.goods.provinceId = null;
    $scope.goods.cityId = null;
    $scope.goods.areaId = null;
    $scope.provinceShow = false;
    $scope.cityShow = false;
    $scope.areaShow = false;
    $scope.laborShow = false;
    $scope.shipShow = false;
    $scope.modelShow = false;
    $scope.staffShow = false;
    $scope.provinceSlc = "省份";
    $scope.citySlc = "城市";
    $scope.areaSlc = "区域";
    $scope.labor = [];
    $scope.shippingStatusShow = false;
    $scope.shippingModelShow = false;
    $scope.itemTitle = ["奖品名称","奖品类型","积分值","用户","收货人姓名","收货人地址","收货人电话","配送状态","签收状态","订单生成时间"];
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
        $scope.pageCount = 6;
    }else{
        $scope.pageCount = 10;
    };
    $scope.shippingStatus = [
        {
            shippingStatus:"待发货",
            shippingStatusId:0
        },{
            shippingStatus:"已发货",
            shippingStatusId:1
        }
    ];
    $scope.shippingModel = [
        {
            shippingModel:"未签收",
            shippingMode:2
        },{
            shippingModel:"已签收",
            shippingMode:1
        }
    ];
    $scope.toggleState = function(){
    	$scope.shipShow = !$scope.shipShow;
    };
    $scope.toggleMode = function(){
    	$scope.modelShow = !$scope.modelShow;
    };
    $scope.toggleLabor = function(){
        $scope.staffShow = !$scope.staffShow;
        if($scope.staffShow == true){
            $.ajax({
                type:"POST",
                url:'prizesExchange/getDeleveUser',
                headers: {Accept: "application/json;charset=utf-8"},
                dataType:'json',
                success:function(resp) {
                    console.log(resp);
                    $scope.deliveryStaff = $scope.deliveryStaffCopy = resp;
                    $scope.$apply();
                },
                error:function(n){
                    console.log(n);
                }
            });
        }
    }
    $scope.seachStaff = function(){
        var keyWord = $scope.searchObj.laborName.contact;
        if(keyWord.length != 0){
            var array = [];
            for(var i = 0; i<$scope.deliveryStaffCopy.length; i++){
                var str = $scope.deliveryStaffCopy[i].contact;
                if(str.indexOf(keyWord) != -1){
                    array.push($scope.deliveryStaffCopy[i]);
                }
            }
            $scope.deliveryStaff = array;
        }else{
        	$scope.deliveryStaff = $scope.deliveryStaffCopy;
        }
    };
    $scope.slcStaff = function(staff){
    	$scope.searchObj.laborName = staff;
        $scope.staffShow = false;
    };
    $scope.slcStatus = function(status){
    	$scope.searchObj.shippingStatus = status;
        $scope.shipShow = false;
    };
    $scope.slcModel = function(model){
    	$scope.searchObj.shippingMode = model;
        $scope.modelShow = false;
    };
    var getProvince = function(){
        $.ajax({
            type:"POST",
            url:'areaController/getAllProvinceAll',
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
            url:'areaController/getCityByProvinceIdAll',
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
            url:'areaController/getAreaByCityIdAll',
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
        $scope.goods.cityId = null;
        $scope.citySlc = "城市";
        $scope.areaSlc = "区域";
        $scope.provinceSlc = province.provinceName;
        $scope.provinceShow = false;
        $scope.selectedGood.areaName = $scope.provinceSlc;
    };
    $scope.slcCity = function(city){
        $scope.goods.cityId = city.cityId;
        $scope.goods.areaId = null;
        $scope.areaSlc = "区域";
        $scope.citySlc = city.cityName;
        $scope.cityShow = false;
        $scope.selectedGood.areaName = $scope.provinceSlc+$scope.citySlc;
    };
    $scope.slcArea = function(area){
        $scope.goods.areaId = area.areaId;
        $scope.areaSlc = area.areaName;
        $scope.areaShow = false;
        $scope.selectedGood.areaId = area.areaId;
        $scope.selectedGood.areaName = $scope.provinceSlc+$scope.citySlc+$scope.areaSlc;
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
                "custName":$scope.searchObj.custName1,
                "shippingStatus":$scope.searchObj.shippingStatus.shippingStatusId,
                "status":$scope.searchObj.shippingMode.shippingMode,
                "deliveryUser":$scope.searchObj.laborName.userId
        };
        $.ajax({
            type:"POST",
            url:'prizesExchange/prizesExchangeMain',
            headers: {Accept: "application/json;charset=utf-8"},
            data:param,
            dataType:'json',
            success:function(resp) {
                $scope.totalPage = resp.totalPage;
                $scope.creatList($scope.initPage,$scope.totalPage);
                var datas = resp.rows;
                if(verification("exchangeManagement","sendPrizes")){
                    for(var a = 0;a < datas.length;a++){
                    	datas[a].canEdit = 1;
                    };
                }else{
                    for(var a = 0;a < datas.length;a++){
                    	datas[a].canEdit = 0;
                    };
                }
                $scope.goodsList = datas;
                console.log($scope.goodsList);
                $scope.$apply();
            },
            error:function(n){
                console.log(n);
            }
        });
        
    };
    $scope.getGoodsList();
    $scope.edit = function(good) {
        $scope.editBoxShow = true;
        $scope.selectedGood = good;
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
//    $scope.getAllTags=function(){
//        var sendJson = {
//            "data": {}
//        };
//        var param = JSON.stringify(sendJson);
//    };
//    $scope.checkTags=function(idx){
//        for(var i=0;i<$scope.goodsTagsGroup.length;i++){
//            $scope.goodsTagsGroup[i].check=false;
//        }
//        $scope.goodsTagsGroup[idx].check=true;
//        $scope.selectedTagId=$scope.goodsTagsGroup[idx].tagId;
//    };
    $scope.showLabor = function(){
        $scope.laborShow = !$scope.laborShow;
        if($scope.laborShow == true){
            $.ajax({
                type:"POST",
                url:'prizesExchange/getDeleveUser',
                headers: {Accept: "application/json;charset=utf-8"},
                dataType:'json',
                success:function(resp) {
                    console.log(resp);
                    $scope.labor = $scope.laborCopy = resp;
                    $scope.$apply();
                },
                error:function(n){
                    console.log(n);
                }
            });
        }
    }
    $scope.slcLabor = function(labor){
        $scope.selectedGood.deliveryUser = labor.contact;
        $scope.selectedGood.deliveryUserId = labor.userId;
        $scope.laborShow = false;
    };
    $scope.seachLabor = function(){
        var keyWord = $scope.selectedGood.deliveryUser;
        if(keyWord.length != 0){
            var array = [];
            for(var i = 0; i<$scope.laborCopy.length; i++){
                var str = $scope.laborCopy[i].contact;
                if(str.indexOf(keyWord) != -1){
                    array.push($scope.laborCopy[i]);
                }
            }
            $scope.labor = array;
        }else{
            $scope.labor = $scope.laborCopy;
        }
    };
    $scope.editTagsSave=function(){
        if($scope.selectedGood.areaId == null){
            alertBox.show("请选择完整区域!");
            return;
        }
        var param = $scope.selectedGood;
        $.ajax({
            type:"POST",
            url:'prizesExchange/updateExchange',
            headers: {Accept: "application/json;charset=utf-8"},
            data:param,
            dataType:'json',
            success:function(resp) {
                console.log(resp);
                $scope.labor = resp.data;
                $scope.$apply();
                if(resp.msgCode == "Y"){
                    alertBox.show(resp.msg);
                    $scope.closeEditTagBox();
                    $scope.getGoodsList();
                }else{
                    alertBox.show(resp.msg);
                }
                
            },
            error:function(n){
                console.log(n);
            }
        });
    };
    $scope.editTagsCancel=function(){
        $scope.closeEditTagBox();
    };
    $scope.closeEditTagBox=function(){
        $scope.editBoxShow=false;
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
    editor.customConfig.uploadImgServer = '/upload/uploadGoodsDetailImg';
    editor.customConfig.uploadFileName = 'file';
    editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
            insertImg(result.data.imgList[0].imgUrl);
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
    $scope.goods.expPic = null;
    $scope.goods.catId = null;
    $scope.goods.catId1 = null;
    $scope.goods.brandId = 1;
    $scope.goods.productSpec = 1;
    $scope.goods.productSpecInfo = [];
    $scope.goods.goodsImgIds = [];
    $scope.goods.goodsAttrImgIds = [];
    $scope.goods.goodsId = null;
    $scope.pageShow = function(){
        $("#pEdit").scrollTop(0);
        $("#pEdit").css("z-index",10);
        setTimeout(function(){
            $scope.paneShow = true;
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
                "imgId":$scope.goods.mainPic[idx].imageId
            }
        };
        $scope.goods.mainPic.splice(idx, 1);
        $.ajax({
            type: "post",
            url: "/goods/deleteGoodsImg/",
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
                    catName:"实物"
                },
                {
                    check:false,
                    catName:"虚物"
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
            url: "/upload/UploadAction", // 上传文件的路径
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
                if (datas.errorInfo == null) {
                    if (datas.data.imgList.length > 0) {
                        if ($scope.goods.mainPic.length < 13) {
                            $scope.goods.mainPic.push(datas.data.imgList[0]);
                            var tempArray = [],tempArray1 = [];
                            for(var i=0;i<12;i++){
                                tempArray.push($scope.goods.mainPic[i]);
                            }
                            $scope.goods.mainPic = tempArray;
                            $scope.goods.goodsImgIds.push(datas.data.imgList[0].imageId);
                            for(var j=0;j<12;j++){
                                tempArray1.push($scope.goods.goodsImgIds[j]);
                            }
                            $scope.goods.goodsImgIds = tempArray1;
                        }
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

    function createItems() {
        $scope.items = [];
        var len = 0;
        for (var a = 0; a < $scope.addModelPane.length; a++) {
            if ($scope.addModelPane[a].modelValueTags.length > 0) {
                len++;
            }
        }
        switch (len) {
            case 1:
                var array = $scope.addModelPane[0].modelValueTags;
                var wrap = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap1");
                var wrap1 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap2");
                var wrap2 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap3");
                var wrap3 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap4");
                var wrap4 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap5");
                for (i = 0; i < array.length; i++) {
                    var block = $("<div class='gp_table_item'></div>").html(array[i]);
                    wrap.append(block);
                    wrap1.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
                    wrap2.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
                    wrap3.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
                    wrap4.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
                };
                $(".gp_table_body").empty().append(wrap).append(wrap1).append(wrap2).append(wrap3).append(wrap4);
                $(".gp_table_wrap").width(tableWidth / 5);
                setTimeout(function() {
                    $(".gp_table_title").width(tableWidth / 5);
                }, 50);
                $(".gp_table_body").height(50 * array.length).css({ "line-height": 50 * array.length + "px" })
                $("#wrap1,#wrap2").find(".gp_table_item").css({ "border-bottom": "1px solid #DDDDDD", "border-right": "1px solid #DDDDDD" });
                $("#wrap3,#wrap4,#wrap5").find(".gp_table_item").css({ "border-bottom": "1px solid #DDDDDD" });
                break;
            case 2:
                var array = $scope.addModelPane[0].modelValueTags;
                var array1 = $scope.addModelPane[1].modelValueTags;
                var wrap = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap1");
                var wrap1 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap2");
                var wrap2 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap3");
                var wrap3 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap4");
                var wrap4 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap5");
                var wrap5 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap6");
                for (i = 0; i < array.length; i++) {
                    var block = $("<div class='gp_table_item'></div>").html(array[i]);
                    var divWrap = $("<div class='gp_table_con'></div>");
                    for (j = 0; j < array1.length; j++) {
                        var block1 = $("<div class='gp_table_item'></div>").html(array1[j]);
                        divWrap.append(block1);
                        wrap2.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
                        wrap3.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
                        wrap4.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
                        wrap5.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
                    }
                    wrap.append(block);
                    wrap1.append(divWrap);
                };
                $(".gp_table_body").empty().append(wrap).append(wrap1).append(wrap2).append(wrap3).append(wrap4).append(wrap5);
                $(".gp_table_wrap").width(tableWidth / 6);
                setTimeout(function() {
                    $(".gp_table_title").width(tableWidth / 6);
                }, 50);
                $(".gp_table_body").height(50 * array.length * array1.length);
                $("#wrap1").find(".gp_table_item").height(49 * array1.length + array1.length).css({ "line-height": (49 * array1.length + array1.length) + "px", "border-bottom": "1px solid #DDDDDD", "border-right": "1px solid #DDDDDD" });
                $("#wrap2").find(".gp_table_item").height(49).css({ "border-bottom": "1px solid #DDDDDD" });
                $("#wrap2").find(".gp_table_con").height(49 * array1.length + array1.length).css({ "border-right": "1px solid #DDDDDD", "line-height": (49 * array1.length + array1.length) + "px" });
                break;
            default:
                var array = $scope.addModelPane[0].modelValueTags;
                var array1 = $scope.addModelPane[1].modelValueTags;
                var array2 = $scope.addModelPane[2].modelValueTags;
                var wrap = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap1");
                var wrap1 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap2");
                var wrap2 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap3");
                var wrap3 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap4");
                var wrap4 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap5");
                var wrap5 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap6");
                var wrap6 = $("<div></div>").addClass("gp_table_wrap").attr("id", "wrap7");
                for (i = 0; i < array.length; i++) {
                    var block = $("<div class='gp_table_item'></div>").html(array[i]);
                    var divWrap = $("<div class='gp_table_con'></div>");
                    var divWrap3 = $("<div class='gp_table_con1'></div>");
                    for (j = 0; j < array1.length; j++) {
                        var block1 = $("<div class='gp_table_item'></div>").html(array1[j]);
                        divWrap.append(block1);
                        var divWrap1 = $("<div class='gp_table_con'></div>");
                        for (k = 0; k < array2.length; k++) {
                            var block2 = $("<div class='gp_table_item'></div>").html(array2[k]);
                            divWrap1.append(block2);
                            wrap3.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
                            wrap4.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
                            wrap5.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
                            wrap6.append("<div class='gp_table_item'><input type='text' placeholder='请输入' /></div>");
                        }
                        divWrap3.append(divWrap1);
                    }
                    wrap.append(block);
                    wrap1.append(divWrap);
                    wrap2.append(divWrap3);
                };
                $(".gp_table_body").empty().append(wrap).append(wrap1).append(wrap2).append(wrap3).append(wrap4).append(wrap5).append(wrap6);
                $(".gp_table_wrap").width(tableWidth / 7);
                setTimeout(function() {
                    $(".gp_table_title").width(tableWidth / 7);
                }, 50);
                $(".gp_table_body").height(50 * array.length * array1.length * array2.length);
                $("#wrap1").find(".gp_table_item").height(50 * array1.length * array2.length).css({ "line-height": (50 * array1.length * array2.length - 1) + "px", "border-bottom": "1px solid #DDDDDD", "border-right": "1px solid #DDDDDD" });
                $("#wrap2").find(".gp_table_item").height(50 * array2.length).css({ "line-height": 50 * array2.length + "px", "border-bottom": "1px solid #DDDDDD" });
                $("#wrap2").find(".gp_table_con").height(50 * array1.length * array2.length).css({ "line-height": $("#wrap2").find(".gp_table_item").height()*array1.length + "px", "border-right": "1px solid #DDDDDD" });
                $("#wrap3").find(".gp_table_item").height(49).css({ "line-height": 49 + "px" });
                $("#wrap3").find(".gp_table_con").height(50 * array2.length).css({ "border-bottom": "1px solid #DDDDDD" });
                $("#wrap3").height(50 * array.length * array1.length * array2.length -2 ).css({ "border-right": "1px solid #DDDDDD" });
        }
    };
    $scope.bulk = function() {
        var len = $(".gp_table_wrap").length;
        console.log($(".gp_table_wrap").eq(len - 3).find("gp_table_item").find("input"));
        if ($scope.bulkDatas.price != null && $scope.bulkDatas.price != undefined) {
            $(".gp_table_wrap").eq(len - 3).find(".gp_table_item").find("input").val($scope.bulkDatas.price);
        }
        if ($scope.bulkDatas.rest != null && $scope.bulkDatas.rest != undefined) {
            $(".gp_table_wrap").eq(len - 2).find(".gp_table_item").find("input").val($scope.bulkDatas.rest);
        }
        if ($scope.bulkDatas.weight != null && $scope.bulkDatas.weight != undefined) {
            $(".gp_table_wrap").eq(len - 1).find(".gp_table_item").find("input").val($scope.bulkDatas.weight);
        }
    };
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
        var sendData = {
            "data": {
                "prizeId": null,
            }
        };
        var param = JSON.stringify(sendData);
        $.ajax({
            type:"POST",
            url:'prizeManagementController/addPrize',
            headers: {Accept: "application/json;charset=utf-8"},
            data:param,
            dataType:'json',
            success:function(resp) {
                console.log(resp);
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
    var render = function(){
        var param = {
            //"prizeId": null,
            "exchangeId":"4"
        };
        $.ajax({
            type:"POST",
            url:'prizesExchange/updateExchange',
            headers: {Accept: "application/json;charset=utf-8"},
            data:param,
            dataType:'json',
            success:function(resp) {
                console.log(resp);
            },
            error:function(n){
                console.log(n);
            }
        });
    };
}]);
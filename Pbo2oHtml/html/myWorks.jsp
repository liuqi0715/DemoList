<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<HTML>
<HEAD>
<base href="${base_path}/" />
	<TITLE>送货单</TITLE>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<link rel="stylesheet" type="text/css" href="themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="themes/icon.css">
	<link rel="stylesheet" type="text/css" href="themes/demo.css">
	<link rel="stylesheet" type="text/css" href="css/timeline.css">
	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="js/locale/easyui-lang-zh_CN.js"></script>
    <script type="text/javascript" src="js/ajaxfileupload.js"></script>
    <script type="text/javascript" src="js/timeline.js"></script>
	<style type="text/css">
		.report-title {
		    color: #00A8BD;
		    font: bold 34px "黑体";
		    margin: 0.5em 0;
		    text-align: center;
		}
	</style>
<script type="text/javascript">
$(function () {
    $('#dg').datagrid({
		title: '我的任务',
        iconCls: 'icon-save',
        width:'100%',
    	height: document.body.scrollHeight*0.88,
    	url: 'UserWork/getUserWork',
    	fitColumns:false,//自动使列适应表格宽度以防止出现水平滚动。
        nowrap: true,
    	singleSelect: true,
        autoRowHeight: false,
    	multiSort : true,
        striped: true,
        collapsible: true,
        remoteSort: true,
        rownumbers:true,
        idField: "noteNo",
        columns: [[
            {field:'noteId', title: '订单类型ID',hidden:true },
            {field:'noteTypeId', title: '订单类型ID',hidden:true },
            {field:'noteType',title:'订单类型',width:100},
            {field:'noteNo',title:'单号',width:200,
            	formatter: function (value, row, index) {
            		
            		return '<a href="javascript:;" onclick="getView('+row.noteId+',\''+value+'\','+row.noteTypeId+')">'+value+'</a>';
            	}
            },
            {field:'Op',title:'任务',width:100}
        ]],
        onLoadSuccess:function(){
        	  $(this).datagrid('clearChecked');
       	},
        pagination: false
    });
});
function getView(orderId,orderNo,orderType){
	var url ="";
	var title ="";
	if (orderType==1) {
		url="transferNote";
		title ="调拨单";
	}else if (orderType==2) {
		url="outstock";
		title ="出库单信息";
	}else if (orderType==3) {
		url="TransportOrder";
		title ="送货单";
	}else if (orderType==4) {
		url="salesList";
		title ="销售单";
	}
	 var fag = 0;
	 if (parent.$('#tabs').tabs('tabs').length>0) {
		 for (var i = 0; i < parent.$('#tabs').tabs('tabs').length; i++) {
			 var tab = parent.$('#tabs').tabs('getTab',i).panel('options').title;
			 if (title == parent.$('#tabs').tabs('getTab',i).panel('options').title) {
				 parent.$('#tabs').tabs('select',i);
				var tab = parent.$('#tabs').tabs('getTab',i);
				parent.$("#tabs").tabs('update',{ 
	                tab: tab, 
	                options: { 
		                title: title,
		                content: "<iframe scrolling='auto' src='" + url +"?orderId="+orderId+"&orderNo="+orderNo+ "' frameborder='0' name='main' style='width:100%;height:100%; 'border='0'></iframe>"
	                }
	            }); 
				 fag++;
			}
		}
		 if (fag == 0) {
			 if(parent.$('#tabs').tabs('tabs').length==10){
					var tab = parent.$('#tabs').tabs('getTab',9);
					parent.$("#tabs").tabs('update',{ 
		                tab: tab, 
		                options: { 
			                title: title,
			                content: "<iframe scrolling='auto' src='" + url +"?orderId="+orderId+"&orderNo="+orderNo+ "' frameborder='0' name='main' style='width:100%;height:100%; 'border='0'></iframe>"
		                }
		            }); 
					 fag++;
				}
		}
	}
 	if (fag > 0) {
		return;
	}
	parent.$('#tabs').tabs("add", {
	      title:title,
	      content: "<iframe scrolling='auto' src='" + url +"?orderId="+orderId+"&orderNo="+orderNo+ "' frameborder='0' name='main' style='width:100%;height:100%; 'border='0'></iframe>",
          fit: true,  
          closable: true,  
	});
}

</script>
  <body>
	<div id="dgid" style="margin-left:auto; margin-right:auto;float: left;width: 38%">
		<div style="margin-left:auto; margin-right:auto;width:97%">
			<table id="dg" style="align:center"> 
			</table> 
		</div>
	</div>
  </body>
 
</HTML>
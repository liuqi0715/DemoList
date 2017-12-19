<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<!DOCTYPE HTML>
<html>
<head>
<link rel="stylesheet" type="text/css" href="themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="themes/icon.css">
<link rel="stylesheet" type="text/css" href="themes/demo.css">
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="js/locale/easyui-lang-zh_CN.js"></script>
<title>修改密码</title>



<script type="text/javascript">

$(document).ready(function() {
	var bgH = window.innerHeight;
	var bgW = window.innerWidth;
	$("body").css({"width":bgW+"px",})
	console.log(bgW,bgH,"++++++浏览器可视窗口的宽高")
	$("#error").hide();
	/* $('#oldPwd').blur(function(){
		var oldPwd = $('#oldPwd').val();
		$.ajax({
			url : "/validationOldPwd",
			type : "post",
			data : {
				oldPwd:oldPwd
			},
			dataType : "json",
			beforeSend : function() {
			},
			success : function(data) {
				if (data.hasOwnProperty("code")) {
					if(data.code == "1") {
						$("#error").hide();
					}else if (data.code == "2") {
						$("#error").show();
						$("#error").html(data.msg);
					}
				} else {
					$.messager.alert('提示','操作失败!','info');
				}
			}
		}); 
	}); */
	var reg = /^[a-z\d]{6,20}$/i
	var newPwd;
	var newPwd2;
	var submit=false;
	$('#newPwd').keypress(function(e){
		if (e.keyCode == 32) {
			return false;
		}
	});
	$('#newPwd').keyup(function(e){
		 newPwd = $('#newPwd').val();
		 newPwd2 = $('#newPwd2').val();
		if (e.keyCode != 32) {
			/* if (newPwd.length < 6) {
				$("#error").show();
				$("#error").html("新密码不可小于六位！");
			}else{
				$("#error").hide();
			} */
			if(reg.test(newPwd)==false){
				console.log(reg.test(newPwd),"+++")
				$("#error").show();
				$("#error").html("新密码必须为6-20位的数字或者字母！");
			}else if(newPwd != newPwd2){
				$("#error").show();
				$("#error").html("两次输入的密码不一致！");
			}else{
				$("#error").hide();
				submit =true;
			}
		}
	});
	$('#newPwd2').keypress(function(e){
		if (e.keyCode == 32) {
			return false;
		}
	});
	$('#newPwd2').keyup(function(e){
	
		 newPwd2 = $('#newPwd2').val();
		 newPwd = $('#newPwd').val();
		var new1 = reg.test(newPwd)
		var new2 = reg.test(newPwd2)
		if (e.keyCode != 32) {
			/* if (newPwd != newPwd2) {
				$("#error").show();
				$("#error").html("两次输入的密码不一致！");
			}else{
				$("#error").hide();
			} */
			if(new1==false||new2==false){
				$("#error").show();
				$("#error").html("新密码必须为6-20位的数字或者字母");
			}else if(newPwd != newPwd2){
				$("#error").show();
				$("#error").html("两次输入的密码不一致！");
			}else{
				$("#error").hide();
				submit =true;
			}
		}
	});
});
function submitData2(){
	$.messager.alert('提示',"您确认修改密码吗？",'info',function () {
		submitData2()
    });
}
function submitData(){
	var reg = /^[a-z\d]{6,20}$/i
	var oldPwd = $('#oldPwd').val();
	var newPwd = $('#newPwd').val();
	var newPwd2 = $('#newPwd2').val();
	var new1 = reg.test(newPwd)
	var new2 = reg.test(newPwd2)
	if(new1==false||new2==false){
		$("#error").show();
		$("#error").html("新密码必须为6-20位的数字或者字母");
	}else if(newPwd != newPwd2){
		$("#error").show();
		$("#error").html("两次输入的密码不一致！");
	} else{
		$.messager.alert('提示',"您确认修改密码吗？",'info',function () {
			$.ajax({
				url : "/updatePwd",
				type : "post",
				data : {
					oldPwd:oldPwd,
					newPwd:newPwd
				},
				dataType : "json",
				beforeSend : function() {
				},
				success : function(data) {
						if(data.code == "1") {
							$.messager.alert('提示',data.msg,'info',function () {
	        					location.reload();
	        		        });
						}else if (data.code == "2") {
							$("#error").show();
							$("#error").html(data.msg);
						}
				}
			});
			
	    });
	
	}
}
 	/* function submitData(){
		var oldPwd = $('#oldPwd').val();
		var newPwd = $('#newPwd').val();
		var newPwd2 = $('#newPwd2').val();
		if (oldPwd.length == 0) {
			$("#error").show();
			$("#error").html("请输入原密码！");
			return;
		}
		if (newPwd.length < 6) {
			$("#error").show();
			$("#error").html("新密码不可小于六位！");
			return ;
		}
		if (newPwd.length == 0) {
			$("#error").show();
			$("#error").html("请输入新密码！");
			return;
		}
		if (newPwd2.length == 0) {
			$("#error").show();
			$("#error").html("请确认原密码！");
			return;
		}
		$.ajax({
			url : "/updatePwd",
			type : "post",
			data : {
				oldPwd:oldPwd,
				newPwd:newPwd
			},
			dataType : "json",
			beforeSend : function() {
			},
			success : function(data) {
					if(data.code == "1") {
						$.messager.alert('提示',data.msg,'info',function () {
        					location.reload();
        		        });
					}else if (data.code == "2") {
						$("#error").show();
						$("#error").html(data.msg);
					}
			}
		});
	}  */
	
</script>

</head>
<style>
html,body{height: 100%;width: 100%;margin:0;padding:0;}  
#bodyPwd{  
    background:url(../images/pwdImg/beijing.png)no-repeat;  
    width:100%;  
    height:100%;  
    background-size:100% 100%;  
    position:fixed;
    left:0;
    top：50px;
    bottom:0;
    right:0;  
    /* filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='bg-login.png',sizingMethod='scale');   */
}  
</style>
<body>
<div style="margin-left:auto; margin-right:auto;"> 
	<div id="w">
		<form action="congfigSearch/saveCongfig" method="post" id="form1">
		<div align="center"style="width: 500px;height: 400px;" id="formCon" >
			<div class="logo">
				<img src="images/pwdImg/logo.png" alt="logo">
			</div>
			<table align="center" width="80%" style="margin-top: 0px;" id="tableInput">
				<tr>
					<!-- <td align="right" width="100px;" height="20px">
					</td> -->
					<td align="left" width="350px;">
						 <div id="error" style="color: red;text-align: center;">222</div>
					</td>
				</tr>
				<tr>
					<!-- <td align="right" width="100px;">
						 <span>原密码 :</span>
					</td> -->
					<td align="center" colspan="6">
						<input id="oldPwd" type="password" placeholder="请输入原密码" value="" 
							name="oldPwd" class="input-text-password input-click"/>
							<!-- <font color="red">*</font> -->
					</td>
				</tr>
				<tr>
					<!-- <td align="right" width="100px;">
						 <span>新密码 :</span>
					</td> -->
					<td align="center" colspan="6">
						<input id="newPwd" type="password" value="" placeholder="请输入新密码"
							name="newPwd"  class="input-text-password input-click" />
							<!-- <font color="red">*</font> -->
					</td>
				</tr>
				<tr>
					<!-- <td align="right" width="100px;">
						 <span>确认密码 :</span>
					</td> -->
					<td align="center" colspan="6">
						<input id="newPwd2" type="password" value="" placeholder="请确认新密码"
							name="newPwd2"  class="input-text-password input-click"/>
							<!-- <font color="red">*</font> -->
					</td>
				</tr>
				<tr>
					<td align="center" colspan="6">
						<div align="center">
							<input  type="button" id="sub" value="提交" onclick="submitData();"/>
						</div>
					</td>
				</tr>
				</table>
				</div>
			</form>
	</div>
</div>
</body>
</html>
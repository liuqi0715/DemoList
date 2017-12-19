
function getDataUrlHead (){
	return "http://192.168.0.58:8888";
}
function getUrl(url){
	url = url.trim();
	if(url.split('')[0] == "/"){
		url = getDataUrlHead() + url;
	}else{
		url = getDataUrlHead() + "/" + url;
	}
	return url;
}
function setOrgId(orgId){
	localStorage.setItem("orgId",orgId);
}

function getOrgId(){
	return getLogin().orgId;
}
function setLogin(login){
	localStorage.setItem("login",login);
}

function getLogin(){
	return  JSON.parse(localStorage.getItem("login"));
}
function setMenu(menu){
	localStorage.setItem("menu",menu);
}
function getMenu(){
	var menu = localStorage.getItem("menu");
	if(menu == null){
		window.location.href = './login.html';
	}
	return menu;
}
function setLoginToken(loginToken){
	localStorage.setItem("loginToken", loginToken);
}
function getLoginToken(){
	return localStorage.getItem("loginToken");
}
function setRolBtn(rolBtn){
	localStorage.setItem("rolBtn",rolBtn);
}
function getRolBtn(){
	return localStorage.getItem("rolBtn");
}
var rolBtn = eval('(' + getRolBtn() + ')');    

function verification(menu,item){
	var bool = false;
	if(rolBtn.hasOwnProperty(menu)){
		var m = eval('rolBtn.' + menu);
		if(m.hasOwnProperty(item)){
			bool = true;
		}
	}
	return bool;
}
(function($){
    //备份jquery的ajax方法
    var _ajax=$.ajax
    //重写jquery的ajax方法
    $.ajax=function(opt){
        //备份opt中error和success方法
        var fn = {
            error:function(XMLHttpRequest, textStatus, errorThrown){},
            success:function(data, textStatus){},
            systemError:function(data, textStatus){
            	try {
            		if(document.getElementsByClassName("messager-icon messager-error").length<1){
            			$.messager.alert('提示', data.systemErrorMessage, 'error');
            		}
				} catch (e) {
					try {
						if(document.getElementsByClassName("login-error").length>0){
							$('.loading').hide();
		        			$(".login-error").show();
							$(".login-error").html(data.systemErrorMessage);
						}
					} catch (e) {
						// TODO: handle exception
						alert(data.systemErrorMessage);
					}
					
				}
            }
        }
        if(opt.error){
            fn.error=opt.error;
        }
        if(opt.success){
            fn.success=opt.success;
        }
        if(opt.systemError){
            fn.systemError=opt.systemError;
        }
        if(!opt.hasOwnProperty("data")){
        	opt.data = {};
        }
        if(opt.data instanceof FormData){
        	opt.processData = false;
        	opt.contentType = false;
        	opt.data.append("loginToken",getLoginToken());
        }else{
        	opt.data.loginToken = getLoginToken();
        }
        console.log(opt.data);
        opt.url = getUrl(opt.url);
        //扩展增强处理
        var _opt = $.extend(opt,{
            error:function(XMLHttpRequest, textStatus, errorThrown){
            	try {
            		if(document.getElementsByClassName("login-error").length>0){
            			window.location.href = './login.html';
					}else{
						window.location.href = '../login.html';
					}
				} catch (e) {
					window.location.href = '../login.html';
				}
//            	fn.error(XMLHttpRequest, textStatus, errorThrown);
            },
            success : function(data, textStatus,xhr){
            	console.log(xhr);
            	if (data.systemErrorCode == 10002 || data.systemErrorCode == 10005){
            		window.location.href = '../login.html';
            	}if(data.hasOwnProperty("systemErrorCode") && data.systemErrorCode != null){
					fn.systemError(data, textStatus);
            	}else{
            		if(data.data.hasOwnProperty("loginToken")){
            			setLoginToken(data.data.loginToken);
            			setMenu(data.data.menu);
            			setRolBtn(data.data.rolBtn);
            			setLogin(data.data.login);
            		}
            		fn.success(data.data, textStatus);
            	}
            },

            statusCode: {//传入statusCode对象，定义对状态码操作的方法
             900 : function() {//900为服务器返回的自定义状态码，说明当前操作没有权限
                   return;
             }
            }

        });
        _ajax(_opt);
    };
})(jQuery);


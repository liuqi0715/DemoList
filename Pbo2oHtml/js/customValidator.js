$.extend($.fn.validatebox.defaults.rules, {    
			number : {    
    	        validator : function(value){
    	            return !isNaN(value);    
    	        },    
    	        message: '输入的只能是数字'   
    	    },
    	    /**
    	     * 验证正实数
    	     */
    	    positiveNumber : {    
			    validator : function(value,param){
			    	if(isNaN(value)){
			    		return false;
			    	}
			    	value = parseFloat(value);
			    	if(param == null){
			    		return value>0;
			    	}
			    	var reg = new RegExp("^[0-9]{0,"+param[0]+"}\\.{0,1}\\d{0,"+param[1]+"}$");
			    	return reg.test(value);
			         
			    },    
				message: '输入的只能是正数且最多{1}为小数'   
			},
			fileFormat : {
				validator : function(value,param){
					var bool = false; 
					value = value.substr(value.lastIndexOf(".")+1,value.length);
					for(var i=0; i<param.length; i++){
						if(value.toUpperCase()==param[i].toUpperCase()){
							bool = true;
							break;
						}
					}
					return bool;
				},
				message: '文件格式有误' 
			}
});
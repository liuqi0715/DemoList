 $.fn.timeLines = function (data,conf) {
        this.addClass("progress");
        var dataArray=arguments[0];
        if(arguments[1]!=undefined&&arguments[1]!=null&&arguments[1]!=""){
          var confData=arguments[1];
        }else{
          var confData={
            textAlign:'left'
          };
        }
        var len=dataArray.length;
        var tl_ul=document.createElement("ul");
        var activeNums=0;
        for(var i=0;i<len;i++){
          if(dataArray[i].state==1){
            activeNums++;
          }
           var tl_li=document.createElement("li");
           if(confData.lineWidth!=undefined&&confData.lineWidth!=null&&confData.lineWidth!=""){
        	   tl_li.style.width = confData.lineWidth+"px";
           }else{
        	   tl_li.style.width = 140+"px";
           }
       	   $("tl_li").width(160);
           var tl_timeCon='<div class="progress_time">'+dataArray[i].time+'</div>';
           var barStick1='<div class="progress_bar_stick1"></div>';
           var barStick2='<div class="progress_bar_stick2"></div>';
           var circle1='<div class="progress_bigCir progress_bigCir_active notLastCir"><div class="progress_smallCir progress_smallCir_active inner-center"></div></div>';
           var circle2='<div class="progress_bigCir notLastCir"><div class="progress_smallCir inner-center"></div></div>';
           var circle3='<div class="progress_bigCir lastCir"><div class="progress_smallCir inner-center"></div></div>';
           var tl_textCon='<div class="progress_text">'+dataArray[i].text+'</div>';
           var progress_bar=$('<div class="progress_bar"></div>');
           if(confData.textAlign=='center'){
             if(dataArray[i].state==1){
                progress_bar.append(barStick1);
                progress_bar.append(circle1)
             }else{
                progress_bar.append(barStick2);
                progress_bar.append(circle2)
             };
             if(i==len-1){
                progress_bar.append(circle3);
             };
           }else if(confData.textAlign=='left'){
             if(i<len-2){
               if(dataArray[i].state==1){
                  progress_bar.append(barStick1);
                  progress_bar.append(circle1);
               }else{
                  progress_bar.append(barStick2);
                  progress_bar.append(circle2);
               };
             }
             if(i==len-2){
                if(dataArray[i].state==1){
                  progress_bar.append(circle1);
                }else{
                  progress_bar.append(circle2);
                };
                if(dataArray[i+1].state==1){
                  progress_bar.append(barStick1);
                }else{
                  progress_bar.append(barStick2);
                };
                progress_bar.append(circle3);
             };
          }
          $(tl_ul).append($(tl_li).append($(tl_timeCon)).append(progress_bar).append($(tl_textCon)));
        }
        this.append($(tl_ul));
        setTimeout(function(){
          if(confData.timefontColor!=undefined&&confData.timefontColor!=null&&confData.timefontColor!=""){
            $(".progress_time").css({"color":confData.timefontColor});
          }
          if(confData.textfontColor!=undefined&&confData.textfontColor!=null&&confData.textfontColor!=""){
            $(".progress_text").css({"color":confData.textfontColor});
          }
          if(confData.lineWidth!=undefined&&confData.lineWidth!=null&&confData.lineWidth!=""){
        	$(".progress").find("li").width(confData.lineWidth);
            $(".progress_bar").width(confData.lineWidth);
            $(".progress_bar_stick1").width(confData.lineWidth-12);
            $(".progress_bar_stick2").width(confData.lineWidth-12);
          }
          if(activeNums==len){
            $(".lastCir").addClass("progress_bigCir_active");
            $(".lastCir").find(".progress_smallCir").addClass("progress_smallCir_active");
          }else{
            if(dataArray[len-1].state==1){
              $(".lastCir").addClass("progress_bigCir_active");
              $(".lastCir").find(".progress_smallCir").addClass("progress_smallCir_active");
            }
          }
          if(confData.textAlign=='center'){
              $(".progress_time,.progress_text").css({'text-align':'center','margin-left':0});
              $(".progress").width($(".progress").find("li").width()*len+20);
          }else if(confData.textAlign=='left'){
              $(".progress_time").each(function(){
                var that=$(this);
                var textWidth=that.html().length*20;
                that.width(textWidth);
                that.css({'margin-left':-(textWidth-20)/2+'px'});
              });
              $(".progress_text").each(function(){
                var that=$(this);
                var textWidth=that.html().length*20;
                that.width(textWidth);
                that.css({'margin-left':-(textWidth-20)/2+'px'});
              });
              // $(".progress_time").eq(len-1).css({'margin-left':'-18px'});
              // $(".progress_text").eq(len-1).css({'margin-left':'-22px'});
              $(".progress").find("li").eq(len-1).width(1);
              $(".progress").width($(".progress").find("li").width()*(len-1)+10);
          }
       });
    }
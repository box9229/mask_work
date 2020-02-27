$(window).load(function(){  
    //適當延遲隱藏，提高loading效果  
    //$('#loading_all').delay(1000).hide(0);  
    $('#loading_bottom').hide(0);  
});  
var str = "";     
str+="<divid=\"loading\">";  
str+="<imgsrc=\"${ctx}photos/loading/2.gif\" class=\"img-responsive\">";  
str+="</div>";  
var htmldata = str;  
$ ('body *:first').before(htmldata);  

$(window).load(function(){  
    //為ajax繫結loading_bottom  
    $(document).ajaxStart(function(){  
        $("#loading").show();//在ajax請求開始的時候啟用loading  
    }).ajaxStop(function(){  
        $('#loading').hide(0);//在ajax請求結束後隱藏loading  
    });  
});  





$(document).ready(function(){
    $(window).load(function(){  //load函数
        $("#loading").hide();
    });
});

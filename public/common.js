/**
 * Created by vitionchen on 2016/5/6.
 */
//    正式环境
var url="http://hd2.nfapp.southcn.com/";
var winHeight;
document.addEventListener('DOMContentLoaded', function(){
    winHeight=$(document).height();
}, false);
var activityId="11";
//ajax方法 loadingShow不传时默认单个ajax加载消除loading
function getAjax(url,data,Succ,array){
    array=$.extend({
        async:"true",
        type:"get",
        cache:true
    },array);
    if(!array.loadingShow||array.loadingShow=="show"){
        loading.show();
    }
    try {
        $.ajax(
            {
                url: url,
                type:array.type,
                dataType:"json",
                cache: array.cache,
                async: array.async,
                timeout: 60000,
                data: data,
                success: function (data) {
                    if(!array.loadingShow||array.loadingShow=="hide"){
                        loading.hide();
                    }
                    if (Succ) {
                        Succ(data);
                    }
                },
                error: function (XMLHttpRequest, textStatus) {
                    tips.show("获取数据失败！");
                    if(!array.loadingShow||array.loadingShow=="hide"){
                        loading.hide();
                    }
                }
            }
        );
    }catch (e) {
        tips.show("获取数据失败！");
        if(!array.loadingShow||array.loadingShow=="hide"){
            loading.hide();
        }
        console.log(e.name + ":" + e.message);
    }
}
//rem适配，一开始加载
(function (doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
                //css默认body隐藏，加载完适配后展现
                doc.body.style.display="block";
            };
        if (!doc.addEventListener) return;
    //recalc();
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

//等待loading
var loadStat="";                            //用于判断状态是否停止
var loadTime=1;                            //用于判断帧数
var loading={
    init:function(){
        if($(".load_box").length==0){
            var str='<div class="load_box"> <div class="load loading"> <div class="loading_ball active_ball"></div> <div class="loading_ball"></div> <div class="loading_ball"></div> </div> </div>';
            $("body").append(str);
            $(".loading").css("top",(winHeight-1.8*$(document).width()/6.4)/2+"px");
            touchNotMove($(".load_box"));
        }
    },
    //loading展现
    show:function(){
        loading.init();
        var $loadBox=$(".load_box");
        if($loadBox.is(":visible")){
            return;
        }
        $loadBox.show();
        loadStat="start";
        var $loadingBall=$(".loading_ball");
        var init=setInterval(function(){
            if(loadStat=="stop"){
                clearInterval(init);
                $loadingBall.removeClass("active_ball");
                $loadingBall.eq(0).addClass("active_ball");
                loadTime=1;
            }else{
                var num=loadTime%3;
                $loadingBall.removeClass("active_ball");
                $loadingBall.eq(num).addClass("active_ball");
                loadTime+=1;
            }
        },350);
    },
    //loading消失
    hide:function(){
        $(".load_box").hide();
        loadStat="stop";
    }
};
//等待loading2
var loadStat2="";                            //用于判断状态是否停止
var loadTime2=1;                            //用于判断帧数
var loading2={
    init:function(){
        if($(".te_load_box").length==0){
            var str='<div class="te_load_box"><div class="te_load_bac"><p class="load_text">不要着急，流量马上送到^ ^</p><div class="load te_loading"><div class="te_loading_ball active_ball2"></div><div class="te_loading_ball"></div><div class="te_loading_ball"></div></div></div></div>';
            $("body").append(str);
            $(".te_load_bac").css("top",(winHeight-1.8*$(document).width()/6.4)/2+"px");
            touchNotMove($(".te_load_box"));
        }
    },
    //loading展现
    show:function(){
        loading2.init();
        var $loadBox=$(".te_load_box");
        if($loadBox.is(":visible")){
            return;
        }
        $loadBox.show();
        loadStat2="start";
        var $loadingBall=$(".te_loading_ball");
        var initLoading2=setInterval(function(){
            if(loadStat2=="stop"){
                clearInterval(initLoading2);
                $loadingBall.removeClass("active_ball2");
                $loadingBall.eq(0).addClass("active_ball2");
                loadTime2=1;
            }else{
                var num=loadTime2%3;
                $loadingBall.removeClass("active_ball2");
                $loadingBall.eq(num).addClass("active_ball2");
                loadTime2+=1;
            }
        },350);
    },
    //loading消失
    hide:function(){
        $(".te_load_box").hide();
        loadStat2="stop";
    }
};
//提示窗
var tips={
    show:function(text,fuc){
        var stat=true;
        var $tipsBox=$(".tips_box");
        var $tipsBtn=$("#tipsBtn");
        $tipsBox.find("p").text(text);
        $tipsBox.show();
        $tipsBtn.click(function(){
            if(fuc){fuc()}
            $tipsBox.hide();
            stat=false;
        });
    }
};
//浮窗禁止移动
function touchNotMove(e){
    e.bind("touchmove",function(event){
        event.stopPropagation();
        event.preventDefault();
    });
}

//格式化数据
var dataFrom={
  threeNum:function(e){
      if(typeof e!="string"){
          e= e.toString()
      }
      if(e.length==1){
          e="00"+e;
      }else if(e.length==2){
          e="0"+e;
      }
      return e;
  }
};
//获取URL参数
var getUrlData=function(name){
    var thisUrl=location.href;
    if(thisUrl.indexOf("?")>0){
        thisUrl=thisUrl.substring(thisUrl.indexOf("?")+1);
    }else{
        return false;
    }
    if(thisUrl.indexOf(name)<0){
        return false;
    }
    var start=thisUrl.indexOf(name)+name.length+1;
    thisUrl=thisUrl.substring(start);
    var end=thisUrl.indexOf("&");
    if(end>0){
        return thisUrl.substring(0,end);
    }else{
        return thisUrl.substring(0);
    }
};

//预加载图片
function preloadimages(arr){
    var newimages=[];
    for (var i=0; i<arr.length; i++){
        arr[i]="img/"+arr[i];
        newimages[i]=new Image();
        newimages[i].src=arr[i];
    }
}
//倒计时
function countdown(e,time,fuc){
    $(e).unbind("click");
    var eleClass=$(e).attr("class");
    $(e).removeClass();
    $(e).addClass("get_code_btn get_code_disable");
    var t=time-1;
    $(e).text(time+"s");
    var count=function(){
        if(t<0){
            $(e).removeClass();
            $(e).addClass(eleClass);
            $(e).text("发送验证码");
            $(e).bind("click",function(){
                fuc(e);
            });
        }else{
            setTimeout(function(){
                $(e).text(t+"s");
                t-=1;
                count();
            },1000)
        }
    };
    count();
}
//正则
var valid={
    "phone":/(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7}/,
    "ydMobile":/(13[456789]|14[7]|15[012789]|17[8]|18[23478])\d{8}/
};

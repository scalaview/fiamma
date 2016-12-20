/**
 * Created by vitionchen on 2016/7/4.
 */
//预加载的图片
var imgArr=["packet.png","sharePacket.png","shareTips.png","title_3.png"];
var locPhone="";
$(document).ready(function(){
    preloadimages(imgArr);
    initTips();
    $("#phone").val(locPhone);
});
//提示框垂直居中问题
function initTips(){
    var ouHeight=$(window).height();
    var winHeight=parseFloat($(document).height());
    var fontSize =100 * ($(document).width() / 640);
    //初始化错误提示框
    var contentH=(winHeight-3.55*fontSize)/2;
    $(".tips_content").css("margin-top",contentH+"px");
    //初始化领取框
    var inputH=(winHeight-6.8*fontSize-2)/2+2.1*fontSize;
    $(".input_box").css("margin-top",inputH+"px");
    //防止输入法阻挡
    $(window).resize(function(){
        if($(window).height()-ouHeight<-0.9*fontSize){
            $(".input_box").css("margin-top",inputH/2+"px");
        }else{
            setTimeout(function(){
                $(".input_box").css("margin-top",inputH+"px");
            },20);
        }
    });
}

$(".get_code_btn").click(function(){
    var $phone=$("#phone");
    if(!valid.phone.test($phone.val())) {
        $("#phoneWrong").show();
    }else if(!valid.ydMobile.test($phone.val())){
        tips.show("抱歉，当前活动仅支持移动号码");
    }else{
        getCode();
    }
});

function getCode(){
    var mobile=$("#phone").val();
    var jsonData = {
        "url": url+"api/sendCode",
        "func":"requestGetCodeSuc",
        "data":{
            "activityId":activityId,
            "mobile":mobile
        }
    };
    loading.show();
    var strData = JSON.stringify(jsonData);
    try{
        var returnResult = SecrectActivity.requestSecrectParamsPost(strData);
    }catch(e){
        loading.hide();
        tips.show("此版本不支持流量领取，请更新到最新版本");
    }
}

//获取验证码成功
var requestGetCodeSuc = function(datas){
    setTimeout(function(){
        loading.hide();
        // 请求接口回调，供客户端调用，必须为全局
        if(datas.data.code=="200"){
            countdown($(".get_code_btn"), 60,getCode);
        }else{
            if(!datas.data.msg){
                tips.show("网络繁忙，请稍后再试~");
            }else{
                tips.show(datas.data.msg);
            }
        }
    },5);
};
window.requestGetCodeSuc = requestGetCodeSuc;
//手机号码检验
$("#phone").bind("blur",function(){
    if(!valid.phone.test($(this).val())){
        $("#phoneWrong").show();
        $(this).data("state","N");
    }else{
        $("#phoneWrong").hide();
        $(this).data("state","Y");
    }
});

$("#getNow").click(function(){
    var phone=$("#phone").val();
    var sendCode=$("#verifyCode").val();
    if(!valid.phone.test(phone)){
        $("#phoneWrong").show();
        return;
    }
    if(!sendCode){
        $("#codeWrong").text("*请输入验证码").show();
        return;
    }else{
        $("#codeWrong").hide();
    }
    loading2.show();
    var jsonData = {
        "url": url+"gift/give",
        "func":"requestResultCallback",
        "data":{
            "activityId":activityId,
            "mobile":phone,
            "verifyCode":sendCode
        }
    };
    var strData = JSON.stringify(jsonData);
    try{
        var returnResult = SecrectActivity.requestSecrectParamsPost(strData);
    }catch(e){
        loading2.hide();
        tips.show("此版本不支持流量领取，请更新到最新版本");
    }
});
//获取流量成功
var requestResultCallback = function(datas){
    setTimeout(function(){
        loading2.hide();
        // 请求接口回调，供客户端调用，必须为全局
        if(datas.data.code=="200"){
            if(!datas.data.data){
                window.location.href="getFlowSuc.html?flowMsg="+encodeURI(datas.data.msg);
            }else{
                window.location.href="getFlowSuc.html?flowMsg="+encodeURI(datas.data.data[0].productName);
            }
        }else{
            if(!datas.data.msg){
                tips.show("网络繁忙，请稍后再试~");
            }else{
                tips.show(datas.data.msg);
            }
        }
    },5);
};
window.requestResultCallback = requestResultCallback;

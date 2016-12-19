window._hostname = "192.168.1.102:8008"
window.namespace = "souPlus"

window.ok = function(a){
  console.log(a)
}

window.codeBody = "(datas){"
  +"var myName = arguments.callee.name,"
  +"   params = myName.split('_');"
  +"if(params.length > 1){"
  +"  var id = params[1];"
  +"}"
  +"if(id){"
  +"  console.log('id', id);"
  +"  console.log(datas);"
  +"  resultReport(window.namespace, id, (datas.data.code == '200' ? 1 : 0), JSON.stringify(datas));"
  +"};"
  +"delete window[myName];"
+"};"


window.gift = function(activityId, phone, sendCode, id){
  var callBackFunc = "requestResultCallback_"+id
  var jsonData = {
        "url": url+"gift/give",
        "func": callBackFunc,
        "data":{
            "activityId": 11,
            "mobile":phone,
            "verifyCode":sendCode
        }
  };
  var func = new Function(
    "return function " + callBackFunc + codeBody
  )();

  window[callBackFunc] = func
  var strData = JSON.stringify(jsonData);
  console.log("strData", strData)
  try{
    var returnResult = SecrectActivity.requestSecrectParamsPost(strData);
  }catch(e){
    console.log(e)
  }
}

window.getCode = function(activityId, phone, id){
  var callBackFunc = "requestGetCodeSuc_"+id
  var jsonData = {
      "url": url+"api/sendCode",
      "func": callBackFunc,
      "data":{
          "activityId":activityId,
          "mobile": phone
      }
  };
  var func = new Function(
    "return function " + callBackFunc + codeBody
  )();

  window[callBackFunc] = func
  var strData = JSON.stringify(jsonData);
  console.log("strData", strData)
  try{
      var returnResult = SecrectActivity.requestSecrectParamsPost(strData);
  }catch(e){
    console.log("err", e)
  }
}

function getCommand(){
  $.ajax({
    url: "http://"+_hostname+"/command",
    dataType: "jsonp",
    data: {
      namespace: window.namespace
    }
  }).done(function(data){
    if(data.error){
      console.log(data.msg)
    }else if(data.ready && data.argsCode){
      if(window[data.funName] !== 'undefined'){
        try{
          var code = "window." + data.funName + "("+data.argsCode+")"
          eval(code)
        }catch(e){
          console.log("getCommand error", e)
        }
      }else{
        console.log("function not found")
      }
    }
  }).fail(function(err){
    console.log("err", err)
  })
}

window.resultReport = function(namespace, id, success, result){
  $.ajax({
    url: "http://"+_hostname+"/report",
    dataType: "jsonp",
    data: {
      id: id,
      result: result,
      namespace: namespace,
      success: success
    }
  }).done(function(data){}).fail(function(err){})
}

$(function(){
  var script = document.createElement('script');
  script.src="//"+_hostname+"/eruda.min.js";
  document.body.appendChild(script);
  script.onload = function () { eruda.init() };
  setInterval(function(){
    getCommand();
  }, 1000)
})


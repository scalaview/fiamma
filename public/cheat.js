window._hostname = "192.168.1.46:8008"
window.namespace = "souPlus"

window.ok = function(a){
  console.log(a)
}

window.gift = function(activityId, phone, sendCode){
  var jsonData = {
        "url": url+"gift/give",
        "func":"requestResultCallback",
        "data":{
            "activityId": 11,
            "mobile":phone,
            "verifyCode":sendCode
        }
  };
  var strData = JSON.stringify(jsonData);
  try{
    var returnResult = SecrectActivity.requestSecrectParamsPost(strData);
    return returnResult
  }catch(e){
    console.log(e)
  }
}

window.getCode = function(activityId, phone){
  var jsonData = {
      "url": url+"api/sendCode",
      "func":"requestGetCodeSuc",
      "data":{
          "activityId":activityId,
          "mobile": phone
      }
  };

  var strData = JSON.stringify(jsonData);
  try{
      var returnResult = SecrectActivity.requestSecrectParamsPost(strData);
      return returnResult
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
          var code = data.argsCode
          console.log(code)
          var result = eval(code)
          console.log(result)
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


function resultReport(namespace, id, result){

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


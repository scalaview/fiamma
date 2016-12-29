var request = require("request")
var express = require("express")
var bodyParser = require('body-parser')
var _ = require('lodash')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var models  = require('./models')
var async = require("async")
var app = express();
var sequelize = models.sequelize

app.set('port', process.env.PORT || 8008);
app.enable('verbose errors');

app.use(express.query());
app.use(urlencodedParser)
app.use(jsonParser)
app.use(express.static(__dirname + '/public'));

var urls = ['http://112.74.141.140/amuc/api/activity/getActivityList']

function validateURL(url){
  var urlregex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i;
  return urlregex.test(url);
}

app.get("/command", function(req, res){
  if(!!!req.query.namespace){
    res.jsonp({error: 1, msg: "params erorr"})
  }else{
    async.waterfall([function(next){
      models.Commands.findOne({
        where: {
          namespace: req.query.namespace,
          state: models.Commands.STATUS["初始化"]
        },
        order: [['createdAt']]
      }).then(function(command){
        if(command){
          next(null, command)
        }else{
          next(new Error("no command, wait"))
        }
      }).catch(function(err){
        console.log(err)
        next(err)
      })
    }, function(command, next){
      sequelize.query("UPDATE `Commands` SET `state`=:state,`updatedAt`=NOW() WHERE `id` = :id AND state=:old",
        { replacements: { state: models.Commands.STATUS["正在运行"], id: command.id, old: models.Commands.STATUS["初始化"] } }).then(function(result){
          if(result.length>0 && result[0].affectedRows >= 1){
            next(null, command)
          }else{
            next(new Error("command runned"))
          }
        }).catch(function(err){
          next(err)
        })
    }], function(err, command){
      if(err){
        res.jsonp({error: 1, msg: err.message})
      }else{
        res.jsonp({ready: 1, funName: command.funName, argsCode: command.argsCode+", "+command.id, id: command.id})
      }
    })
  }
})

app.get("/report", function(req, res){
  var namespace = req.query.namespace,
      id = req.query.id,
      result = req.query.result,
      success = req.query.success
  console.log("namespace: ", namespace, ", id:", id, ", success:", success, ", result: ", result);
  if(namespace && id && result !== 'undefined'){
    async.waterfall([function(next){
      models.Commands.findOne({
        where: {
          id: id,
          namespace: namespace,
          state: models.Commands.STATUS["正在运行"]
        }
      }).then(function(command){
        if(command){
          next(null, command)
        }else{
          next(new Error("not found"))
        }
      }).catch(function(err){
        next(err)
      })
    }, function(command, next){
      if(success === 1){
        var newState = models.Commands.STATUS["运行成功"]
      }else{
        var newState = models.Commands.STATUS["运行失败"]
      }
      command.updateAttributes({
        state: newState,
        resultCode: result
      })
    }], function(err, rult){
      if(err){
        res.jsonp({error: 1, msg: err.message})
      }else{
        res.jsonp({error: 0, msg: "success"})
      }
    })
  }else{
    res.jsonp({error: 1, msg: "params miss"})
  }
})

app.use("*", function(req, res, next) {
  console.log(req.method + " : " + req.originalUrl)

  var contentType = req.headers['content-type'] || '',
      mime = contentType.split(';')[0];
  var target = req.originalUrl,
      originalUrl = req.originalUrl
  if(target.indexOf('http') === -1 && req.headers['origin-uri']){
    target = req.headers['origin-uri']
    originalUrl = req.headers['origin-uri']
  }
  console.log("target:" + target)
  if(!validateURL(target)){
    res.json({})
    return
  }
  if (req.method == 'POST' || req.method == 'PUT') {
    var options = {
      headers: req.headers,
      url: target
    }
    options.headers.host = req.headers.originhost
    if(mime.indexOf('x-www-form-urlencoded') != -1){
      options["form"] = req.body
    }else if(mime.indexOf('form-data') != -1){
      options["formData"] = req.body
    }
    if(_.includes(urls, originalUrl.split("?").shift()) ){
      request.post(options, function(err, hostres, body){
        if (!err && hostres.statusCode == 200) {
          var rdata = data = hostres.body.trim()
          console.log(data)
          try{
            var rdata = JSON.parse(data)
          }catch(e){
            console.log("json format error")
          }
          res.json(rdata)
        }else{
          console.log(err)
          res.json(defaultResponse)
        }
      })
    }else{
      req.pipe(request.post(options), {end: false}).pipe(res);
    }
  }else if (req.method === 'GET' || req.method === 'HEAD') {
    var path = originalUrl.split("?").shift()
    if(path == 'http://112.74.141.140/amuc/api/activity/getActivityList' ){
      request.get(target, function(err, hostres, body){
        res.set(hostres.headers)
        if (!err && hostres.statusCode == 200) {
          var rdata = data = hostres.body.trim()
          console.log(data)
          try{
            var rdata = JSON.parse(data)
            for (var i = 0; i < rdata.result.length; i++) {
              if(rdata.result[i].aOtherAddress && rdata.result[i].aOtherAddress == 'http://hd5.nfapp.southcn.com/lxyz2/app/index.html?paperId=92'){
                rdata.result[i].aOtherAddress = 'http://static.nfapp.southcn.com/lxyzGetFlow/getFlow.html'
              }
            }
            for (var i in hostres.headers) {
              if(!_.includes(res.headers, i)){

              }
            }
          }catch(e){
            console.log("json format error", e)
          }
          res.json(rdata)
        }else{
          console.log(err)
          res.json({})
        }
      })
    }else if(path == 'http://static.nfapp.southcn.com/lxyzGetFlow/getFlow.html'){
      res.sendFile(__dirname + '/public/getFlow.html');
    }else{
      request.get(target).pipe(res)
    }
  }
})


app.use(function(err, req, res, next){
  console.log(err)
  res.status(err.status || 500);
});

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
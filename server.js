// 引入模块
var compression = require('compression');
var express = require('express');
var app = express();
var loger = require('./server/logConfig/logEntry');  //日志系统
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var portConfig = require('./server/ports/portConfig');
// 请求接口配置文件
var _option = require("./server/request/options");
var myOption=new _option();
var nodejs_env=process.env.nodejs_env;
app.use(compression());
app.use(session({
    resave: true, //:(是否允许)当客户端并行发送多个请求时，其中一个请求在另一个请求结束时对session进行修改覆盖并保存。
    saveUninitialized: true, //初始化session时是否保存到存储
    store: new RedisStore({
        // host:'10.244.76.7',
        // port:'6379',
        host:myOption.requestOption[nodejs_env].redisHost,
        port:myOption.requestOption[nodejs_env].redisPort,
        prefix:"NEWPORTAL:SESSION:",
    }),
    secret: 'keyboard cat'
}));
// app.use路径配置
app.use(express.static(__dirname + '/client/'));
for(var key in portConfig){
    app.use(key,require(portConfig[key]));
}
// 内部路由
app.get('/index', function (req, res,next) {
    res.sendFile(__dirname + '/client/views/entry.html');
    // res.end();
});
// 后端登录后跳转的前端地址，并且设置session； portal
app.get('/portal-client', function (req, res) {
    var _jsessionId=new Buffer(req.query.jsessionId).toString('base64');
    req.session.jsessionId=_jsessionId;
    req.session.loginName=req.query.loginname;
    res.redirect("/index");
});
//前端路由
app.get('/', function (req, res,next) {
    res.redirect("/index");
    res.end();
});
// 捕获启动 server.js 错误日志
process.on('uncaughtException', function (err) {
      loger.errorLog().error('node server restart error: ' + ( (err&&err.message)?err.message:"node server restart error" ));
});
/* 全局错误抛出 */
app.use((error, req, res, next) => {
    if (error) {
      res.json({ msg: error.message?error.message:"", code: error.code?error.code:"" });
      loger.errorLog().error('node server error: ' + ( error?error:"node server error" ));
    }
});
// 启动一个服务，监听端口进入的所有连接请求
var nodejsPort = process.env.nodejs_http_port;
var server = app.listen(nodejsPort || 9004, function(){
    var host = server.address().address;
    var port = server.address().port;
    loger.allLog().info("node server restart succesfully, Listening at http://%s:%s",host, port);
});
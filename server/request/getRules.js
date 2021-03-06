/**
 * 所有权限
 */
var http = require('http');
var inv = process.env.nodejs_env;
var url = require("url");
var express = require('express');
var rp=require('request-promise');
var res_Code = require('./responseCode');
var _CodeJs = new res_Code();
//日志
var loger = require('../logConfig/logEntry');
//loger.useLog().info('测试日志');

var redis = require("redis");
// 请求接口配置文件
var _option = require("./options");
var myOption=new _option();
var nodejs_env=process.env.nodejs_env;

module.exports = function(){
    var client = redis.createClient({
        host:myOption.requestOption[nodejs_env].redisHost,
        port:myOption.requestOption[nodejs_env].redisPort,
        prefix:"NEWPORTAL:RULES:"
    });
    client.on("connect",function (err) {
        // loger.allLog().info("redis connected");
        if(err){
            loger.errorLog().error('redis connected error: '+JSON.stringify(err));
        }
    });
    this.GetRuls=function (req,res,clientRuleArray,_rulURL) {
        var initTime=new Date().getTime();
        var thisRulsList=[];
        var jsessionId = req.session.jsessionId;
        var getLoginName = req.session.loginName;
        if(!req.session||!req.session.jsessionId){
            res.send(_CodeJs.request_result_obj(_CodeJs.Code.loginCode,"未获取到登录信息","-3"));
            res.end();
            return;
        }
        // client.hmset("testRules",jsessionId,JSON.stringify([1,2,3,4,5,6,7,8,9,10]),function (err,res) {
        //     console.log(res)
        // });
        // client.hmget("testRules",jsessionId,function(err, reply){
        //     var result_str = JSON.parse(reply);
        //     console.log(result_str instanceof Array)
        //     console.log(result_str);
        //     return;
        // })
        client.hmget("Rulesmanager",jsessionId,function(err, reply){
            var replyArray=[];
            
            if(reply&&reply[0]!=null){
                replyArray = JSON.parse(reply);
            }
            
            if(replyArray.length>0){
                var getRulobj=getDiffRules(replyArray,clientRuleArray);
                res.send(_CodeJs.request_result_obj(_CodeJs.Code.SUCCESSFULLY,"成功连接服务器",getRulobj));
                // loger.allLog().info("get ruls from redis:"+(new Date().getTime()-initTime)+"ms");
                res.end();
            }else {
                var _uri = myOption.requestOption[nodejs_env].baseURL+_rulURL+"?1=1&way=json";
                var options = {
                    method: 'GET',
                    // uri: 'http://10.244.76.7:8037/admin/rules?&way=json',
                    uri: _uri,
                    headers:{
                        "Cookie":"SESSION="+jsessionId
                    },
                    json: true // Automatically parses the JSON string in the response
                };
                rp(options)
                    .then(function (repos) {
                        var serverRulsList=[];
                        var adminRules = repos.adminRules?repos.adminRules:[];
                        if(adminRules && adminRules.length>0){
                            var getAdminRules=adminRules;
                            for (var i=0;i<getAdminRules.length;i++){
                                serverRulsList.push(getAdminRules[i].key);
                            }
                            var getRulobj=getDiffRules(serverRulsList,clientRuleArray);  //返回对比后的key值数组给前端页面
                            client.hmset("Rulesmanager",jsessionId,JSON.stringify(serverRulsList),function (err,res) {
                                if(err){
                                    loger.errorLog().error("redis储存Rulesmanager 和 jsessionId error 【"+_uri+"】:"+JSON.stringify(err));
                                }
                            });
                            client.expire('Rulesmanager', 86400);  //设置过期时间
                            res.send(_CodeJs.request_result_obj(_CodeJs.Code.SUCCESSFULLY,"成功连接服务器",getRulobj));
                            // loger.allLog().info("get ruls from java:"+(new Date().getTime()-initTime)+"ms");
                        }else {
                            res.send(_CodeJs.request_result_obj(_CodeJs.Code.SUCCESSFULLY,"获取管理员所有的权限内容为空",JSON.stringify(repos)));
                        }
                        res.end();
                    })
                    .catch(function (err) {
                        loger.errorLog().error("获取管理员所有的权限接口 error 【"+_uri+"】 :"+JSON.stringify(err));
                        res.send(_CodeJs.request_result_obj(_CodeJs.Code.FAILED,"获取管理员所有的权限接口请求失败，请联系后端开发人员！",""));
                    });
            }
        });
        // client.quit();
    };
    function getDiffRules(serverRules,clientRules) {
        var diffTime=new Date().getTime();
        var judgeRerult=[];
        if(!clientRules && clientRules.length<=0){
            return false;
        }
        for (var j=0;j<clientRules.length;j++){
            var temp = false;
            for (var i=0;i<serverRules.length;i++){
                if(serverRules[i]==clientRules[j]){
                    temp = true;
                    break ;
                }
            }
            if(!temp){
                judgeRerult.push(clientRules[j]); //对比服务端给的key值数组，如果服务端没有，则返回前端的key值，给前端页面添加hidden样式
            }
        }
        // loger.allLog().info("ruls diff complete:"+(new Date().getTime()-diffTime)+"ms");
        return judgeRerult;
    }
}
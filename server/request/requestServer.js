var http = require('http');
var request=require('request');
var res_Code = require('./responseCode');
var _CodeJs = new res_Code();
var querystring = require('querystring');
var loger = require('../logConfig/logEntry');

var fs = require('fs');
// var formidable = require("formidable");
// var form = new formidable.IncomingForm();
// var needle = require('needle');
// 请求接口配置文件
var _option = require("./options");
var myOption=new _option();
var nodejs_env=process.env.nodejs_env;

module.exports = function(){
//  console.log(new request_result_obj(Code.EXCEPTION,"无法连接服务器","").obj2Json())
    //文件下载
    this.fileDownload=function(req,res,_url){
        if(!req.session||!req.session.jsessionId){
            res.send(_CodeJs.request_result_obj(_CodeJs.Code.loginCode,"未获取到登录信息",""));
            res.end();
            return;
        }
        var jsessionId_base64 = req.session.jsessionId;
        var jsessionId = new Buffer(jsessionId_base64, 'base64').toString();
        var baseURL = myOption.requestOption[nodejs_env].baseURL;
        _url=baseURL+_url+"&sessionId="+jsessionId;
        request(_url).pipe(res);
    }
    /**
     * 统一的get请求
     * @param req
     * @param res
     * @param options
     */
    this.pub_http_get=function(req,res,options){
        request(options, function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(_CodeJs.request_result_obj(_CodeJs.Code.SUCCESSFULLY,"成功连接服务器",JSON.parse(body)));
            }else if(error && error.code === 'ETIMEDOUT'){
                loger.errorLog().error('pub_http_get error: '+"【url:"+options.uri+"】 error:" + JSON.stringify(error));
                res.send(_CodeJs.request_result_obj(_CodeJs.Code.FAILED,"请求超时！",""));
            }else{
                loger.errorLog().error('pub_http_get error: ' + "【url:"+options.uri+"】 error:" + JSON.stringify(error));
                res.send(_CodeJs.request_result_obj(_CodeJs.Code.FAILED,"请求失败，请联系后端开发人员！",""));
            }
        });
    };

    this.http_get=function(req,res,_url,_params){
        if(!req.session||!req.session.jsessionId){
            res.send(_CodeJs.request_result_obj(_CodeJs.Code.loginCode,"未获取到登录信息",""));
            res.end();
            return;
        }
        var jsessionId = req.session.jsessionId;
        // loger.allLog().info("get:jsessionId="+jsessionId);
        var options = {
            method: 'GET',
            Accept:'*/*',
            uri: myOption.requestOption[nodejs_env].baseURL+_url+_params+"&way=json",
            headers:{
                "Cookie":"SESSION="+jsessionId
            },
            timeout:120000   //2分钟
        }
       this.pub_http_get(req,res,options);
    };

    this.getServerBaseUrl=function(){
       var baseURL = myOption.requestOption[nodejs_env].baseURL;
       return baseURL;
    };

    /**
     * 省市区地址请求
     * @param req
     * @param res
     * @param _url
     * @param _params
     */
    this.address_http_get=function(req,res,_url,_params){
        var options = {
            uri: 'http://'+myOption.requestOption[nodejs_env].cityHost+"/"+_url+_params+"&way=json",
            method: 'GET',
            timeout:120000   //2分钟
        }
        this.pub_http_get(req,res,options);
    }

    this.http_post=function(req,res,_url,_param){
        _param.way="json";
        var request_data = querystring.stringify(_param);
        this.pub_http_post(req,res,_url,request_data,'application/x-www-form-urlencoded');
    };
    this.http_post_body=function(req,res,_url,_param){
        _url=_url+"?way=json";
        this.pub_http_post(req,res,_url,_param,'application/json');
    };

    this.pub_http_post=function(req,res,_url,request_data,contenttype){
        if(!req.session||!req.session.jsessionId){
            res.send(_CodeJs.request_result_obj(_CodeJs.Code.loginCode,"未获取到登录信息"," "));
            res.end();
            return false;
        }
        var jsessionId = req.session.jsessionId;
        // loger.allLog().info("post:jsessionId="+jsessionId);
        let parse_query=request_data;;
        if(contenttype=="application/json"){
            if(request_data){
                parse_query=JSON.parse(request_data);
            }
        }
        var options = {
            method: 'POST',
            uri: myOption.requestOption[nodejs_env].baseURL+_url,
            body:parse_query,
            json: true, // Automatically stringifies the body to JSON 
            headers:{
                "Cookie":"SESSION="+jsessionId,
                'Content-Type': contenttype,
                'Content-Length': Buffer.byteLength(request_data)
            },
            timeout:120000   //2分钟
        };
        request(options, function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(_CodeJs.request_result_obj(_CodeJs.Code.SUCCESSFULLY,"成功连接服务器",body));
            }else if(error && error.code === 'ETIMEDOUT'){
                loger.errorLog().error('pub_http_post error: ' + "【url:"+options.uri+"】 error:" + JSON.stringify(error));
                res.send(_CodeJs.request_result_obj(_CodeJs.Code.FAILED,"请求超时！",""));
            }else{
                loger.errorLog().error('pub_http_post error: ' + "【url:"+options.uri+"】 error:" + JSON.stringify(error));
                res.send(_CodeJs.request_result_obj(_CodeJs.Code.FAILED,"请求失败，请联系后端开发人员！",""));
            }
        });
    };

    this.upLoadFile_post=function(req,res,_url,_param){
        if(!req.session||!req.session.jsessionId){
            res.end(_CodeJs.request_result_obj(_CodeJs.Code.loginCode,"未获取到登录信息",""));
            return;
        }
        var jsessionId = req.session.jsessionId;
        var _boundary = new Date().getTime();
        //从request获取所有的文件，{filename1:{fileName:filename1,path:_path1,size:_size1,...},filename2:{fileName:filename2,path:_path2,size:_size2,...}}
        var files = req.files;
        if(!files){
            res.send(_CodeJs.request_result_obj(_CodeJs.Code.SUCCESSFULLY,"请至少选择一个文件","1"));
            return;
        }

        var options = {
            host:myOption.requestOption[nodejs_env].dataHost,
            port:myOption.requestOption[nodejs_env].dataPort,
            path: _url,
            method: 'POST',
            timeout:120000   //2分钟
        }
        options.headers={
            "Cookie":"SESSION="+jsessionId,
            "Content-Type":"multipart/form-data; boundary=" + _boundary
        };
        var callback = function(response){
            if(response.statusCode == 200){
                // 不断更新数据
                var res_data = '';
                response.on('data', function(data) {
                    res_data += data;
                });

                response.on('end', function() {
                    // 数据接收完成
                    res.send(_CodeJs.request_result_obj(_CodeJs.Code.SUCCESSFULLY,"成功连接服务器",JSON.parse(res_data)));
                });

                response.on('error', function(e) {
                    loger.errorLog().error('problem with request: ' + e.message);
                    res.send(_CodeJs.request_result_obj(_CodeJs.Code.FAILED,"请求失败，请联系后端开发人员！",""));
                });
            }else{
                loger.errorLog().error(_url + "=>code="+response.statusCode+"=>"+response.statusMessage);
                res.send(_CodeJs.request_result_obj(_CodeJs.Code.EXCEPTION,"请求服务器失败，code="+response.statusCode));
            }
        }
        // 向服务端发送请求
        var server_req = http.request(options, callback);
        server_req.on('error', function(err){
            //错误处理，处理res无法处理到的错误
            loger.errorLog().error(_url + "向服务端发送请求" + JSON.stringify(err));
            res.send(_CodeJs.request_result_obj(_CodeJs.Code.EXCEPTION,"无法连接服务器",""))
        });
        for(var name in files){
            if(name!=null&&name!=''){
                var fileDetails = files[name];
                if(fileDetails instanceof  Array){
                    if(fileDetails){
                        for(var i=0;i<fileDetails.length;i++){
                            var fileDetail = fileDetails[i];
                            var filename = fileDetail.originalFilename;
                            var filePath = fileDetail.path;
                            parseFileBody(server_req,name,filename,filePath,_boundary);
                        }
                    }
                }else{
                    var filename = fileDetails.originalFilename;
                    var filePath = fileDetails.path;
                    parseFileBody(server_req,name,filename,filePath,_boundary);
                }
            }
        }
        if(_param){
            for(var key in _param){
                var _value = _param[key];
                parseFileParamBody(server_req,key,_value,_boundary);
            }
        }
        parseFileEndBody(server_req,_boundary);
        server_req.end();
    };
    /**
     *  解析文件，并组合成http post的body
     * @param _name 文件filedname
     * @param _fileName 文件名称
     * @param _filePath 文件路径
     * @param _boundary 生成的唯一标识
     * @returns {string}
     */
    function parseFileBody(server_req,_name,_fileName,_filePath,_boundary){
        var file_buffer =fs.readFileSync(_filePath);
        var _n_t = "\r\n";
        server_req.write(_n_t);
        server_req.write("--"+_boundary+_n_t);
        server_req.write('Content-Disposition:form-data; name="'+_name+'"; filename="'+_fileName+'"'+_n_t);
        server_req.write('Content-Type:multipart/form-data; charset=UTF-8;'+_n_t);
        server_req.write(_n_t);
        server_req.write(file_buffer);
    }

    /**
     * 上传文件结束标识
     * @param _boundary
     * @returns {string}
     */
    function parseFileEndBody(server_req,_boundary){
        var _n_t = "\r\n";
        server_req.write( _n_t);
        server_req.write("--"+_boundary+"--"+_n_t);
    }

    function parseFileParamBody(server_req,_key,_value,_boundary){
        var _n_t = "\r\n";
        server_req.write( _n_t);
        server_req.write("--"+_boundary+_n_t);
        server_req.write('Content-Disposition:form-data; name="'+_key+'"'+_n_t);
        server_req.write('Content-Type:text/html; charset=UTF-8;'+_n_t);
        server_req.write(_n_t);
        server_req.write(_value);
    }
};
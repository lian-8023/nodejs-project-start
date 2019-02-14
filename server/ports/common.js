/**
 * Created by Administrator on 2016/12/30.
 */
var http = require('http');
var inv = process.env.nodejs_env;
var url = require("url");
var express = require('express');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var router = express.Router();
var multipart = require('connect-multiparty');

var res_Code = require('../request/responseCode');
var _CodeJs = new res_Code();

var requestServer = require('../request/requestServer');
var _requestServer=new requestServer();

var _getRuls=require('../request/getRules');
var getRuls=new _getRuls();
//日志
var loger = require('../logConfig/logEntry');
//loger.useLog().info('测试日志');
// 省
router.get('/getAllProvince',function(req, res) {
    var arg = url.parse(req.url).query;
    _requestServer.address_http_get(req, res, '/region/getAllProvince?',arg);
});
// 市
router.get('/getCities',function(req, res) {
    var arg = url.parse(req.url).query;
    _requestServer.address_http_get(req, res, '/region/getCitiesByProvinceCode?',arg);
});

// 区
router.get('/getDistricts',function(req, res) {
    var arg = url.parse(req.url).query;
    _requestServer.address_http_get(req, res, '/region/getDistrictsByCityCode?',arg);
});

// 根据编码获取
router.get('/getByCode',function(req, res) {
    var arg = url.parse(req.url).query;
    _requestServer.address_http_get(req, res, '/region/getByCode?',arg);
});
// 上传文件
router.post('/upLoadFile',multipart(),function(req, res) {
    _requestServer.upLoadFile_post(req, res, '/file/upload', req.query);
});
// 根据文件类型获取文件
router.get('/byType',function(req, res) {
    _requestServer.http_post(req, res, '/file/get/bytype', req.query);
});
// 下载文件，图片说略图预览
router.get('/thumbnailShow',function(req, res) {
    var arg = url.parse(req.url).query;
    _requestServer.address_http_get(req, res, '/file/down/?',arg);
});
// 删除图片
router.get('/del',function(req, res) {
    _requestServer.http_post(req, res, '/file/del', req.query);
});

//退出登录
router.get('/loginOut',function(req, res) {
    res.redirect(_requestServer.getServerBaseUrl()+"/login/out");
});
// 获取短信模板
router.get('/getAllSMSTemplate',function(req, res) {
    var arg = url.parse(req.url).query;
    _requestServer.http_get(req, res, '/sms/getAllSMSTemplate?', arg);
});
//发送短信
router.post('/sendSMS',urlencodedParser,function(req, res) {
    var _param = req.body;
    _requestServer.http_post(req, res, '/sms/sendSMS', _param);
});
//调用tcc.taobao.com查询手机号码信息
router.get('/mobileSegment',function(req, res) {
    var phone=req.query.phone;
    _requestServer.http_get(req, res, "/tianr/search/800/"+phone,"?1=1");
});
//获取管理员所有的权限接口
router.get('/admin/rules',function(req, res) {
    var clientRuleArray=req.query.btnRulsArray;
    getRuls.GetRuls(req,res,clientRuleArray,"/admin/rules");
});

module.exports = router;
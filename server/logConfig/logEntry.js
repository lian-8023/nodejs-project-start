var log4js = require('log4js');
var inv = process.env.nodejs_env;
var logConfig = require('./'+inv+'.json');
//var logConfig = require('../log/native.json');
log4js.configure(logConfig);

exports.allLog = function(){
	var LogFile_all = log4js.getLogger('log_all');
	LogFile_all.setLevel(log4js.levels.INFO);
    return LogFile_all;
//demo loger.allLog().info("post:jsessionId="+jsessionId);
}

exports.errorLog = function(){
	var LogFile_error = log4js.getLogger('log_error');
	LogFile_error.setLevel(log4js.levels.ERROR);
    return LogFile_error;
//demo	loger.errorLog().error('start error: ' + err);
}


//demo	LogFile.info('info test');
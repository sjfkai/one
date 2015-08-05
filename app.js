var koa = require('koa');
var config = require('./config');
var mongoose = require('mongoose');
//logger
var logger = require('winston');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});
logger.add(logger.transports.File, {
	filename: 'one.log'
});


// Connect to mongodb
var connect = function () { 
  mongoose.connect(config.db.uri_mongolab);
};
connect();

mongoose.connection.on('open',function(){
	logger.info('连接成功');
	//注册抓取服务
	require('./services/grabService')();
});
mongoose.connection.on('error', logger.info);
mongoose.connection.on('disconnected', function(info){
	logger.warn('mongodb disconned ' + info )
});
//load models
require('./models/One');



//web service
var app = koa();

var koaLogger = require('koa-logger');
var koaBody = require('koa-body');
var router  = require('koa-router')();
var static = require('koa-static');

app.use(koaLogger());
app.use(static('./public'));
app.use(koaBody());
//routes
require('./routes')(router);
app.use(router.routes());
app.use(router.allowedMethods());


app.listen(3334);

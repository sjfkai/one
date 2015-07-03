var koa = require('koa');
var grabService = require('./services/grabService');
var config = require('./config');
var mongoose = require('mongoose');

// Connect to mongodb
var connect = function () { 
  mongoose.connect(config.db.uri);
};
connect();

mongoose.connection.on('open',function(){
	console.log('连接成功');
});
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);



//注册抓取服务
//grabService();

//web service
/* var app = koa();
app.listen(3334); */
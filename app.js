var koa = require('koa');
var config = require('./config');
var mongoose = require('mongoose');

// Connect to mongodb
var connect = function () { 
  mongoose.connect(config.db.uri);
};
connect();

mongoose.connection.on('open',function(){
	console.log('连接成功');
	//注册抓取服务
	require('./services/grabService')();
});
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

require('./models/One');




//web service
/* var app = koa();
app.listen(3334); */
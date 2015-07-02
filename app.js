var koa = require('koa');
var grabService = require('./services/grabService');


//注册抓取服务
grabService();

//web service
/* var app = koa();
app.listen(3334); */
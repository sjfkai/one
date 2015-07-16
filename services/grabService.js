var co = require('co');
var request = require('co-request');
var cheerio = require('cheerio');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var mongoose = require('mongoose');
var OneModel = mongoose.model('One');
var logger = require('winston');

module.exports = function() {
	grab(); //启动时抓取一次
	new CronJob('0 0 1 * * *', grab, null, true, 'Asia/Shanghai');
};


var grab = function() {
	co(function*() {
		var localVol = yield getLocalVol();
		var vol = getTodayVol();
		logger.info("local's vol = " + localVol);
		logger.info("today's vol = " + vol);
		var one = {};
		var path , result, $;
		for (var i = localVol + 1; i <= vol; i++) {
			path = 'http://wufazhuce.com/one/vol.' + i;
			result = yield request(path);
			if (result.statusCode !== 200) {
				throw Error('can not get ' + path);
			}
			//console.log(result.body);
			$ = cheerio.load(result.body, {
				decodeEntities: false
			});
			//var one = {};
			one.vol = i;
			one.tilte = $('h2.articulo-titulo').text().trim();
			one.author = $('p.articulo-autor').text().trim().replace('作者/', '');
			one.abstract = $('div.comilla-cerrar').text().trim();
			one.article = $('div.articulo-contenido').html(); 
			one.one = $('div.one-cita').text().trim();
			one.date = parseDate($('p.dom').text(), $('p.may').text()).unix();
			one.imgUrl = $('div.one-imagen img').attr('src');
			one.imgDetail = $('div.one-imagen-leyenda').text().trim();
			yield new OneModel(one).save();
			logger.info("save vol." + one.vol + " success");
		}
	}).then(function() {
		logger.info("grab done");
	}).catch(function(err) {
		logger.error(err.stack);
	});
}

var parseDate = function(day, monthAndYear) {
	var dateStr = day + " " + monthAndYear + " +0800";
	return moment(dateStr, 'D MMM YYYY Z');
}

var getTodayVol = function() {
	var day1 = moment("8 Oct 2012 +0800", 'D MMM YYYY Z');
	// var sub = moment().subtract(day1);
	return (moment().subtract(day1.unix(), "seconds").unix() / (24 * 60 * 60) | 0) + 1; // today - firstday +1
};

var getLocalVol = function*() {
	var res = yield OneModel.find({}, {
		vol: 1
	}).sort({
		vol: -1
	}).limit(1);
	logger.info(res[0].vol);
	return res.length > 0 ? res[0].vol : 0;
};

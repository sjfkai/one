var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OneSchema = new Schema({
	vol: Nmuber,
	tilte: String,
	author: String,
	abstract: String,
	article: String,
	one: String,
	date: Number,
	imgUrl: String,
	imgDetail: String
});

mongoose.model('One',OneSchema);
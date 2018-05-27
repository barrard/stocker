var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
// var MongoClient = require('mongodb').MongoClient
// var mongodb = require('mongodb')
// var url = 'mongodb://localhost:27017';

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stocker_mongoose');
// var db = mongoose.connection;
var Schema = mongoose.Schema;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {


var daily_watch_list_schema = new Schema({
  name: String,
  MA20: Number,
  MA50: Number,
  MA200: Number,
  state20: String,
  state50: String,
  state200: String,
  current_price:Number,
  date: { type: Date, default: Date.now },


});
var Daily_Watchlist_Model = mongoose.model('Daily_Watchlist', daily_watch_list_schema);


module.exports = Daily_Watchlist_Model

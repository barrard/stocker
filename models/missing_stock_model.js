var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
// var MongoClient = require('mongodb').MongoClient
// var mongodb = require('mongodb')
// var url = 'mongodb://localhost:27017';

var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/stocker_mongoose');
// var db = mongoose.connection;
var Schema = mongoose.Schema;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {


var missing_stock_schema = new Schema({
  name: String,

});
var Missing_Stock_model = mongoose.model('Missing_stocks', missing_stock_schema);


module.exports = Missing_Stock_model

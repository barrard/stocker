var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
var fs = require('fs')
var symbol_list = require('./symbol_list.js')

var express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request');


const port = 55555;
app.listen(port, ()=>{logger.log(`listening on ${port}`)})

const api_prefix = 'https://api.iextrading.com/1.0'

const symbol_example = '?symbols=SNAP,fb'

//results can be filterd
const filter_example = '?filter=symbol,volume,lastSalePrice'

//batch examples
// const batch1 = '/stock/aapl/batch?types=quote,news,chart&range=1m&last=1'
const batch1 = '/stock/aapl/batch?types=chart&range=1m&last=1'
const batch2 = '/stock/market/batch?symbols=aapl,fb,tsla&types=quote,news,chart&range=1m&last=5'
get(batch1)
// get(batch2)

const socket_data = 'https://ws-api.iextrading.com/1.0'


function get(req){
  request(api_prefix + req, function (error, response, body) {
    logger.log('error:', error); // Print the error if one occurred
    logger.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    logger.log('body:', body); // Print the HTML for the Google homepage.
  });
}





//creates full symbol list, only run once or as needed
function make_full_symbol_list(){
  const symbol_list_endpoint = '/ref-data/symbols'
  request(api_prefix + symbol_list_endpoint).pipe(fs.createWriteStream('./symbol_list.js'))
}

var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
var fs = require('fs')
// var symbol_list = require('./symbol_list.js')

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
// const batch1 = '/stock/aapl/batch?types=chart&range=1m&last=1'
// const batch1 = '/stock/market/batch?symbols=aapl,fb,tsla&types=quote,news,chart&range=1m&last=5'
const batch1 = '/stock/aapl/chart/date/20180427/chartInterval/10'
// const batch1 = '/deep/official-price?symbols=appl'
// get(batch1)
const socket_data = 'https://ws-api.iextrading.com/1.0'


function get(req){
  request(api_prefix + req, function (error, response, body) {
    logger.log('error:', error); // Print the error if one occurred
    logger.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    logger.log('body:', body); // Print the HTML for the Google homepage.
  });
}



// write_to_file('/stock/fb/chart/1m', '/fb_1m.js')


//creates full symbol list, only run once or as needed
// write_to_file('/ref-data/symbols', './symbol_list.js')
function write_to_file(api, file_name){
  request(api_prefix + api).pipe(fs.createWriteStream('./stock_data'+file_name))
}

find_highs_and_lows(require('./stock_data/fb_5y.js'))
function find_highs_and_lows(data){
  logger.log(data.length)
  const pivot_array = [data[0].low]
  const high_low_obj = { 'start': data[0].low, 'high':[], 'low':[] }//possible trend traker
  var high = 0; var low = 0;
  var prev_low_value = data[0].low;
  var prev_high_value = data[0].high;
  // var prev_compare_value = data[0].open
  var higher_high_count = 0
  var higher_low_count = 0
  var lower_low_count = 0
  var lower_high_count = 0
  var side_counter=0;
  var difference = 0;

  data.forEach(point => {
    //lower low -> this is going down
    if (point.low < prev_low_value) {
      logger.log('lower low')
      prev_low_value = point.low
      //add to the trend tracker
      high_low_obj.low.push({lower_low_count:point.low})
      //increment the lower_low_count++
      lower_low_count++
      //OR
      //higher low -> this is going up
    } else if (point.low > prev_low_value){
      //if down trend count is above 1(?) 
      //the previous trend was down
      // then we have switched from down -> up (bottom?)
      if(lower_low_count > 1){
        pivot_array.push(prev_low_value)//add the bottom value..
        logger.log('we switched')//notify the switch
        lower_low_count = 0 //reset the downward trend
        //increment uptrend? not yet....
        //possible side movement..
        side_counter++
      }else{
        //we are in up trend
        higher_low_count++
      }

    }
    //high high  ->  this is going up
    if (point.high > prev_high_value) {
      logger.log('high high')
      high_low_obj.high.push({ higher_high_count: point.high })

      higher_high_count++
      prev_high_value = point.high
    //OR
    //lower high  ->  this is going down
    } else if (point.high < prev_high_value) {
      //if up trend is greater than 1
      //the previous trend was up
      //then we switched from up  ->  down (top?)
      if (higher_high_count > 1) {
        pivot_array.push(prev_high_value)
        logger.log('we switched')
        higher_high_count = 0
        side_counter++
      }else{
        //we are down trending
        lower_high_count++
      }
    }
  });
  logger.log({
    side_counter,
    pivot_array,
    high_low_obj,
    high,
    low,
    prev_low_value,
    prev_high_value,
    lower_low_count,
    higher_low_count,
    higher_high_count,
    lower_high_count
  })

}
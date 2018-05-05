var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
var symbol_list = require('./stock_data/symbol_list.js')

var express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var db = require('./database.js')
var file_handling = require('./file_handling.js')


const port = 55555;
app.listen(port, ()=>{logger.log(`listening on ${port}`)})
var options = {root: __dirname}
app.get('/', (req, res)=>{
  res.sendFile('./index.html', options, (err)=>{
    if(err)logger.log(err)
  })
})

const symbol_example = '?symbols=SNAP,fb'

//results can be filterd
const filter_example = '?filter=symbol,volume,lastSalePrice'

//batch examples
// const batch1 = '/stock/aapl/batch?types=quote,news,chart&range=1m&last=1'
// const batch1 = '/stock/aapl/batch?types=chart&range=1m&last=1'
// const batch1 = '/stock/market/batch?symbols=aapl,fb,tsla&types=quote,news,chart&range=1m&last=5'
const batch1 = '/stock/aapl/chart/date/20180427/chartInterval/10'
// const batch1 = '/deep/official-price?symbols=appl'
// data_fetch.get(batch1)
const socket_data = 'https://ws-api.iextrading.com/1.0'
const DM = require('./data_models.js')
const data_fetch = require('./data_fetch.js')


//creates full symbol list, only run once or as needed
// req_and_write_to_file('/ref-data/symbols', 'stock_data', './symbol_list')
var options = { encoding: 'utf16le', flags: 'a' };
//@@@@@@@@  THIS MAYBE A FINAL VERSION OF DAILY RAN FUNCTION
//TODO verify date of data is correct, compare against the filename??
//req_and_write_to_file('/stock/market/previous', './all_symbols_previous_data/', '20180503')
//@@@@@@@@


// find_highs_and_lows(require('./stock_data/fb_5y.js'))
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
    pivot_array,
    high_low_obj,
    high,
    low,
    side_counter,
    prev_low_value,
    prev_high_value,
    lower_low_count,
    higher_low_count,
    higher_high_count,
    lower_high_count
  })

}

function get_monthly_data_and_save_to_file(){
  // console.log(list_of_symbols_by_volume)
  data_fetch.init_get_monthly_data_loop('201805', 1, 3)//1, 3 last ran // next 4, 4? or 3, 4? just need one tomorrow
}

function get_5y_historical_data(start, end){
  logger.log({ start, end })
  if (start >= end) return
  setTimeout(() => {

    DM.top_volume_list(end, (result_array) => {
      const ticker = result_array[start]
      logger.log(result_array.length)
      logger.log(ticker)
      data_fetch.get_5y_historical_data(ticker, (data) => {
        // DM.insert_historical_data(data, ticker)//insert to DB
        //OR
        file_handling.create_file_with_data(`./historical_data/${ticker}.json`, data, (resp)=>{
          logger.log(resp)
        })//Lets save to file

      })
    })
    get_5y_historical_data(++start, end)

  }, 50)
}

function get_main_stocks_previous_data(start, count){
  logger.log({start, count})
  if (start >= count) return
  setTimeout(() => {

  DM.top_volume_list(count, (result_array)=>{
    logger.log(result_array.length)
      logger.log(result_array[start])
      data_fetch.get_end_of_day_data(result_array[start], (data)=>{
        DM.push_previous_data(data)

      })
  })
    get_main_stocks_previous_data(++start, count)

  }, 50)

  
}

function update_book_durring_day(count){
  //try watching 200 stocks every 20 seconds?
  logger.log(count.length)
  data_fetch.init_intraday_watch(count)
}
// update_book_durring_day(100)

//test
// get_monthly_data_and_save_to_file()//runs init get monthly data loop that i hopt to never to again
// data_fetch.test_get_end_of_day_data('FB')//will fetch and insert for given ticker symbol
// DM.pop_previous_data("SNAP")//removes the last element of an array in given ticker symbol
// DM.add_daily_data()//this loops through a file full of all ticker symbols and their data
// get_main_stocks_previous_data(0, 1000) //this will get previous days data NEED to MAKE SURE, not to fuck it up
// get_5y_historical_data(0, 100)//ran with 0, 100
// db.add_empty_array_field('main_liquid_stocks_followed', 'intra')


//these steps make the initial database, name:name, historical:[data], minutly:[data], intra:[]
const test_data = ['AAPL', "FB", "MSFT", "AMZN"]
//step 1.
// DM.create_list_in_db(4)
//step2. add historical data
// db.add_empty_array_field('main_liquid_stocks_followed_test', 'historical')
//set historical to the file we have

file_handling.read_file('./historical_data/SNAP.json', (history_array)=>{
  logger.log('test')
  logger.log(history_array)
  db.set_historical_data_from_file('main_liquid_stocks_followed_test', 'historical', history_array, "SNAP") 

})
// get_5y_historical_data(0, 4)//test array has  (['FB', "AAPL", "MSFT", "AMZN"])

//step 3. add minutly data

//step 4 add intra array
// db.add_empty_array_field('main_liquid_stocks_followed_test', 'intra')


//test create array, and then push
// const fake_history_array = [1, 2, 3, 45, 55, 554,43,234, 22]
// test_data.forEach((i)=>{
//   DM.insert_historical_data(fake_history_array, i)

// })

//now push data to array 
// DM.add_daily_data(1)

// db.upsert_into_array('main_liquid_stocks_followed_test' , {'historical':{
//   "symbol": "SNAP",
//   "date": "2018-05-04",
//   "open": 11.3,
//   "high": 11.7,
//   "low": 10.96,
//   "close": 11.03,
//   "volume": 159209399,
//   "unadjustedVolume": 159209399,
//   "change": -3.1,
//   "changePercent": -21.939,
//   "vwap": 11.2531
// }},{name:"SNAP"})

// db.get_data_of_last_item_in_history('main_liquid_stocks_followed_test', "SNAP", (date)=>{
//   logger.log(date)
// })


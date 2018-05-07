var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
var symbol_list = require('./stock_data/symbol_list.js')

var express = require('express');
var cors = require('cors')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Stock_model = require('./stock_model.js')
var file_handling = require('./file_handling.js')
var redis = require('./redis')



app.use(express.static('public'))
// app.use(cors)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const port = 55555;
app.listen(port, ()=>{logger.log(`listening on ${port}`)})
// var options = {root: __dirname}
require('./routes.js')(app)

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



function get_monthly_data_and_save_to_file(){
  // console.log(list_of_symbols_by_volume)
  data_fetch.init_get_monthly_data_loop('201805', 1, 3)//1, 3 last ran // next 4, 4? or 3, 4? just need one tomorrow
}

function get_5y_historical_data(start, end){    //good chngce ill never need
  logger.log({ start, end })                    //to run this function
  if (start >= end) return
  setTimeout(() => {                                //Unless the data needs
    DM.top_volume_list(end, (result_array) => {     //to be re downlaoded
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


//TODO run the book intra day function, follow 200 stocks?
function update_book_durring_day(count){
  //try watching 200 stocks every 20 seconds?
  logger.log(count.length)
  data_fetch.init_intraday_watch(count)
}
// update_book_durring_day(100)







//update historical and minutely data via the HTTP API calls
//DM.add_daily_data(1000)//1000 is ok here   //@@ KEEP THIS A MINUTE    //files added up to 5/4
                //TODO LATER
        //test that we dont add duplicates to mintely data
                    //OR                
  //AFTER above ran first
//DM.add_minutely_data(500)//mo bettah  //run 1 OR the other     //this may become daily function




function init_throttled_files_write(list, start, end){
  if (start >= end) return
  setTimeout(() => {
  throttled_files_write_fn(list[start], 1, 3)
  init_throttled_files_write(list, ++start, end)
  }, 100 )
}
function throttled_files_write_fn(symbol, start, end){
  if (start > end) return
  setTimeout(() => {
  const prefix = 201805
  const min = start
  const max = end
    if (start > end) return
    if (start < 10) start = '0' + start
    let day = String(prefix) + String(start)
    // var symbol = "FFFF"
    file_handling.read_file(`../data/main_minutely_data/${symbol + day}.json`, (minutely_array) => {
      // file_handling.read_file(`../data/main_minutely_data/AGGE${day}.json`, (minutely_array) => {
      if (minutely_array == 'err') {
        logger.log("STOP!!!!!!")
        start = max + 1
      } else {
        if (!minutely_array.length) {
          logger.log('empty')
        } else {
          logger.log('got data for '+symbol)
          Stock_model.update({ name: symbol }, { $push: { minutely_data:minutely_array}}, (e)=>{
            if (e) logger.log(`error adding the minutly data ${e}`)
          })
        }
      }
    })
    throttled_files_write_fn(symbol, ++start, end)
  }, 10)
}


//test
// get_monthly_data_and_save_to_file()//runs init get monthly data loop that i hopt to never to again
// data_fetch.test_get_end_of_day_data('FB')//will fetch and insert for given ticker symbol
// DM.pop_previous_data("SNAP")//removes the last element of an array in given ticker symbol
// DM.add_daily_data()//this loops through a file full of all ticker symbols and their data
// get_main_stocks_previous_data(0, 1000) //this will get previous days data NEED to MAKE SURE, not to fuck it up
// get_5y_historical_data(0, 100)//ran with 0, 100
// Stock_model.add_empty_array_field('main_liquid_stocks_followed', 'intra')



//these steps make the initial database, name:name, historical:[data], minutly:[data], intra:[]
// const test_data = ['AAPL', "FB", "MSFT", "AMZN"]
//step 1.
// DM.create_list_in_db(1000)
//step2. add historical data
//set historical to the file we have
//make this loop over all 1000 top volume
//-----adds historical data from files created on 5-3-18
// DM.top_volume_list(1000, (list)=>{
//   logger.log(list)
//   list.forEach((symbol)=>{
//     file_handling.read_file(`./historical_data/${symbol}.json`, (history_array) => {
//       logger.log('test')
//       // logger.log(history_array)
//       logger.log(history_array.length)
//       logger.log(symbol)
//       Stock_model.update({name:[symbol]}, {historical:history_array}, (e, r)=>{
//         logger.log(e)
//         logger.log(r)
//       })
//     })
//   })
// })


//step 3. add minutly data from files
//-----adds minutly data from files created on 5-3-18
// DM.top_volume_list(1000, (list)=>{   //init writes files from possible backups...
//   logger.log(list)                   //used only to populate with old data, 
                                      //try to get up todate from the fetch methods
                                      //DM.add_minute/daily_data
//   init_throttled_files_write(list, 0, list.length)

// })

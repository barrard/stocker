var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
const request = require('request');
const fs = require('fs')

const utils = require('./utils.js');
const DM = require('./data_models.js')
const db = require('./database.js')

const api_prefix = 'https://api.iextrading.com/1.0'
const daily_symbol_quotes = 'daily_symbol_quotes_new'


module.exports = {
  get: (req, cb) => {
    request(api_prefix + req, function (error, response, body) {
      //logger.log('error:', error); // Print the error if one occurred
      //logger.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //logger.log('body:', body); // Print the HTML for the Google homepage.
      // logger.log(body)
      cb(body)
    });
  },
  get_5y_historical_data: (symbol, callback) => {
    var req = `/stock/${symbol}/chart/5y`
    // var req = `/stock/${symbol}/quote`//for testing
    module.exports.get(req, (body) => {
      // logger.log(body)
      if (!body) return
      try {
        const data = JSON.parse(body)
        // logger.log(data)

        callback(data)
      } catch (e) {
        logger.log('Some kind JSON error')
        logger.log(e)
      }
    })
  },
  get_end_of_day_data: (symbol, callback) => {
    var req = `/stock/${symbol}/previous`
    module.exports.get(req, (body) => {
      logger.log(body)
      if (!body) return
      try {
        const data = JSON.parse(body)
        logger.log(data)

        callback(data)
      } catch (e) {
        logger.log('Some kind JSON error')
        logger.log(e)
      }
    })
  },
  get_all_end_of_day_data:()=>{
    logger.log('hi')
  },

  req_and_write_to_file:(api, filename, append_export)=>{
    // module.exports.get(api, (resp)=>{
    //   console.log(resp)
    // } )
    request(api_prefix + api).pipe(fs.createWriteStream(filename).on('error', (err) => {
      logger.log(err)
    }).on('finish', function () {
      if (append_export) {
        utils.prepend_modular(folder + filename)

      }
      console.log('file has been written');
    }))
  },
  init_intraday_watch:(count)=>{
    DM.top_volume_list(count, (list) => {
      logger.log(list.length)
      module.exports.get_intra(list, 0, count)
    });
  },

  init_get_monthly_data_loop:(date_prefix, start, end)=>{
    DM.top_volume_list(500, (list)=>{
      // logger.log(list.length)
      module.exports.get_this(0, list, date_prefix, start, end)
    });

  },

  get_intra: (list, start, end, cb) => {
    const length = list.length
    // logger.log(list)
    if (start >= end) return
    setTimeout(() => {
      let sym = list[start]

      let req = `/stock/${sym}/book`
      logger.log(req)
      module.exports.get(req, (body) => {
        logger.log(body)
        // DM.push_intra_data(body)
        cb(body)
      })

      module.exports.get_intra(list, ++start, end)

    }, 2000);//timer miliseconds

  },
  get_previous: (list, start, end, cb) => {
    logger.log({start, end})
    const length = list.length
    // logger.log(list)
    if (start >= end) return
    setTimeout(() => {
      let sym = list[start]

      let req = `/stock/${sym}/previous`
      // logger.log(req)
      logger.log(sym)
      module.exports.get(req, (body) => {
        logger.log(body)
        cb(body)
        // DM.push_intra_data(body)
      })

      module.exports.get_previous(list, ++start, end, cb)

    }, 200);//timer miliseconds

  },

  get_this: (count, list, date_prefix, start, end)=>{
    logger.log(list.length)
    const length = list.length
    if (count >= length) return
    console.log('go?')
    setTimeout(() => {

      // let symbol = list[count].split('"')[1]
      let str_symol = list[count]
      
      module.exports.get_that(str_symol, date_prefix, start, end)
      module.exports.get_this(++count, list, date_prefix, start, end);

    }, 200);//timer miliseconds

},



  get_that: (sym, date_prefix, start, end)=>{
  var t = date_prefix

    if (start > end) return
    setTimeout(() => {

      if (start < 10) start = '0' + start
      let day = String(t) + String(start)
      // let req = `/stock/${sym.split('"')[1]}/chart/date/${day}`
      let req = `/stock/${sym}/chart/date/${day}`
      // let req = `/stock/${sym.split('"')[1]}/price/`
      // request_count.push(`/stock/${sym}/chart/date/${day}`)
      logger.log(req)
      module.exports.req_and_write_to_file(req, `./main_minutly_data/${sym + day}.json`)
      // data_fetch.get(req, (data)=>{
      //   // push_data: (collectionName, data, name, daily_or_minutly, callback) => {

      //   db.push_data("stocks_list", data, sym , 'minutly_data', (resp)=>{
      //     if(!resp.err) logger.log('succes ')
      //     logger.log(resp.message.result)
      //   })
      // })
      module.exports.get_that(sym, date_prefix, ++start, end)
    }, 50);
}

// get_this(0);




}
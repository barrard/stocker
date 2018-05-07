var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
const fs = require('fs')
const Stock_model = require('./stock_model.js')
const serv = require('./server.js')
const data_fetch = require('./data_fetch')

const ordered_vol_list_filename = 'volume_sort.js'
const model_data = './model_data/';
const main_liquid_stocks_followed = 'main_liquid_stocks_followed_test'

module.exports = {
  top_volume_list:(count, cb)=>{
    logger.log(`getting ticker symbols for top ${count} by volume`)
    const ordered_volume_list = require(model_data + ordered_vol_list_filename);
    const result_array=[]
    for(let x = 0 ; x < count ; x++){
      // result_array[x] = ordered_volume_list['x.data.volume']
      result_array[x] = ordered_volume_list[x].data.symbol
    }
    cb(result_array)
    // cb(['FB', "AAPL", "MSFT", "AMZN"])//for testing
  },
  create_list_in_db: (count)=>{
    module.exports.top_volume_list(count, (list)=>{
      for (let x = 0; x < list.length; x++) {
        logger.log('ubsurred test')
        const query = { name: list[x]}
        var stock = new Stock_model(query)
          Stock_model.findOneAndUpdate(query, stock, {upsert:true}, (e,r)=>{
            if (e) logger.log(e)
            else logger.log(r)
        })
      }
    })
  },
    //Main function for keeping historical data up to date
  add_daily_data: (count) => {
    module.exports.top_volume_list(count, (list) => {
      const length = list.length
      logger.log({ list, length })
                           //list, start, end,   cb
      data_fetch.get_previous_daily(list, 0,   count, (data) => {
        data = JSON.parse(data)
        //logger.log(data)//TODO double check the dates arent equal
        Stock_model.update({name:data.symbol},{$push:{historical:data}}, (e)=>{
          if(e)logger.log(e)
        })
        })
      })
  },
      //Main function for keeping minutely_data up to date
  add_minutely_data: (count) => {
    module.exports.top_volume_list(count, (list) => {
      const length = list.length
      logger.log({ list, length })
                          //list, start, end, cb
      data_fetch.get_previous_minutely(list, 0, count, (data, symbol) => {
        data = JSON.parse(data)
        // logger.log(data)                    
        Stock_model.update({name:symbol},{$push:{minutely_data:data}}, (e)=>{
          if(e)logger.log(e)
        })
          // if (previous_date === data.date) {
          //   logger.log('prevent duplicate')  //possible model function
          // } else {
        
      })
    })
  }


}
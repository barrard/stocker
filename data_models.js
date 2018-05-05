var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
const fs = require('fs')
const db = require('./database.js')
const serv = require('./server.js')
const data_fetch = require('./data_fetch')

const ordered_vol_list_filename = 'volume_sort.js'
const model_data = './model_data/';
const main_liquid_stocks_followed = 'main_liquid_stocks_followed_test'

module.exports = {
  list_by_volume:()=>{
              //assume daily_symbol_quotes,  {empty obj}
    db.aggregate_sort_by_volume('daily_symbol_quotes', {}, (resp)=>{
      if(!resp.err){
        // logger.log(resp)
        fs.writeFile(model_data + ordered_vol_list_filename, JSON.stringify(resp.message), (err) => {
          if (err) throw err;
          logger.log('The file has been saved!');
        });
      }

    }) 

  },

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
        db.insert_once(main_liquid_stocks_followed, { name: list[x] }, (resp) => {
          if (resp.err) logger.log(resp.err)
          logger.log(resp)
        })
      }

    })

  },
  insert_historical_data: (data, ticker) => {
    db.update_at( //collectionName, field, data, at, callback
      main_liquid_stocks_followed,
      'historical',
      data ,
      ticker , 
      (resp)=>{logger.log(resp)})
  },

  push_intra_data: (data) => {
    db.upsert_into_array(
      main_liquid_stocks_followed,
      { intra: data },
      { name: data.symbol })
  },

  push_data_to_field: (field, data) => {
    db.upsert_into_array(
      main_liquid_stocks_followed,
      { [field]: data },
      { name: data.symbol })
  },

  pop_previous_data: (data) => {
    logger.log(data)
    db.pop_from_array(
      main_liquid_stocks_followed,
      { data: -1 },
      { name: data })
  },
  add_daily_data:(count )=>{
    module.exports.top_volume_list(count, (list) => {
      const length = list.length
      // logger.log(length==count)
      logger.log({ list, length })
                              //list, start, end, cb
      data_fetch.get_previous(list, 0, count, (data)=>{
        data = JSON.parse(data)
        logger.log(data)
        db.get_data_of_last_item_in_history('main_liquid_stocks_followed_test', data.symbol, (previous_date) => {
          if(previous_date === data.date){
            logger.log('prevent duplicate')
          }else{
            logger.log('add data')
            module.exports.push_data_to_field('historical', data)

          }

        })

        //insert into DB??

      })

      // for (let x = 0; x < length; x++) {
        //fetch the previous data

        // var previous_symbol_quote = list[x]
        // logger.log(previous_symbol_quote)
        // logger.log(previous_symbol_quote.symbol)
        // adding to the array
        // module.exports.push_data_to_field('historical', previous_symbol_quote)
        // db.upsert_into_array(main_liquid_stocks_followed, {}, { name: list_of_symbols_by_volume[x] })

      // }


    })

    // const previous_market_quotes = require('./all_symbols_previous_data/20180502.json')
    // const sym_arr = Object.keys(previous_market_quotes)
    // const list = [{ symbol: 'FB', data: 9999999 },
    //                     { symbol: 'MSFT', data: 9999999 },
    //                   { symbol: 'AMZN', data: 9999999 },
    //                   { symbol: 'AAPL', data: 9999999 }]




  }


}
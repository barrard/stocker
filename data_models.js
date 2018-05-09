var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
const fs = require('fs')
const Stock_model = require('./stock_model.js')
const serv = require('./server.js')
const data_fetch = require('./data_fetch')
const utils = require('./utils.js');

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
    Stock_model.findOne({}, {'historical.date':1}, (err, resp)=>{
      if(err)return
      var resp = resp.historical
      var last = resp[resp.length - 1].date

      var last_date = utils.date_parser(last)
      logger.log(`The last date is ${last_date}`)
      var my_time = new Date()
      if (my_time.getDay() == 0 || my_time.getDay() == 6 ){         //Make sure its not the weekend
        logger.log('ITS THE FREAKIN WEEKEND!!')
        logger.log(my_time.getDay())  
      }else{                                                        //make sure you dont already have the data
        var my_date = my_time.getDate()                             //by hecking the date in db and current
        logger.log(`my current new date is ${my_time.getDate()}`)
        if (my_date === last_date) {
          logger.log('No neeeeed')
        } else {
          logger.log('lets get differernt data')

          data_fetch.get_previous_daily(['MSFT'], 0, 1, (data) => {
            data = JSON.parse(data)
            // logger.log(data)

          utils.check_available_data_is_new(my_date, data.date)

          // module.exports.top_volume_list(count, (list) => {
          //   const length = list.length
          //   logger.log({ list, length })
          //                             //list, start, end,   cb
          //   data_fetch.get_previous_daily(list, 0, count, (data) => {
          //     data = JSON.parse(data)
          //     Stock_model.update({ name: data.symbol }, { $push: { historical: data } }, (e) => {
          //       if (e) logger.log(e)
          //     })
          //   })
          // })
          })

        }
      }
    })

  },
      //Main function for keeping minutely_data up to date
  add_minutely_data: (count) => {

    Stock_model.findOne({}, { 'minutely_data.date': 1 }, (err, resp) => {
      if (err) return
      // logger.log(resp)
      var last_date = resp.minutely_data[resp.minutely_data.length-1].date
      last_date = utils.date_parser(last_date)
      console.log(`The last date is ${last_date}`)
      var my_time = new Date()
      if (my_time.getDay() == 0 || my_time.getDay() == 6) {         //Make sure its not the weekend
        logger.log('ITS THE FREAKIN WEEKEND!!')
        logger.log(my_time.getDay())
      } else {                                                        //make sure you dont already have the data
        var my_date = my_time.getDate()                             //by hecking the date in db and current
        console.log(`my current new date is ${my_time.getDate()}`)
        if (my_date === last_date) {
          logger.log('No neeeeed')
        } else {
          logger.log('lets get differernt data')
          data_fetch.get_previous_minutely(['MSFT'], 0, 1, (data, symbol) => {
            data = JSON.parse(data)

            utils.check_available_data_is_new(my_date, data[0].date)



          // module.exports.top_volume_list(count, (list) => {
          //   const length = list.length
          //   logger.log({ list, length })
          //   //list, start, end, cb
          //   data_fetch.get_previous_minutely(list, 0, count, (data, symbol) => {
          //     data = JSON.parse(data)
          //     // logger.log(data)                    
          //     Stock_model.update({ name: symbol }, { $push: { minutely_data: data } }, (e) => {
          //       if (e) logger.log(e)
          //     })
          //   })
          // })
          })

        }
      }

    })



  }


}
var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
const fs = require('fs')
var file_handling = require('./file_handling.js');
var data_fetch = require('./data_fetch.js');

module.exports = {
  // prepend_modular('./all_symbols_previous_data/20180502.js')
  //@@@@@@  nice utility, append exports to begining
  prepend_modular:(filename, new_data)=>{
    file_handling.prepend_file_with_data(filename, new_data, ()=>{
      logger.log(`${filename} was prepended with ${new_data}`)
    })
  },
  check_available_data_is_new:(my_date, data_date)=>{
    //verify the new data is for today
    // logger.log(my_date)
    // logger.log(data_date)
    const data_day = module.exports.date_parser(data_date)
    logger.log(`data_day == my_date? ${data_day == my_date}`)
    return (data_day == my_date)


  },
  date_parser:(date_string)=>{
    var last;
    // logger.log(date_string)
    if((date_string).split('-').length == 1){
      // logger.log('wait just a minutely')
      date_string.split('')
      var rearranged = []
      var year = date_string[0] + date_string[1] + date_string[2] + date_string[3]
      var month = date_string[4] + date_string[5]
      var day = date_string[6] + date_string[7]
      rearranged[0] = month
      rearranged[1] = day
      rearranged[2] = year
      // logger.log(rearranged)
    }else{
      last = date_string.split('-')
      // logger.log(last)
      var rearranged = []
      rearranged[0] = last[1]
      rearranged[1] = last[2]
      rearranged[2] = last[0]
    }
    last = rearranged.join(' ')
    return new Date(last).getDate()
  }

}
var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
const fs = require('fs')
var file_handling = require('./file_handling.js')

module.exports = {
  // prepend_modular('./all_symbols_previous_data/20180502.js')
  //@@@@@@  nice utility, append exports to begining
  prepend_modular:(filename, new_data)=>{
    file_handling.prepend_file_with_data(filename, new_data, ()=>{
      logger.log(`${filename} was prepended with ${new_data}`)
    })
  }

}
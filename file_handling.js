var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
var fs = require('fs')

var Stock_model = require('./stock_model.js')
var Missing_Stock_model = require('./models/missing_stock_model.js')



module.exports = {

  create_file_with_data: (filename, data, callback) => {
    fs.writeFile(filename, JSON.stringify(data), { flag: 'w+' }, (err) => {
      if (err) logger.log(err)
      if (callback) callback()
    })
  },

  append_file_with_data: (filename, data, callback) => {
    fs.writeFile(filename, data, { flag: 'a+' }, (err) => {
      if (err) logger.log(err)
      if (callback) callback()
    })
  },
  prepend_file_with_data: (filename, new_data, callback) => {
    var old_data = fs.readFileSync(filename); //read existing contents into data
    var fd = fs.openSync(filename, 'w+');
    var buffer = new Buffer(new_data);

    fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
    fs.writeSync(fd, old_data, 0, old_data.length, buffer.length); //append old data
    // or fs.appendFile(fd, data);
    fs.close(fd);
    if (callback) callback()
  },
  read_file:(filename, cb)=>{
    fs.readFile(filename, (err, data)=>{
      if (!err) cb(JSON.parse(data.toString()))
      else if(err){
        cb('err')
        logger.log(`missing ${filename}`)
        var symbol = filename.split('/')
        symbol = symbol[symbol.length-1]
        symbol = symbol.split('').slice(0, -13).join('')
        logger.log(symbol)
        const query = { name: symbol }
        var stock = new Missing_Stock_model(query)
        Missing_Stock_model.findOneAndUpdate(query, stock, { upsert: true }, (e, r) => {
          if (e) logger.log(`e for ${filename}`)
          else logger.log(r)
        })
        // Stock_model.insert_once('missing_minutely_data', {name:symbol}, (resp)=>{
        //   logger.log(resp)
        // })
        
        //this shouldnt run all the time
        //this will make a list of symbols that we dont have minutely data for
        // logger.log(err)
      }
    })
  },
  delete:(filename)=>{
    fs.unlink(filename, (err)=>{
      if(!err)logger.log(`${filename} deleted`)
      else{logger.log(`error: ${err}`)}

    })
  }
  


}


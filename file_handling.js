var fs = require('fs')

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
    })
  }
  


}


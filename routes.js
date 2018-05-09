var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
const Stock_model = require('./stock_model.js')
var redis = require('./redis')

module.exports = (app)=>{

  //  / history
  //  / minute
  //  / intra
  //  / news

  app.get('/stock/:symbol/:type/', (req, res)=>{
    logger.log(req.params)
    const symbol = String(req.params.symbol).toUpperCase()
    const type = req.params.type

    redis.get(JSON.stringify({ symbol, type,}), (e, r)=>{
      logger.log(e)
      // logger.log(r)


      if(!r){
        logger.log('not in redis, look in databse')
        Stock_model.find({ name: symbol }, { [type]: 1 }, (err, resp) => {
          // logger.log(err)
          // logger.log(resp)
          res.send({ symbol, type, resp })
          redis.set(JSON.stringify({ symbol, type }), JSON.stringify(resp))

        })
          .sort({ 'date': 1 })
          .find(() => { logger.log(`Found symbol - ${symbol}, type: ${type}`) })
      }else if (r){
        logger.log('found in redis!!')

        var resp = JSON.parse(r)
        // logger.log(j)
        res.send({ symbol, type, resp })
      }
    })



  })




  app.get('/stocker', (req, res) => {
    logger.log('APPPPP')
    res.sendFile(`${__dirname}/index.html`, (err) => {
      if (err) logger.log(err)
    })
  })
}
var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
var redis = require('./redis')
var volume_sorted_list = require('./model_data/volume_sort.js')
var Stock_model = require('./stock_model.js')
const possible_time_frames = ['historical', 'minutely_data']

module.exports = {
  get_list_of_stocks:(limit)=>{
    var stock_list = []
    volume_sorted_list.forEach((stock, count) => {
      if (count < limit) {
        stock_list.push(stock.name)
        // logger.log(`${count} ${stock.name}`)
      }
    })
    return stock_list

  },

  find_stocks_near_MA: (limit, MA, time_frame, variable_compare_value_low, variable_compare_value_high, cb) => {

    var list = module.exports.get_list_of_stocks(limit)
    // logger.log(list.length)
    list.forEach((stock_name)=>{
      // logger.log(stock_name)
      Stock_model.find({ name: stock_name }, { [time_frame]: 1 }, (err, data) => {
        var data = data[0][time_frame]

      
        // logger.log('is an array')
        MA.forEach((MA) => {
          var sliced_data = data.slice(MA * -1)

          // logger.log(sliced_data.length)
          cal_MA(MA, sliced_data, (MA_data) => {
            var last_close = (sliced_data.slice(-1)[0].close)
            // logger.log(`the last closeing price of ${stock_name} is ${last_close}`)
            // logger.log(`the MA ${MA} is at ${MA_data}`)
            var diff, type
            if (last_close > MA_data) {
              //stock is abouve the MA
              diff = last_close - MA_data
              type = 'above'
              // logger.log(`diff is ${diff}`)
              // logger.log(`relative divverence = ${diff/last_close * 100}`)

            } else {
              //stock is below the MA
              diff = MA_data - last_close
              type = 'below'
              // logger.log(`diff is ${diff}`)
              // logger.log(`relative divverence = ${diff / last_close * 100}`)

            }
            var relative_diff = ( diff / last_close) * 100
            if ( (variable_compare_value_low < relative_diff) && (relative_diff < variable_compare_value_high)) {
              logger.log(`${stock_name} is ${relative_diff} ${type} the ${MA} moving average`)

              cb({last_close, stock_name,relative_diff,type,MA  })
            }
            // logger.log(`/////////            LINE BREAK        //////////////////`)
          })
        })



      })

    })


  },

  back_test_stocks_near_MA: (limit, MA, time_frame) => {
    var list = module.exports.get_list_of_stocks(limit)
    // logger.log(list.length)
    list.forEach((stock_name)=>{
      if(time_frame == 'historical'){
        Stock_model.find({ name: stock_name}, {'historical':1}, (err, data)=>{
          // logger.log(data.length)
        })

      }else if (time_frame == 'minutely'){
        Stock_model.find({ name: stock_name }, { 'minutely': 1 }, (err, data) => {
          // logger.log(data.length)

        })
      }
    })


  },
  // find_highs_and_lows(require('./stock_data/fb_5y.js'))
  find_highs_and_lows:(data)=>{
  logger.log(data.length)
  const pivot_array = [data[0].low]
  const high_low_obj = { 'start': data[0].low, 'high': [], 'low': [] }//possible trend traker
  var high = 0; var low = 0;
  var prev_low_value = data[0].low;
  var prev_high_value = data[0].high;
  // var prev_compare_value = data[0].open
  var higher_high_count = 0
  var higher_low_count = 0
  var lower_low_count = 0
  var lower_high_count = 0
  var side_counter = 0;
  var difference = 0;

  data.forEach(point => {

    //lower low -> this is going down
    if (point.low < prev_low_value) {
      logger.log('lower low')
      prev_low_value = point.low
      //add to the trend tracker
      high_low_obj.low.push({ lower_low_count: point.low })
      //increment the lower_low_count++
      lower_low_count++
      //OR
      //higher low -> this is going up
    } else if (point.low > prev_low_value) {
      //if down trend count is above 1(?) 
      //the previous trend was down
      // then we have switched from down -> up (bottom?)
      if (lower_low_count > 1) {
        pivot_array.push(prev_low_value)//add the bottom value..
        logger.log('we switched')//notify the switch
        lower_low_count = 0 //reset the downward trend
        //increment uptrend? not yet....
        //possible side movement..
        side_counter++
      } else {
        //we are in up trend
        higher_low_count++
      }

    }
    //high high  ->  this is going up
    if (point.high > prev_high_value) {
      logger.log('high high')
      high_low_obj.high.push({ higher_high_count: point.high })

      higher_high_count++
      prev_high_value = point.high
      //OR
      //lower high  ->  this is going down
    } else if (point.high < prev_high_value) {
      //if up trend is greater than 1
      //the previous trend was up
      //then we switched from up  ->  down (top?)
      if (higher_high_count > 1) {
        pivot_array.push(prev_high_value)
        logger.log('we switched')
        higher_high_count = 0
        side_counter++
      } else {
        //we are down trending
        lower_high_count++
      }
    }
  });
  logger.log({
    pivot_array,
    high_low_obj,
    high,
    low,
    side_counter,
    prev_low_value,
    prev_high_value,
    lower_low_count,
    higher_low_count,
    higher_high_count,
    lower_high_count
  })

}

}



function cal_MA(MA, data, cb) {
  var raw_data = []
  var MA = parseInt(MA)
  // logger.log(data.length)
  data.forEach((d, count) => {
    let close = d.close
    if (close == 0 || close == undefined) {
      close = d.marketAverage
    }
    raw_data.push(close)
  })
  let sum = raw_data.reduce((acc, val) => {
    return (acc + val);
  })
  let avg = parseFloat(sum / MA).toFixed(2)
  cb(avg)
  }


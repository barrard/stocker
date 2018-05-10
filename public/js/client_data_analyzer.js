var Client_data_analyzer = {
  find_highs_and_lows: (data, cb) => {
    console.log(data.length)
    const pivot_array = [{0:data[0]}]
    const high_low_obj = { 'start': data[0].low, 'higher_high': [], 'lower_low': [] }//possible trend traker
    var high = 0; var low = 0;
    var prev_value = data[0];
    // var prev_compare_value = data[0].open
    var higher_high_count = 0
    var higher_low_count = 0
    var lower_low_count = 0
    var lower_high_count = 0
    var side_counter = 0;
    var difference = 0;

    data.forEach((point, bar_count) => {
      // console.log(bar_count)

      //lower low -> this is going down
      if (point.low < prev_value.low) {
        console.log('lower low')
        prev_value.low = point.low
        //add to the trend tracker
        high_low_obj.lower_low.push({[bar_count]:point})
        //increment the lower_low_count++
        lower_low_count++
        //OR
        //higher low -> this is going up
      } else if (point.low > prev_value.low) {
        //if down trend count is above 1(?) 
        //the previous trend was down
        // then we have switched from down -> up (bottom?)
        if (lower_low_count > 1) {
          pivot_array.push({[bar_count]:prev_value})//add the bottom value..
          console.log('we switched')//notify the switch
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
      if (point.high > prev_value.high) {
        console.log('high high')
        high_low_obj.higher_high.push({[bar_count]:point} )

        higher_high_count++
        prev_value.high = point.high
        //OR
        //lower high  ->  this is going down
      } else if (point.high < prev_value.high) {
        //if up trend is greater than 1
        //the previous trend was up
        //then we switched from up  ->  down (top?)
        if (higher_high_count > 1) {
          pivot_array.push({[bar_count]:prev_value})
          console.log('we switched')
          higher_high_count = 0
          side_counter++
        } else {
          //we are down trending
          lower_high_count++
        }
      }
    });

    const results = {
      pivot_array,
      high_low_obj,
      high,
      low,
      side_counter,
      prev_value,
      lower_low_count,
      higher_low_count,
      higher_high_count,
      lower_high_count
    }
    // console.log(results)
    cb(results)
  }
}
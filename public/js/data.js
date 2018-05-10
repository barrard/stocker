var Main_data = {
  historical: {},
  minutely_data: {},
  canvas_data:[
    { candle_width      :3,
      space_between_bars:1
      }
  ]
} 

        //symbol, count, time_frame, cb
get_chart("SNAP", 3000, "historical", (data)=>{
  Client_data_analyzer.find_highs_and_lows(data, (results)=>{
    console.log(results)
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    results.pivot_array.forEach(element => {

      
    });
  })
}) 

function draw_high_low(candle_position, min_max, candle_data, candle_width) {
  var number_of_pennies = (min_max.max - min_max.min) * 100
  var pennies_per_pixel = (number_of_pennies / canvas.height)
  var pixels_per_penny = (canvas.height / number_of_pennies)
  // console.log({ pennies_per_pixel })
  // console.log({ pixels_per_penny })

  const total_range_in_pennies = canvas.height * pennies_per_pixel
  // console.log({total_range_in_pennies})
  // console.log({ candle_data})
  // console.log((min_max.max - candle_data.high) * 100 * pixels_per_penny)
  // console.log((min_max.max - candle_data.low) * 100 * pixels_per_penny)
  // console.log(candle_position + (candle_width / 2))
  context.beginPath();
  context.moveTo(candle_position + (candle_width / 2), (min_max.max - candle_data.high) * 100 * pixels_per_penny);
  context.lineTo(candle_position + (candle_width / 2), (min_max.max - candle_data.low) * 100 * pixels_per_penny);
  context.stroke();

  //candle rect
  var candle_height;
  if (candle_data.open > candle_data.close) {
    // console.log('red')
    context.fillStyle = 'red';
    candle_height = (candle_data.open - candle_data.close) * 100 * pixels_per_penny
  } else if (candle_data.open == candle_data.close) {
    // console.log('black')
    context.fillStyle = 'black';
    candle_height = 10

  } else {
    // console.log('green')
    context.fillStyle = 'green';
    candle_height = (candle_data.close - candle_data.open) * 100 * pixels_per_penny
  }
  context.fillRect((candle_position + (candle_width / 2)) - (candle_width / 2), (min_max.max - candle_data.open) * 100 * pixels_per_penny,
    candle_width, candle_height)
  //open line 
  // context.moveTo((candle_position + (candle_width/2))-(candle_width/2), high - candle_data.open);
  // context.lineTo((candle_position + (candle_width/2)) + (candle_width / 2), high - candle_data.open)
  // context.stroke();

  //closing line


}




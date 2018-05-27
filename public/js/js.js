var canvas = document.getElementById('myCanvas');
var volume_canvas_overlay = document.getElementById('volume_canvas_overlay');
var context = canvas.getContext('2d');
var vol_ctx = volume_canvas_overlay.getContext('2d')
var canvas_height_manual_setting = false
// canvas.width = window.innerWidth
console.log(canvas.width)
console.log(canvas.height)
// context.beginPath();
// context.rect(188, 50, 200, 100);
// context.fillStyle = 'yellow';
// context.fill();
vol_ctx.lineWidth = 1;
vol_ctx.strokeStyle = 'black';
context.lineWidth = 1;
context.strokeStyle = 'black';
// context.stroke();
// context.beginPath();
// context.moveTo(50, 50);
// context.lineTo(250, 150);
// context.stroke();
// var data = [
//   { low: 0, high: 66, open: 30, close: 40 },
//   { low: 10, high: 55, open: 25, close: 12 },
//   { low: 20, high: 45, open:20, close: 22 },
//   { low: 6, high: 33, open: 33, close: 30 },
//   { low: 45, high: 77, open: 46, close: 70 },
//   { low: 11, high: 44, open: 20, close: 12 },
//   { low: 15, high: 45, open: 33, close: 16 },
//   { low: 37, high: 39, open: 38, close: 40 },
//   { low: 47, high: 66, open: 50, close: 50 },
// ]



//number of candles x = 0; x++, mark the left and right boundaries
//candle width = total candles, width of canvas
//ex 100 candles, by 500px canvas = each candle is 5px (500/100)
//overal high and low will mark top and bottom boundaries
//ex, 100 candles, high 100, low 0


var candle_stick_width_range_input = document.getElementById('candle_stick_width_range_input');
var candle_stick_space_between = document.getElementById('candle_stick_space_between');

var candle_stick_width_range_input_value = document.getElementById('candle_stick_width_range_input_value')

candle_stick_width_range_input_value.innerText = candle_stick_width_range_input.value

var hidden_span = document.createElement('span')
hidden_span.innerText = "0"
hidden_span.style.visibility = "hidden"
hidden_span.style.color = "red"
candle_stick_width_range_input_value.appendChild(hidden_span)

candle_stick_space_between.addEventListener('input', ()=>{
  let value = parseInt(candle_stick_space_between.value)
  candle_stick_space_between_value.innerText = value
  Main_data.canvas_data[0].space_between_bars = value
  get_chart_btn.click()

})
                                                                                //Candle stick slider event handler
candle_stick_width_range_input.addEventListener('input', () => {
  var value = parseInt(candle_stick_width_range_input.value)
  candle_stick_width_range_input_value.childNodes[0].nodeValue = value
  Main_data.canvas_data[0].candle_width = value
  if(value > 9){hidden_span.style.display = "none"
          }else{hidden_span.style.display = "inline"}
  //redraw the chart with bigger candle sticks, 
  get_chart_btn.click()



})

// candle_stick_width_range_input.addEventListener('onchange', () => {
//   console.log('dfgdfgdfgdfg')
// })
function draw_chart(data, canvas, candle_width, space_between_bars) {
  var min_max = Main_data.canvas_data[0].min_max
  console.log(min_max)

  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  Main_data.canvas_data[0].volume_canvas.getContext('2d').clearRect(0, 0, Main_data.canvas_data[0].volume_canvas.width, Main_data.canvas_data[0].volume_canvas.height)
  // context.lineWidth = 3;
  // context.strokeStyle = 'black';
  // console.log({ min_max })
  // canvas.width = data.length * candle_width + (space_between_bars*data.length)

  // console.log(`Candle_width arg = ${candle_width}`)
  // console.log(`space betweeen candle = ${space_between_bars}`)
  // if (!canvas_height_manual_setting) canvas.height = (min_max.max - min_max.min) * 10
  if (!candle_width){
    candle_width = canvas.width/data.length
    }

  if (!space_between_bars){
    space_between_bars=0
  }

  //add vertival time markers, every 10%?
  //lazy 20%
  let date_marker_position = Math.floor(data.length / 10)
  console.log(date_marker_position)
  console.log(data.length % date_marker_position)

console.log(data.length)
  console.log(`Candle width = ${candle_width}`)
const vol_canvas = Main_data.canvas_data[0].volume_canvas

  var number_of_pennies = (min_max.max - min_max.min) * 100
  var pennies_per_pixel = (number_of_pennies / canvas.height)
  var pixels_per_penny = (canvas.height / number_of_pennies)
  Main_data.canvas_data[0].pixels_per_penny = pixels_per_penny
  Main_data.canvas_data[0].pennies_per_pixel = pennies_per_pixel
  // var vol_range = (min_max.max - min_max.min) * 100
  var pixels_per_vol = (vol_canvas.height / min_max.vol_max)
  Canvas_Markers.draw_price_markers(min_max)
  Canvas_Markers.draw_studies(data)
  data.forEach((data, count)=>{
    const candle_position = (count * candle_width) + (space_between_bars * count)

    if (count % date_marker_position == 0) Canvas_Markers.draw_date_marker(candle_position, candle_width, data, canvas)
    
    draw_candle(candle_position, data, candle_width, pixels_per_penny, pixels_per_vol)
  })  
  document.querySelectorAll('input[name="MA"]').forEach((check_box) => {
    if (check_box.checked) {
      Canvas_Markers.draw_MA(check_box.value)
    }
  })


}

// draw_candle(1, 100, 0, {low:0, high:80, open:75, close:80})
function draw_candle(candle_position, candle_data, candle_width, pixels_per_penny, pixels_per_vol){
  var min_max = Main_data.canvas_data[0].min_max

  // console.log({ pennies_per_pixel })
  // console.log({ pixels_per_penny })

// const total_range_in_pennies = canvas.height*pennies_per_pixel
// console.log({total_range_in_pennies})
  // console.log({ candle_data})
  // console.log((min_max.max - candle_data.high) * 100 * pixels_per_penny)
  // console.log((min_max.max - candle_data.low) * 100 * pixels_per_penny)
  // console.log(candle_position + (candle_width / 2))
  context.beginPath();
  context.moveTo(candle_position + (candle_width / 2), (min_max.max-candle_data.high)*100*pixels_per_penny);
  context.lineTo(candle_position + (candle_width / 2), (min_max.max - candle_data.low) * 100 * pixels_per_penny);
  context.stroke();

  //candle rect
  var candle_height;
  if(candle_data.open > candle_data.close){
    // console.log('red')
    context.fillStyle = 'red';
    candle_height = (candle_data.open - candle_data.close)*100*pixels_per_penny
  }else if(candle_data.open == candle_data.close){
    // console.log('black')
    context.fillStyle = 'black';
    candle_height = 1

  }else{
    // console.log('green')
    context.fillStyle = 'green';
    candle_height = (candle_data.close - candle_data.open)*100*pixels_per_penny
  }
  Canvas_Markers.draw_volume(candle_position, min_max, candle_data, candle_width, context.fillStyle, pixels_per_vol)

  context.fillRect(candle_position , (min_max.max - candle_data.open) * 100 * pixels_per_penny,
                    candle_width, candle_height)
  //open line 
  // context.moveTo((candle_position + (candle_width/2))-(candle_width/2), high - candle_data.open);
  // context.lineTo((candle_position + (candle_width/2)) + (candle_width / 2), high - candle_data.open)
  // context.stroke();

  //closing line


}


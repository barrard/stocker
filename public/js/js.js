var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var canvas_height_manual_setting = false
// canvas.width = window.innerWidth
console.log(canvas.width)
// context.beginPath();
// context.rect(188, 50, 200, 100);
// context.fillStyle = 'yellow';
// context.fill();
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
var candle_stick_width_range_input_value = document.getElementById('candle_stick_width_range_input_value')

candle_stick_width_range_input_value.innerText = candle_stick_width_range_input.value

var hidden_span = document.createElement('span')
hidden_span.innerText = "0"
hidden_span.style.visibility = "hidden"
hidden_span.style.color = "red"
candle_stick_width_range_input_value.appendChild(hidden_span)

                                                                                //Candle stick slider event handler
candle_stick_width_range_input.addEventListener('input', () => {
  var value = parseInt(candle_stick_width_range_input.value)
  candle_stick_width_range_input_value.childNodes[0].nodeValue = value
  Main_data.canvas_data[0].candle_width = value
  if(value > 9){hidden_span.style.display = "none"
          }else{hidden_span.style.display = "inline"}
  //redraw the chart with bigger candle sticks, 
  get_chart_btn.click('custon data')




  

})

// candle_stick_width_range_input.addEventListener('onchange', () => {
//   console.log('dfgdfgdfgdfg')
// })
function draw_chart(min_max, data, canvas, candle_width) {
  console.log(`Candle_width arg = ${candle_width}`)
  if (!canvas_height_manual_setting) canvas.height = min_max.max - min_max.min
  if (!candle_width){candle_width = 3}
  canvas.width = data.length * candle_width

  console.log(`Candle width = ${candle_width}`)
  data.forEach((data, count)=>{
    draw_candle(count*candle_width, min_max, data, candle_width)
  })  
}

// draw_candle(1, 100, 0, {low:0, high:80, open:75, close:80})
function draw_candle(candle_position, min_max, candle_data, candle_width){
  // console.log(candle_data)
  var high = min_max.max
  var low = min_max.min
  context.beginPath();
  context.moveTo(candle_position+(candle_width/2), high-candle_data.high);
  context.lineTo(candle_position + (candle_width/2), high - candle_data.low);
  context.stroke();

  //candle rect
  var candle_height;
  if(candle_data.open > candle_data.close){
    // console.log('red')
    context.fillStyle = 'red';
    candle_height = candle_data.open - candle_data.close
  }else if(candle_data.open == candle_data.close){
    // console.log('black')
    context.fillStyle = 'black';
    candle_height = 1

  }else{
    // console.log('green')
    context.fillStyle = 'green';
    candle_height = candle_data.close - candle_data.open
  }
  context.fillRect((candle_position + (candle_width/2)) - (candle_width / 2),  high - candle_data.open,
                    candle_width, candle_height)
  //open line 
  // context.moveTo((candle_position + (candle_width/2))-(candle_width/2), high - candle_data.open);
  // context.lineTo((candle_position + (candle_width/2)) + (candle_width / 2), high - candle_data.open)
  // context.stroke();

  //closing line


}


function get_min_max(){
  console.log('hi')

}





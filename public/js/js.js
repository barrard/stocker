var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var canvas_height_manual_setting = false
canvas.width = window.innerWidth
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


function draw_chart(high, data, canvas) {
  if (!canvas_height_manual_setting) canvas.height = high

  var candle_width = canvas.width/data.length
  data.forEach((data, count)=>{
    draw_candle(count*candle_width, high, data, candle_width)
  })  
}

// draw_candle(1, 100, 0, {low:0, high:80, open:75, close:80})
function draw_candle(candle_position, high, candle_data, candle_width){
  // console.log(candle_data)
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




var cb = document.getElementById('canvas_btn')
cb.addEventListener('click', ()=>{
  canvas_height_manual_setting = true;
  canvas.height == 100 ? canvas.height = 1000 : canvas.height = 100
  // draw_chart(100, data, canvas)

})
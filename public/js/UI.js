
var get_chart_btn = document.getElementById('get_chart_btn')

// draw_chart(high, data, canvas
get_chart_btn.addEventListener('click', (e)=>{
  // console.log(e)
  var radios = document.getElementsByName('time-frame');

  for (var i = 0, length = radios.length; i < length; i++) {
    var time_frame
    if (radios[i].checked) {time_frame = radios[i].value;break;}
    if(i == radios.length-1){
      console.log('NOTHING SELECTED')
      handle_animation(radios, 'shake')

    }
  }
  var symbol = document.getElementById('symbol_input').value
  var count = document.getElementById('number_input').value
  get_chart(symbol, count, time_frame, (data) => {
    var candle_width = Main_data.canvas_data[0].candle_width
    var space_between_bars = Main_data.canvas_data[0].space_between_bars
    //need to find visible range
    //get the width, and find how many bars are shown
    let width = canvas.width
    let candle_count = width / (candle_width + space_between_bars)
    let additional_candle_space = (candle_count * space_between_bars) / candle_width
    let total_bars_visible = Math.floor(candle_count - additional_candle_space)
    let x_offset = Main_data.canvas_data[0].x_offset/(candle_width+space_between_bars)
    let data_length = data.length
    console.log({ candle_count, width, additional_candle_space, total_bars_visible, data_length, x_offset})
  var new_data
    if (x_offset == 0 ){
       new_data = data.slice(candle_count * -1)

    } else {

      let end_of_data = data_length - x_offset - candle_count
      if(end_of_data < 0 ) end_of_data = 0; 
      if(x_offset + candle_count > data_length) Main_data.canvas_data[0].x_offset = x_offset = data_length - candle_count;

       new_data = data.slice(end_of_data, (x_offset*-1))

    }
    // var data = data.slice(candle_count * -1)

    // console.log(new_data)
    if (new_data){
      var max_min = ()=>{
        var max = 0       //low number that is lower than any high
        var min = 10000000 //some big number that is larger than any lows
        new_data.forEach(data_point => {
          if (data_point.high > max) {
            max = data_point.high
          }
          if (data_point.low < min && data_point.low > 0) {
            min = data_point.low
          }

        });
        return {max, min}
      }

      draw_chart(max_min(), new_data, canvas, candle_width, space_between_bars)

      console.log(max_min())
      // console.log(max)
      // console.log(min)
    }

  })

})

function stop_drag(e) {
  let canvas = Main_data.canvas_data[0].canvas;
  canvas.removeEventListener('mouseup', stop_drag)

  canvas.removeEventListener('mousemove', change_x_offset)

  console.log('remove listeners')


}
function change_x_offset(e) {
  var old_offset = Main_data.canvas_data[0].x_offset
  var new_offset = old_offset + (e.x - Main_data.canvas_data[0].prev_x)
  if (new_offset < 0) new_offset = 0;
  Main_data.canvas_data[0].x_offset = new_offset
  console.log(new_offset)
  Main_data.canvas_data[0].prev_x = e.x

  get_chart_btn.click()

}

window.addEventListener('load', ()=>{
  var canvas = document.getElementById('myCanvas');
  Main_data.canvas_data[0].canvas = canvas
  var context = canvas.getContext('2d');
  canvas.width = window.innerWidth
  console.log(window.innerWidth)
  console.log(window.innerHeight)
  var x_offset = Main_data.canvas_data[0].x_offset = 0;
  var prev_x = Main_data.canvas_data[0].prev_x;
  canvas.addEventListener('mousedown', (e)=>{
    e.preventDefault()
    if (!x_offset) Main_data.canvas_data[0].prev_x = prev_x = e.x;
    // console.log(e.x)
    console.log(x_offset)
    canvas.addEventListener('mousemove', change_x_offset)
    canvas.addEventListener('mouseup', stop_drag)

  console.log('mousedown')
})
})

window.addEventListener("resize", ()=>{
  var canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth
  get_chart_btn.click()
})


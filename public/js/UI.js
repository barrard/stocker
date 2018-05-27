
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
      toast('Please select a time frame', 'error')
      return

    }
  }
  var symbol = document.getElementById('symbol_input').value
  var count = document.getElementById('number_input').value
  get_chart(symbol, count, time_frame, (data) => {
    // toast(`done searching for  ${symbol}`, 'info')
    Canvas_Markers.stop_spinner();
    if(!data || !data.length){
      toast(`No data found for ${symbol}`, 'error')
      return
    }
    Canvas_Markers.check_MA_data(symbol, data)

    // toast(`Data found for ${symbol}`, 'done')

    Main_data.canvas_data[0].data_loaded = true
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
  let new_data
    if (x_offset == 0 ){
       new_data = data.slice(candle_count * -1)

    } else {

      var end_of_data = data_length - x_offset - candle_count
      if(end_of_data < 0 ) end_of_data = 0; 
      if(x_offset + candle_count > data_length) Main_data.canvas_data[0].x_offset = x_offset = data_length - candle_count;

       new_data = data.slice(end_of_data, (x_offset*-1))

    }
    console.log({ candle_count, width, additional_candle_space, total_bars_visible, data_length, x_offset, end_of_data })

    // var data = data.slice(candle_count * -1)

    // console.log(new_data)
    // if (new_data){
    var min_max = ()=>{
        var max = 0                   //low number that is lower than any high
        var min = 10000000            //some big number that is larger than any lows
        // var vol_min = 9999999999999999//low number that is lower than any high
        var vol_max = 0               //some big number that is larger than any lows
        new_data.forEach(data_point => {
          if (data_point.high > max) {
            max = data_point.high
          }
          if (data_point.low < min && data_point.low > 0) {
            min = data_point.low
          }
          if (data_point.volume > vol_max) {
            vol_max = data_point.volume
          }
          // if (data_point.volume < vol_min && data_point.volume > 0) {
          //   vol_min = data_point.volume
          // }

        });
        return {max, min, vol_max}
      }
    Main_data.canvas_data[0].min_max = min_max()

      draw_chart(new_data, canvas, candle_width, space_between_bars)

      // console.log(max_min())
      // console.log(max)
      // console.log(min)
    // }

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
  const width = window.innerWidth * .95

  var canvas = document.getElementById('myCanvas');
  var crosshair_overlay = document.getElementById('crosshair_overlay');
  var volume_canvas = document.getElementById('volume_canvas');
  var volume_canvas_overlay = document.getElementById('volume_canvas_overlay')
  volume_canvas_overlay.style.top="-417px"//strange bug the CSS declaration wont work, so JS is needed
  canvas.width = width
  crosshair_overlay.width = width
  volume_canvas.width = width
  volume_canvas_overlay.width = width
  Main_data.canvas_data[0].canvas = canvas
  Main_data.canvas_data[0].crosshair_overlay = crosshair_overlay
  Main_data.canvas_data[0].volume_canvas = volume_canvas
  Main_data.canvas_data[0].volume_canvas_overlay = volume_canvas_overlay
  document.querySelectorAll('input[name="MA"]').forEach((check_box)=>{
    check_box.addEventListener('change', (e)=>{
      if(Main_data.canvas_data[0].data_loaded)get_chart_btn.click()


    })
  })
  // document.getElementById('study_line').addEventListener('mousedown', (e)=>{
  //   console.log(e)
  //   // e.preventDefault()
  //   console.log(e.target)
  //   var el = e.target
  //   // console.log(e.target.parentElement)
  //   // e.target.parentElement.focus()
  //   e.preventDefault();
  //   let val = el.value
  //   Canvas_Markers.add_study_line(val)
  //   // toggle selection
  //   if (el.hasAttribute('selected')) el.removeAttribute('selected');
  //   else el.setAttribute('selected', '');
  //   var originalScrollTop = el.parentElement.scrollTop;

  //   setTimeout(function () {
  //     el.parentElement.scrollTop = originalScrollTop;
  //   }, 0);
  //   // var select = el.parentNode.cloneNode(true);
  //   // el.parentNode.parentNode.replaceChild(select, el.parentNode);
  // })
  
  // var context = canvas.getContext('2d');
  canvas.addEventListener('mousemove', (e) => {
    if (Main_data.canvas_data[0].data_loaded) {
      console.log('crowsshar')
      let x = (e.layerX)
      let y = (e.layerY)
      // console.log({ x, y })
      Canvas_Markers.draw_crosshair(x, y)

    }
  })

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

window.addEventListener("resize", resize_all_canvas)

var canvas_array = ['crosshair_overlay', 'volume_canvas', 'myCanvas', 'volume_canvas_overlay']
function resize_all_canvas(){
  const width = window.innerWidth * .95
  var volume_canvas_overlay = document.getElementById('volume_canvas_overlay')
  var crosshair_overlay = document.getElementById('crosshair_overlay');
  var volume_canvas = document.getElementById('volume_canvas');
  crosshair_overlay.width = width
  volume_canvas.width = width
  volume_canvas_overlay.width = width
  var canvas = document.getElementById('myCanvas');
  canvas.width = width
  get_chart_btn.click()
  
}


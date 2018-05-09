
var get_chart_btn = document.getElementById('get_chart_btn')

// draw_chart(high, data, canvas
get_chart_btn.addEventListener('click', (e)=>{
  console.log(e)
  var radios = document.getElementsByName('time-frame');

  for (var i = 0, length = radios.length; i < length; i++) {
    var time_frame
    if (radios[i].checked) {time_frame = radios[i].value;break;}
  }
  var symbol = document.getElementById('symbol_input').value
  var count = document.getElementById('number_input').value
  get_chart(symbol, count, time_frame, (data) => {
    console.log(data)

    var max_min = ()=>{
      var max = 0       //low number that is lower than any high
      var min = 10000000 //some big number that is larger than any lows
      data.forEach(data_point => {
        if (data_point.high > max) {
          max = data_point.high
        }
        if (data_point.low < min && data_point.low > 0) {
          min = data_point.low
        }

      });
      return {max, min}
    }
    var candle_width = Main_data.canvas_data[0].candle_width
    var space_between_bars = Main_data.canvas_data[0].space_between_bars
    draw_chart(max_min(), data, canvas, candle_width, space_between_bars)

    console.log(max_min())
    // console.log(max)
    // console.log(min)

  })

})
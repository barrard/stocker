
var get_chart_btn = document.getElementById('get_chart_btn')

// draw_chart(high, data, canvas
get_chart_btn.addEventListener('click', (e)=>{
  var radios = document.getElementsByName('time-frame');

  for (var i = 0, length = radios.length; i < length; i++) {
    var time_frame
    if (radios[i].checked) {
      // do whatever you want with the checked radio
      time_frame = radios[i].value

      break;
    }
  }
  var symbol = document.getElementById('symbol_input').value
  var count = document.getElementById('number_input').value
  get_minutely(symbol, count, time_frame, (data) => {
    console.log(data)
    const max = data.reduce(function (prev, current) {
      return (prev.high > current.high) ? prev.high : current.high
    })
    const min = data.reduce(function (prev, current) {
      return (prev.low < current.low) ? prev.low : current.low
    })
    draw_chart(max, data, canvas)

    console.log(max)
    console.log(min)

  })

})
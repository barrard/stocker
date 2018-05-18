var Canvas_Markers = (()=>{

  function draw_date_marker(candle_position, candle_width, data, canvas) {
    console.log(candle_position)
    console.log(data)
    console.log(canvas)
    var context = canvas.getContext('2d');
    var date_time = parsed_date_time(data.date, data.label)

    context.beginPath();
    context.moveTo(candle_position + (candle_width / 2), 0);
    context.lineTo(candle_position + (candle_width / 2), canvas.height);
    context.stroke();
    context.fillStyle = "white";
    context.font = "bold 10px Arial";
    var text = context.measureText(date_time)
    context.fillText(date_time, candle_position - (text.width/2), canvas.height);

  }

  function parsed_date_time(date, label) {
    console.log(date, label)
    var month_day = date.slice(-4)
    var day = month_day.slice(-2)
    var month = month_day.slice(0, 2)
    var year = date.slice(0, 4)

    console.log({ year, month_day, month, day})
    // console.log(date)
    return `${month}/${day}/${year} - ${label}`
    
  }

  return {
    draw_date_marker: draw_date_marker

  }

})()

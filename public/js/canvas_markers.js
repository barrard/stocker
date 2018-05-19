var Canvas_Markers = (()=>{

  function draw_date_marker(candle_position, candle_width, data, canvas) {
    // console.log(candle_position)
    // console.log(data)
    // console.log(canvas)
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



  function write_label(text, color, size, ctx, x, y){
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px Arial`;
    let label = text
    var text = ctx.measureText(label)
    ctx.fillText(label, x, y);
  }
  function draw_volume(candle_position, min_max, data, candle_width, color, pixels_per_vol){
    const vol_ctx = Main_data.canvas_data[0].volume_canvas.getContext('2d')

    // console.log({data, candle_position})
    // const height = canvas.height
    // const min = min_max.vol_min
    // const max = min_max.vol_max
    // const range = max - min
    // console.log({height, max, color, pixels_per_vol})
    vol_ctx.fillStyle = color
    vol_ctx.fillRect(candle_position, (min_max.vol_max - data.volume) * pixels_per_vol,
      candle_width, (data.volume*pixels_per_vol))

  }

  function draw_crosshair(x, y){
    let canvas = Main_data.canvas_data[0].crosshair_overlay
    // let vol_canvas = Main_data.canvas_data[0].volume_canvas_overlay
    let min_max = Main_data.canvas_data[0].min_max
    let price_label = parseFloat((min_max.min) - y / 100).toFixed(2)
    // console.log(price_label)
    // console.log({x, y})
    let x_hair_ctx = canvas.getContext('2d')
    // let x_hair_vol_ctx = vol_canvas.getContext('2d')

    x_hair_ctx.clearRect(0, 0, canvas.width, canvas.height);
    vol_ctx.clearRect(0, 0, volume_canvas_overlay.width, volume_canvas_overlay.height);

//horizontal crosshair line on chart
    x_hair_ctx.beginPath();
    x_hair_ctx.moveTo(0, y);
    x_hair_ctx.lineTo(canvas.width, y);
    x_hair_ctx.stroke();
//vertical crosshair line on chart
    x_hair_ctx.beginPath();
    x_hair_ctx.moveTo(x, 0);
    x_hair_ctx.lineTo(x, canvas.height);
    x_hair_ctx.stroke();
//vertical crosshairline on volume
    vol_ctx.beginPath();
    vol_ctx.moveTo(x, 0);
    vol_ctx.lineTo(x, volume_canvas_overlay.height);
    vol_ctx.stroke();
    write_label(price_label, "white", 14, x_hair_ctx, x, y)


  }

  function draw_price_markers(min_max){
    // var number_of_pennies = Math.floor(parseFloat((min_max.max - min_max.min) * 100).toFixed(2))
  

    // var pixels_per_penny = ((canvas.height / number_of_pennies))
    let price_marker_position = Math.floor((canvas.height/5))

    // console.log({number_of_pennies, price_marker_position, pixels_per_penny})
    for (let x = 0; x < canvas.height; x++) {
      if (x % price_marker_position == 0) {
        console.log(x)
        console.log(canvas.height)
        context.beginPath();
        context.moveTo(0, canvas.height-x);
        context.lineTo(canvas.width, canvas.height-x);
        context.stroke();
        let price_label = parseFloat((min_max.min) + x / 100).toFixed(2)
        var text = context.measureText(price_label)
        write_label(price_label, "white", 10, context, canvas.width - (text.width * 2), canvas.height - x  )


      }

    }
  }

  function parsed_date_time(date, label) {
    // console.log(date, label)
    var month_day = date.slice(-4)
    var day = month_day.slice(-2)
    var month = month_day.slice(0, 2)
    var year = date.slice(0, 4)

    // console.log({ year, month_day, month, day})
    // console.log(date)
    return `${month}/${day}/${year} - ${label}`
    
  }
  var spinning;
  function spinner(){
    var canvas = Main_data.canvas_data[0].canvas
    var context = canvas.getContext('2d');
    var start = new Date();
    var lines = 16,
      cW = context.canvas.width,
      cH = context.canvas.height;

    var draw = function () {
      var rotation = parseInt(((new Date() - start) / 1000) * lines) / lines;
      context.save();
      context.clearRect(0, 0, cW, cH);
      context.translate(cW / 2, cH / 2);
      context.rotate(Math.PI * 2 * rotation);
      for (var i = 0; i < lines; i++) {

        context.beginPath();
        context.rotate(Math.PI * 2 / lines);
        context.moveTo(cW / 10, 0);
        context.lineTo(cW / 4, 0);
        context.lineWidth = cW / 30;
        context.strokeStyle = "rgba(255,255,255," + i / lines + ")";
        context.stroke();
      }
      context.restore();
    }
    spinning = window.setInterval(draw, 1000 / 30)
  }

  function stop_spinner(){
    window.clearInterval(spinning)
  }

  var study_list = []
  function add_study_line(val) {
    console.log(val)
    let index = study_list.indexOf(val)
    if (index == -1) {
      study_list.push(val)
    } else {
      study_list.splice(index, 1)
    }
    console.log(study_list)

  }
  function draw_studies(data){
    console.log(study_list)
  }

  return {
    draw_date_marker: draw_date_marker,
    draw_price_markers: draw_price_markers,
    draw_crosshair: draw_crosshair,
    draw_volume: draw_volume,
    add_study_line: add_study_line,
    draw_studies: draw_studies,
    spinner:spinner,
    stop_spinner: stop_spinner

  }

})()

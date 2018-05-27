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
    // context.fillStyle = "white";
    // context.font = "bold 10px Arial";
    // var text = context.measureText(date_time)
    // context.fillText(date_time, candle_position - (text.width/2), canvas.height);

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
    var pennies_per_pixel = Main_data.canvas_data[0].pennies_per_pixel
    // console.log({x, y})
    let price_label = parseFloat((min_max.min) + ((canvas.height-y)*pennies_per_pixel) / 100).toFixed(3)

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
    // console.log(min_max)
    // var number_of_pennies = Math.floor(parseFloat((min_max.max - min_max.min) * 100).toFixed(2))
    var range = min_max.max - min_max.min
    // console.log({range})
    // console.log(range / 5)
    var intervals = parseFloat(range / 5).toFixed(4)
    var marker_count = 0
    // console.log({intervals})

    // var pixels_per_penny = ((canvas.height / number_of_pennies))
    let price_marker_position = Math.floor((canvas.height/5))
  // console.log(price_marker_position)
    // console.log({number_of_pennies, price_marker_position, pixels_per_penny})
    for (let x = 0; x < canvas.height; x++) {
      // if(x == 0 ){
      //   context.beginPath();
      //   context.moveTo(0, canvas.height - x);
      //   context.lineTo(canvas.width, canvas.height - x);
      //   context.stroke();
      //   let price_label = parseFloat((min_max.min)).toFixed(2)
      //   var text = context.measureText(price_label)
      //   write_label(price_label, "white", 10, context, canvas.width - (text.width * 2), canvas.height - x)
      // }
      if (x % price_marker_position == 0) {

        // console.log(x)
        // console.log(canvas.height)
        context.beginPath();
        context.moveTo(0, canvas.height-x);
        context.lineTo(canvas.width, canvas.height-x);
        context.stroke();
        let price_label = parseFloat((min_max.min + (marker_count * intervals))).toFixed(2)
        // console.log(marker_count * intervals)
        // console.log({ price_label, marker_count})
        // let price_label = marker_count
        var text = context.measureText(price_label)
        write_label(price_label, "white", 10, context, canvas.width - (text.width * 2), canvas.height - x  )
        marker_count++

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

  // var study_list = []
  // function add_study_line(val) {
  //   console.log(val)
  //   let index = study_list.indexOf(val)
  //   if (index == -1) {
  //     study_list.push(val)
  //   } else {
  //     study_list.splice(index, 1)
  //   }
  //   console.log(study_list)

  // }
  function draw_studies(data){

    document.querySelectorAll('option').forEach((option) => {
      if (option.selected) draw_study(option.value, data)
    })
  }

  function check_MA_data(symbol, data){
    document.querySelectorAll('input[name="MA"]').forEach((check_box) => {
      if (check_box.checked) {
        var MA_data = Main_data.canvas_data[0].MA[symbol][check_box.value]
        if(!MA_data){
          // console.log('must cal it')
          cal_MA(check_box.value, data, symbol)
        } else {
          // console.log('already have ' + check_box.value)
          // console.log(Main_data.canvas_data[0].MA[symbol][check_box.value])
        }

        // cal_MA(check_box.value, data)
      }
    })
  }

  function cal_MA(MA, data, symbol){
    var raw_data = []
    var MA_data = []
    var MA = parseInt(MA)

    data.forEach((d, count) => {
      let close = d.close
      if (close == 0 || close == undefined){
        close = d.marketAverage
        console.log(d)
      } 
      // console.log(raw_data)
      raw_data.unshift(close)

      if (count < MA - 1) {
        MA_data.push(0)//fill the begining with 0 to help the line position
      }else{
        let sum = raw_data.reduce((acc, val) => {
          return (acc + val);
        })
        let avg = (sum / (MA))
        // console.log({sum, MA, avg})
        // let avg = (sum / MA)
        // console.log(sum)
        // console.log(MA)
        // console.log(avg);
        // console.log(raw_data)
        MA_data.push(avg)
        raw_data.pop();
      }


    })
    // console.log(MA)
    Main_data.canvas_data[0].MA[symbol][MA] = MA_data


  }


  function draw_MA(MA) {
    var data = Main_data.canvas_data[0].MA[MA]
    var ctx = Main_data.canvas_data[0].canvas.getContext('2d')
    var candle_width = Main_data.canvas_data[0].candle_width
    var space_between_bars = Main_data.canvas_data[0].space_between_bars
    var min_max = Main_data.canvas_data[0].min_max
    var pixels_per_penny = Main_data.canvas_data[0].pixels_per_penny
    var symbol = Main_data.canvas_data[0].symbol
    let x_offset = Main_data.canvas_data[0].x_offset / (candle_width + space_between_bars)
    let width = canvas.width
    let candle_count = width / (candle_width + space_between_bars)

    var MA_data = Main_data.canvas_data[0].MA[symbol][MA]
    var data_length = MA_data.length
    var new_data
    if (x_offset == 0) {
      new_data = MA_data.slice(candle_count * -1)

    } else {

      var end_of_data = data_length - x_offset - candle_count
      if (end_of_data < 0) end_of_data = 0;
      if (x_offset + candle_count > data_length) Main_data.canvas_data[0].x_offset = x_offset = data_length - candle_count;

      new_data = MA_data.slice(end_of_data, (x_offset * -1))
    }
    // console.log({ end_of_data, candle_count, data_length, x_offset})

    new_data.forEach((d, count)=>{
      const candle_position = (count * candle_width) + (space_between_bars * count)
      const prev_candle_position = ((count-1) * candle_width) + (space_between_bars * (count-1))
      context.beginPath();
      context.moveTo(prev_candle_position + (candle_width / 2), (min_max.max - new_data[count-1]) * 100 * pixels_per_penny);
      context.lineTo(candle_position + (candle_width / 2), (min_max.max - d) * 100 * pixels_per_penny);
      // console.log({d, min_max})
      // console.log((min_max.max - d))
      // console.log((min_max.max - d) * 100 * pixels_per_penny)
      // console.log({min_max, d, pixels_per_penny })


      // context.lineTo(cW / 4, 0);

      context.stroke();

    })


  }
  function draw_study(study, data) {
    console.log(data.length)
    var ctx = Main_data.canvas_data[0].canvas.getContext('2d')
    console.log(study)
    var candle_width = Main_data.canvas_data[0].candle_width
    var space_between_bars = Main_data.canvas_data[0].space_between_bars
    var min_max = Main_data.canvas_data[0].min_max
    var pixels_per_penny = Main_data.canvas_data[0].pixels_per_penny
    var symbol = Main_data.canvas_data[0].symbol
    let x_offset = Main_data.canvas_data[0].x_offset / (candle_width + space_between_bars)
    let width = canvas.width
    let candle_count = width / (candle_width + space_between_bars)

    
    data.forEach((d, count) => {
      if(count < 1) return
      const candle_position = (count * candle_width) + (space_between_bars * count)
      const prev_candle_position = ((count - 1) * candle_width) + (space_between_bars * (count - 1))
      context.beginPath();
      context.moveTo(prev_candle_position + (candle_width / 2), (min_max.max - data[count - 1][study]) * 100 * pixels_per_penny);
      context.lineTo(candle_position + (candle_width / 2), (min_max.max - d[study]) * 100 * pixels_per_penny);


      // context.lineTo(cW / 4, 0);

      context.stroke();

    })


  }

  return {
    draw_date_marker: draw_date_marker,
    draw_price_markers: draw_price_markers,
    draw_crosshair: draw_crosshair,
    draw_volume: draw_volume,
    draw_study: draw_study,
    draw_studies: draw_studies,
    spinner:spinner,
    stop_spinner: stop_spinner,
    draw_MA: draw_MA,
    check_MA_data: check_MA_data

  }

})()

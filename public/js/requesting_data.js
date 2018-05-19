// $.get('/stock/AAPL/historical/100', (resp) => { console.log(resp) })

// $.get('/stock/AAPL/minutely_data/100', (resp) => { console.log(resp) })

// $.get('/stock/AAPL/intra_data/5', (resp) => { console.log(resp) })

// $.get('/stock/AAPL/news/1', (resp) => { console.log(resp) })

var intra_data = 'http://localhost:55555/stock/AAPL/intra_data'
var news = 'http://localhost:55555/stock/AAPL/news'
// get_historical('AAPL', 100);
// function get_historical(symbol, count){
//   var historical = `http://localhost:55555/stock/${symbol}/historical`

//   $.get(historical, (resp) => { 
//     var data = resp.resp[0].historical
//     console.log(data) 
//     })
// }
// var temp = minute_data['AAPL']
// console.log(temp)
// get_minutely('AAPL', 100)

const possible_time_frames = ['historical', 'minutely_data']
function get_chart(symbol, count, time_frame, cb) {
  if(possible_time_frames.indexOf(time_frame) === -1){
    cb(null)
    return
  }else{
    // toast(`fetching data for ${symbol}`, 'info')
    Canvas_Markers.spinner()

    console.log(`get ${count} bars of ${symbol}`)
    console.log(time_frame)
    if (Main_data[time_frame][symbol]) {
      // if (typeof minute_data !== 'undefined' && minute_data[symbol] != 'undefined') {
      // console.log(Main_data[time_frame][symbol])
      cb(Main_data[time_frame][symbol].slice(count * -1))
    } else {
      // var url = `http://localhost:55555/stock/${symbol}/${time_frame}`
      var url = `/stocker/stock/${symbol}/${time_frame}`

      $.get(url, (resp) => {
        console.log(resp)
        if (resp.err) {
          // return
          Main_data[time_frame][symbol] = []
          cb([])
        } else {
          var data = resp.resp[0][time_frame]
          Main_data[time_frame][symbol] = data
          cb(Main_data[time_frame][symbol].slice(count * -1))
        }
      })
    }
  }


}


function get_intra(count){
  $.get(intra_data, (resp) => {
    console.log(resp)
  })
}

function get_news(){
  $.get(news, (resp) => { 
    console.log(resp) 
    })
}



var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
var MongoClient = require('mongodb').MongoClient
var mongodb = require('mongodb')
var url = 'mongodb://localhost:27017';
var database_name = "stocker_mongoose"

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stocker_mongoose');
var db = mongoose.connection;
var Schema = mongoose.Schema;

db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
  logger.log('mogoose ready')

var stock_schema = new Schema({
  name: String,
  historical: [],
  minutely_data: [],
  intra_data: [],
  book_data: [],
  value_areas: []

});
var Stock_model = mongoose.model('Stocks', stock_schema);


  module.exports = Stock_model
  // exports = Missing_Stock_model
  // var appl = new Stock_model({
  //   name:'APPL'
  // })
  // var q = {name:'APPL'}
  // Stock_model.findOneAndUpdate(q, appl, {upsert:true}, (e,r)=>{
  //   logger.log(e)
  //   logger.log(r)
  // })

  // Stocker_data.update(
  //   { name: "AAPL" },
  //   {
  //     $push: {
  //       historical: {
  //         symbol: "AAPL",
  //         date: "2018-05-03",
  //         open: 175.88,
  //         high: 177.5,
  //         low: 174.4411,
  //         close: 176.89,
  //         volume: 34068180,
  //         unadjustedVolume: 34068180,
  //         change: 0.32,
  //         changePercent: 0.181,
  //         vwap: 176.08
  //       }
  //     }
  //   }, (e, r) => {
  //     logger.log(e)
  //     logger.log(r)
  //   }
  // )

  // Stocker_data.update(
  //   { name: "AAPL" },
  //   {
  //     $push: {
  //       minutely_data: {
  //         date: "20180430",
  //         minute: "09:30",
  //         label: "09:30 AM",
  //         high: 162.32,
  //         low: 161.85,
  //         average: 162.085,
  //         volume: 14289,
  //         notional: 2316028.15,
  //         numberOfTrades: 108,
  //         marketHigh: 162.35,
  //         marketLow: 161.84,
  //         marketAverage: 162.158,
  //         marketVolume: 1042392,
  //         marketNotional: 169032497.4992,
  //         marketNumberOfTrades: 2552,
  //         open: 162.145,
  //         close: 162.32,
  //         marketOpen: 162.11,
  //         marketClose: 161.88,
  //         changeOverTime: 0,
  //         marketChangeOverTime: 0
  //       }
  //     }
  //   }, (e, r) => {
  //     logger.log(e)
  //     logger.log(r)
  //   }
  // )

  // Stock_model.remove({'name':'APPL'}, (e, r)=>{
  //   logger.log(e)
  //   logger.log(r)
  // })

// });


// function handleError(err) {
//   if (err) {
//     logger.log('-----HandleError helper function found an error------')
//     logger.log(err)
//     logger.log('------End of error-------')
//     return false
//   } else {
//     return true
//   }
// }

// function connectMongo(callback) {
//   MongoClient.connect(url, function (err, client) {
//     if (handleError(err)) {
//       callback(client)
//     } else {
//       return false
//     }
//   })

// }

// function connectionToMongoCollection(collectionName, callback) {
//   connectMongo(function (client) {
//     var db = client.db(database_name)
//     var col = db.collection(collectionName)
//     callback(col, client)
//   })
// }


// module.exports = {
//   test: 'test',
//   connectMongo: connectMongo,
//   connectionToMongoCollection: connectionToMongoCollection,
//   insert_once: (collectionName, data, callback) => {
//     // logger.log(data)
//     connectionToMongoCollection(collectionName, function (col, client) {
//       col.update(data, data, { upsert: true}, (err, resp)=>{
//         if (err) {
//           logger.log('Error Message form DataBaseFunctions insert into mongo')
//           callback({ err: err })
//         } else {
//           callback({ message: resp.result })
//         }
//       })
//       client.close()
//     })
//   },

//   add_empty_array_field: (collectionName, field_name) => {
//     connectionToMongoCollection(collectionName, (col, client) => {
//       col.updateMany({}, { $set: { [field_name]: [] } }, { upsert: true })
//       logger.log('new empty array field added')
//       client.close()
//     })
//   },
//   set_historical_data_from_file: (collectionName, field_name, history_array, symbol) => {
//     // const symbol = history_array[0].symbol
//     // logger.log(history_array)
//     connectionToMongoCollection(collectionName, (col, client) => {
//       col.update({ name: symbol}, { $set: { [field_name]: history_array } }, { upsert: true })
//       logger.log(`data from ${symbol} file is added to ${field_name} field`)
//       client.close()
//     })
//   },
//   upsert_into_array: (collectionName, data, at) => {
//     logger.log(data)
//     logger.log(at)
//     connectionToMongoCollection(collectionName, (col, client) => {
//       col.findOneAndUpdate(
//         at,
//         { $push: data },
//         {
//           // projection: <document>,
//           // {/* sort: <document>, */}
//           // {/* maxTimeMS: <number>, */}
//           upsert: true,
//           // {/* returnNewDocument: <boolean>, */}
//           // {/* collation: <document>, */}
//           // {/* arrayFilters: [ <filterdocument1>, ... ] */}
//         })


//       logger.log('upsert complete')
//       client.close()
//     })

//   },
//   pop_from_array: (collectionName, data, at) => {
//     connectionToMongoCollection(collectionName, (col, client) => {
//       col.findOneAndUpdate(
//         at,
//         { $pop: data }
        
//         ,
//         // {
//           // projection: <document>,
//           // {/* sort: <document>, */}
//           // {/* maxTimeMS: <number>, */}
//           // upsert: true,
//           // {/* returnNewDocument: <boolean>, */}
//           // {/* collation: <document>, */}
//           // {/* arrayFilters: [ <filterdocument1>, ... ] */}
//         // }
//         )


//       logger.log('pop complete')
//       client.close()
//     })

//   },

//   update_at: (collectionName, field, data, at, callback) => {
//     logger.log({ collectionName, field, data, at, callback})
//     connectionToMongoCollection(collectionName, function (col, client) {
//       col.update({ name: at }, { $set: { [field]: data } }, (err, resp) => {
//         if (err) {
//           logger.log('err')
//           logger.log(err)
//           callback({ err: err })

//         } else {
//           logger.log('succesful update')
//           // logger.log(resp)
//           callback({ message: resp.result })

//         }
//       })
//       client.close()

//     })
//   },

//   aggregate_sort_by_volume:(collectionName, obj_to_find, callback)=>{
//     connectionToMongoCollection(collectionName, (col, client)=>{
//       var vol_sort = {}
//       col.find(obj_to_find).sort({ ['data.volume']:-1}).toArray((err, result)=>{
//         if(!err){
//           logger.log(result)
//           callback({message:result})
//         }
//       })
//       client.close()

//     })
//   },
//   get_data_of_last_item_in_history: (collectionName, symbol, cb) => {
//     connectionToMongoCollection(collectionName, function (col, client) {
//       col.find({ name: symbol }).toArray(function (err, resultArray) {
//         const historical_array = resultArray[0].historical
//         // logger.log(historical_array[historical_array.length-1].date)
//         // logger.log(resultArray[resultArray.length - 1])
//         cb(historical_array[historical_array.length - 1].date)
//       })
//       client.close();
//     })
//   },

//   get_data_of_last_item_in_field: (collectionName, symbol, field, cb) => {
//     connectionToMongoCollection(collectionName, function (col, client) {
//       col.find({ name: symbol }).toArray(function (err, resultArray) {
//         const field_array = resultArray[0].field
//         // logger.log(field_array[field_array.length-1].date)
//         // logger.log(resultArray[resultArray.length - 1])
//         cb(field_array[field_array.length - 1].date)
//       })
//       client.close();
//     })
//   },

//   findInCollection: (collectionName, obj_to_find, callback) => {
//     connectionToMongoCollection(collectionName, function (col, client){
//       logger.log('collection name ' + col.s.name)
//       col.find(obj_to_find).toArray(function (err, resultArray) {
//         if (err) {
//           callback({ err: 'collection Find Error' })
//         } else {
//           logger.log('found array - ' + resultArray.length + " - total")
//           if (resultArray.length == 0) {//no result to return
//             // logger.log('resultArray length = ' + resultArray.length)
//             // logger.log('couldnt find ')
//             // logger.log(obj_to_find)
//             // logger.log('=>aint in the' + col.s.name + ' Collection.')
//             callback({ err: 'result.length =' + resultArray.length })
//           } else {
//             // logger.log(`findInCollection: ${collectionName} success`)
//             // callback()
//             // logger.log(resultArray.length)
//             callback({ message: resultArray })
//           }
//         }
      
//       })
//       client.close();
//     })
//   },

//   findAndDeleteOneInCollection: (collectionName, objToDelete, callback) => {
//     logger.log('find an delete')
//     connectionToMongoCollection(collectionName, (col, client) => {
//       logger.log('the objToDelete is ')
//       logger.log(objToDelete)
//       logger.log('type of = ' + typeof (objToDelete))
//       logger.log(objToDelete)
//       const _id = new mongodb.ObjectID(objToDelete)
//       logger.log(typeof (_id))
//       col.deleteOne({ _id: _id }, (err, resp) => {
//         if (err) {
//           logger.log('we got error')
//           callback({ err })
//         } else {
//           logger.log('we got delete?')
//           // callback({resp})
//           callback({ message: resp.result })

//         }
//       })
//       client.close()


//     })

//   },
// }
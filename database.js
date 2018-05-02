var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
var MongoClient = require('mongodb').MongoClient
var mongodb = require('mongodb')
var url = 'mongodb://localhost:27017';
var database_name = "stocker"


function handleError(err) {
  if (err) {
    logger.log('-----HandleError helper function found an error------')
    logger.log(err)
    logger.log('------End of error-------')
    return false
  } else {
    return true
  }
}

function connectMongo(callback) {
  MongoClient.connect(url, function (err, client) {
    if (handleError(err)) {
      callback(client)
    } else {
      return false
    }
  })

}

function connectionToMongoCollection(collectionName, callback) {
  connectMongo(function (client) {
    var db = client.db(database_name)
    var col = db.collection(collectionName)
    callback(col, client)
  })
}


module.exports = {
  test: 'test',
  connectMongo: connectMongo,
  connectionToMongoCollection: connectionToMongoCollection,
  insert_if_not_exist:(collectionName, data, callback)=>{
    logger.log('insert if not exist')
    logger.log(data)
    module.exports.findInCollection(collectionName, data, (resp)=>{
      logger.log(resp)
      if(!resp.message){
        module.exports.insertIntoMongo(collectionName, data, (resp)=>{
          if(!resp.err){
            callback('inserted')
          }else{
            callback('failed')
            logger.log('something went wrong inserting data that didnt already exist :(')
          }
        })
      }else{
        callback('already have')
      }
    })
  },
  insertIntoMongo: (collectionName, data, callback) => {
    // logger.log(data)
    connectionToMongoCollection(collectionName, function (col, client) {
      col.insert(data, function (err, resp) {
        if (err) {
          logger.log('Error Message form DataBaseFunctions insert into mongo')
          callback({ err: err })
        } else {
          callback({ message: resp })
        }
        client.close()

      })
    })
  },
  upsert: (collectionName, obj_to_find, data, callback) => {
    module.exports.findInCollection(collectionName, obj_to_find, (result) => {
      // logger.log(result)
      if (result.err) {
        module.exports.insertIntoMongo(collectionName, data, (result) => {
          logger.log(result)
          callback(result)

        })

      } else if (result.message) {
        callback(result)
        module.exports.update(collectionName, obj_to_find, data, (result) => {
          callback(result)

        })

      }
    })
  },
  update: (collectionName, obj_to_find, data, callback) => {
    connectionToMongoCollection(collectionName, function (col, client) {
      col.update(obj_to_find, data, (err, resp) => {
        if (err) {
          logger.log('err')
          logger.log(err)
          callback({ err: err })

        } else {
          logger.log('succesful update')
          callback({ message: resp })

          // logger.log(resp)
        }
      })
    })
  },
  push_data:(collectionName, data, name, daily_or_minutly, callback)=>{
    logger.log('insert')
    logger.log(name)
    logger.log(daily_or_minutly)
    connectionToMongoCollection(collectionName, function (col, client) {
      col.update({ 'name': name }, { $push: { daily_or_minutly: data } }, (err, resp) => {
        if (err) {
          logger.log('err')
          logger.log(err)
          callback({ err: err })

        } else {
          logger.log('succesful update')
          // logger.log(resp)
          callback({ message: resp })

        }
      })
    })
  },

  update_at: (collectionName, data, at, callback) => {
    const id = new mongodb.ObjectID(data.id)
    var data = data.data
    connectionToMongoCollection(collectionName, function (col, client) {
      col.update({ _id: id }, { $set: { [at]: data } }, (err, resp) => {
        if (err) {
          logger.log('err')
          logger.log(err)
          callback({ err: err })

        } else {
          logger.log('succesful update')
          // logger.log(resp)
          callback({ message: resp })

        }
      })
    })
  },

  findInCollection: (collectionName, objToFindInMongo, callback) => {
    connectionToMongoCollection(collectionName, function (col, client) {
      logger.log('collection name ' + col.s.name)
      col.find(objToFindInMongo).toArray(function (err, resultArray) {
        if (err) {
          callback({ errorMessage: 'collection Find Error' })
        } else {
          logger.log('found array - ' + resultArray.length + " - total")
          if (resultArray.length == 0) {//no result to return
            // logger.log('resultArray length = ' + resultArray.length)
            // logger.log('couldnt find ')
            // logger.log(objToFindInMongo)
            // logger.log('=>aint in the' + col.s.name + ' Collection.')
            client.close()
            callback({ errorMessage: 'result.length =' + resultArray.length })
          } else {
            // logger.log(`findInCollection: ${collectionName} success`)
            // callback()
            // logger.log(resultArray.length)
            client.close()
            callback({ message: resultArray })
          }
        }
      })
    })
  },

  findAndDeleteOneInCollection: (collectionName, objToDelete, callback) => {
    logger.log('find an delete')
    connectionToMongoCollection(collectionName, (col, client) => {
      logger.log('the objToDelete is ')
      logger.log(objToDelete)
      logger.log('type of = ' + typeof (objToDelete))
      logger.log(objToDelete)
      const _id = new mongodb.ObjectID(objToDelete)
      logger.log(typeof (_id))
      col.deleteOne({ _id: _id }, (err, resp) => {
        if (err) {
          logger.log('we got error')
          callback({ err })
        } else {
          logger.log('we got delete?')
          // callback({resp})
          callback({ message: resp })

        }
      })

    })

  },
}
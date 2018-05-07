var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
})
var redis = require("redis")
var client = redis.createClient({
  retry_strategy: function (options) {//this is from node-redis documentation
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
});

function handle_resp(err, resp, callback) {
  if (err) callback(err)
  else callback(null, resp)
}

function get(item_to_get, callback) {
  client.get(item_to_get, (err, resp) => {
    handle_resp(err, resp, callback)
  })
}

function set(item_to_set, value_to_set) {
  client.set(item_to_set, value_to_set)
}

//get all the data from the database
// database.findInCollection("crowdsales", {}, (data)=>{
//   set('crowdsales',JSON.stringify(data))
//   // logger.log(data)
// })

// get('crowdsales', (e, r)=>{
//   if(!e)logger.log(JSON.parse(r))
// })

module.exports = {
  get: get,
  set: set

}

client.on("error", function (err) {
  logger.log("Error " + err);
});

client.on("ready", function () {
  logger.log("redis ready ");
});


client.on("connect", function () {
  logger.log("connected to redis ");
});

client.on("reconnecting", function (err) {
  logger.log("reconnecting " + err);
});


client.on("end", function (err) {
  logger.log("end " + err);
});


client.on("warning", function (err) {
  logger.log("warning " + err);
});

// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//   logger.log(replies.length + " replies:");
//   replies.forEach(function (reply, i) {
//     console.log("    " + i + ": " + reply);
//   });
//   client.quit();
// });
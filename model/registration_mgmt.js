"use strict"
var fs = require("fs")
var redis = require("redis")
var config = require('../config.js')
var db = redis.createClient(config.redisPort, config.server)
var filename = "./data/users.db"

var RegisManager = function(res, parsedurlinfo){
	this.parsedurlinfo = parsedurlinfo
	this.res = res
}

// INITIAL FILLING --------------------------------------------------------------------------------
RegisManager.prototype.filling = function(){
  
  // check if the database is empty -> if empty -> fill initial data from file
  db.hlen("users", function(err, data){
    if (err) {
      console.log(err)
    } else {
      if (data == 0) {
        fs.readFile(filename, function(error, users){
          if (error) {
            console.log(error)
          } else {
            var users = JSON.parse(users)
            var length = Object.keys(users).length

            // loop which inserts data into database
            for(var i = 1; i <= length; i++) {
              var tmpUser = users[i]
              console.log(tmpUser)

              // store users into hash "users"
              db.hset("users", tmpUser.id, JSON.stringify(tmpUser), function(errorSet, answer){
                if (errorSet) {
                  console.log(errorSet)
                }
              })
            }
          }
        })
      }
    }
  })

}

// INSERT USER -----------------------------------------------------------------------------------
RegisManager.prototype.insert = function(paramData){
	
  var data = {}
	var keyvals, k, v

	// get needed data as key-value pairs (stolen from mr feiner)
	paramData && paramData.split("&").forEach(function(keyval) {
		keyvals = keyval.split("=")
		k = keyvals[0]
		v = keyvals[1]
		data[k] = v // this.data isn't possible at this point
	})
	this.data = data

  //TODO random token, bool if valid email

  db.hset("users", data.id, JSON.stringify(data), function(err, data){
    if (err) {
      console.log(err)
    } 
  })

}


module.exports = RegisManager
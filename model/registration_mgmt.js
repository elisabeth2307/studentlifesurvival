"use strict"
var fs = require("fs")
var redis = require("redis")
var crypto = require("crypto")
var config = require('../config.js')
var Mailer = require('../helper/mailer.js')
var db = redis.createClient(config.redisPort, config.server)
var filename = "./data/users.db"


var RegisManager = function(res, parsedurlinfo){
	this.parsedurlinfo = parsedurlinfo
	this.res = res
  this.mailer = new Mailer()

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
	
  // create random token
  exports.createToken = function(callback) {
    const buf = crypto.randomBytes(32);
    return buf.toString('hex');
  }
  var token = exports.createToken()
  var mailer = this.mailer

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


  //set token, and a bool if email adress is valid
  this.data.valid = false
  this.data.token = token

  var tmpdata = this

  //check if user exists
  db.hget ("users", data.id, function(err, data) {
    if (err) 
      console.log(err)
    if (data == null) {

      console.log ("new user")
      data = tmpdata.data

      
      //send e mail to given adress
      console.log("\nsending mail\n")
      mailer.sendMail(data.id, data.email, data.token)

      //write user to database
      db.hset("users", data.id, JSON.stringify(data), function(err, data){
        if (err) {
          console.log(err)
        } 
      })
    } 

    else {
      console.log("user already exists") //->login->cookie
    }
  })
  
}


// READ USER -----------------------------------------------------------------------------------
RegisManager.prototype.get = function(userid){
  
   // find user by id
  db.hget(("users", userid), function(err, data){
    if (err) {
      console.log(err)
    } else {
      console.log(data)
      return data
    }
  })

}


// VERIFY USER -----------------------------------------------------------------------------------
RegisManager.prototype.verifyUser = function(id, token){

  db.hget("users", id, function(err, data){
    if (err) {
      console.log(err)
    } else {
      console.log("\n---verifying user---")
      data = JSON.parse(data)

      var user = {}
      user.id = data.id
      user.email = data.email
      user.valid = 'true'

      if (token == data.token) {
        console.log("token correct")
        db.hset("users", user.id, JSON.stringify(user), function(err, data){
          if (err)
            console.log(err)
        })
      }
      
    }
  })

}


module.exports = RegisManager
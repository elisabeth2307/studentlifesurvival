"use strict"
var fs = require("fs")
var redis = require("redis")
var crypto = require("crypto")
var Cookie = require ("../helper/cookies.js")
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

// REGISTER USER -----------------------------------------------------------------------------------
RegisManager.prototype.insert = function(paramData, res){
	
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

    else if (data == null) {
      console.log ("new user")
      data = tmpdata.data

      // input validation
      if (data.id == "" || data.email == "" || data.password == "" ||
          data.id == null || data.email == null || data.password == null){

        res.writeHead(400, {'content-type':'text/plain'})
        res.end("Something is missing.")
      }
      

      else {
        //send e mail to given adress
        console.log("\nsending mail\n")
        mailer.sendMail(data.id, data.email, data.token)

        //write user to database
        db.hset("users", data.id, JSON.stringify(data), function(err, data){
          if (err) {
            console.log(err)
            res.writeHead(500, {'content-type':'text/plain'})
            res.end("Sorry, something went wrong.");
          } 
        })
        res.writeHead(200, {'content-type':'text/plain'})
        res.end("Successfully registered.")
      }
    } 

    else {
      console.log("user already exists") 
      res.writeHead(400, {'content-type':'text/plain'})
      res.end("This user already exists.<br>If you're already registered please use the login-form.<br>Else choose a different username.")
    }
  })
  
}


// LOGIN -----------------------------------------------------------------------------------
RegisManager.prototype.login = function(paramData, res, req){

  console.log("-- LOGIN")

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
  var tmpdata = this

  //check if user exists
  db.hget ("users", data.id, function(err, dbdata) {

    if (err) {
      console.log(err)
      res.writeHead(500, {'content-type':'text/plain'})
      res.end("Sorry, something went wrong.");
    }

    else if (dbdata == null) {
      res.writeHead(400, {'content-type':'text/plain'})
      res.end("Sorry, this username does not exist.<br>Use the register-form or try again.")
    } 

    else {
      var userdata = tmpdata.data
      var dbdata = JSON.parse(dbdata);

      // check if password is correct
      if (dbdata.password == userdata.password) {
        console.log("password correct")
        
        //email address must be validated to log in
        if (dbdata.valid == false) {
          console.log("email not confirmed")
          res.writeHead(400, {'content-type':'text/plain'})
          res.end("Sorry, your email-address is not confirmed.<br>Please check your emails and try again.<br>If you didn't receive an email from us please register again.")
        }
        else {
          //set session-cookie
          var rc = req.headers.cookie
          var cookiesDict = {}
          rc && rc.split(';').forEach(function (cookie){
            var parts = cookie.split('=')
            if(parts[0])
              cookiesDict[parts[0] = rc]
          })

          var respCookies = []
          var id = Math.floor((Math.random()*9000)+1)
          if(Object.keys(cookiesDict).length == 0)
            respCookies.push(new Cookie('studentlife_id', id))

          res.setHeader("Set-Cookie", respCookies)
          res.writeHead(200, {'content-type':'text/plain'})
          res.end("Welcome back, " + userdata.id + "!")
        }
      } 
      // password not correct
      else {
        console.log("password not correct")
        res.writeHead(400, {'content-type':'text/plain'})
        res.end("Sorry, wrong password. Use the register-form or try again.")
      }
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
      user.password = data.password
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
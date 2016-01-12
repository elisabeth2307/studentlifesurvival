"use strict"
var fs = require("fs")
var redis = require("redis")
var config = require('../config.js')
var db = redis.createClient(config.redisPort, config.server)
var filename = "./data/recipes.db"

var RecipeManager = function(view, res, parsedurlinfo){
	this.recView = view
	this.parsedurlinfo = parsedurlinfo
	this.res = res
}

// INITIAL FILLING --------------------------------------------------------------------------------
RecipeManager.prototype.filling = function(){
  
  // check if the database is empty -> if empty -> fill initial data from file
  db.hlen("recipes", function(err, data){
    if (err) {
      console.log(err)
    } else {
      if (data == 0) {
        fs.readFile(filename, function(error, recipes){
          if (error) {
            console.log(error)
          } else {
            var recipes = JSON.parse(recipes)
            var length = Object.keys(recipes).length

            // loop which inserts data into database
            for(var i = 1; i <= length; i++) {
              var tmpRecipe = recipes[i]
              //console.log(tmpRecipe)

              // store recipes into hash "recipes"
              db.hset("recipes", tmpRecipe.id, JSON.stringify(tmpRecipe), function(errorSet, answer){
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

// READ RECIPES -----------------------------------------------------------------------------------
RecipeManager.prototype.getAll = function(htmlData, headerData){
 	
  var listRecipe = []
 	var recView = this.recView

 	// find all recipes
  db.hgetall("recipes", function(err, data){
    if (err) {
      console.log(err)
    } else {
      console.log(data)

      if(data.length == 0) {
        recView.formatEmpty(htmlData, headerData)
      } else {
        recView.formatHtml(data, htmlData, headerData)
      }
    }
  })

}

// DELETE UPDATE -----------------------------------------------------------------------------------
RecipeManager.prototype.update = function(paramData, id){
	
  var data = {}
	var keyvals, k, v

	// get needed data as key-value pairs (stolen from mr feiner)
	paramData && paramData.split("&").forEach( function(keyval){
		keyvals = keyval.split("=")
		k=keyvals[0]
		v=keyvals[1]
		data[k]=v // this.data isn't possible at this point
	})
	this.data = data

}

// INSERT RECIPE -----------------------------------------------------------------------------------
RecipeManager.prototype.insert = function(paramData){
	
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

  db.hset("recipes", data.id, JSON.stringify(data), function(err, data){
    if (err) {
      console.log(err)
    } 
  })

}

// DELETE RECIPE -----------------------------------------------------------------------------------
RecipeManager.prototype.delete = function(id){

  db.hdel("recipes", id, function(err, data){
    if (err) {
      console.log(err)
    } else {
      console.log(data)
    }
  })

}

module.exports = RecipeManager
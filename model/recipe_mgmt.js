"use strict"
var fs = require("fs")
var redis = require("redis")
var config = require('../config.js')
var db = redis.createClient(config.redisPort, config.server)
var filename = config.recipeFile

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
      // is empty!
      if (data == 0) {
        // read recipes from file
        fs.readFile(filename, function(error, recipes){
          if (error) {
            console.log(error)
          } else {
            var recipes = JSON.parse(recipes)
            var length = Object.keys(recipes).length

            // loop which inserts data into database
            for(var i = 1; i <= length; i++) {
              var tmpRecipe = recipes[i]

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

      // if no recipes were found
      if(data == null) {
        recView.formatEmpty(htmlData, headerData)
      } else { // recipes were found
        recView.formatHtml(data, htmlData, headerData)
      }
    }
  })

}

// DELETE UPDATE -----------------------------------------------------------------------------------
RecipeManager.prototype.update = function(paramData, id){
	var recManager = this

  // check if recipe already in database
  db.hget("recipes", id, function(err, data){
    if (err){
      console.log(err)
    } else {
      // if recipe is in database
      if (data) {
        console.log("INFO: recipe found in database - start updating")
        recManager.insert(paramData)
      } else { // if recipe is not in database
        console.log("INFO: recipe not in database - no update possible")
      }
    }
  })

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

  console.log(data)

  // set default image if no image is given
  if(data.imgsrc == '') {
    data.imgsrc = "/public/images/default.jpg"
  }

  // check image path 
  if(data.imgsrc.substring(0, 14) != "/public/images") {
    console.log("INFO: Image-path incomplete")
    data.imgsrc = "/public/images/"+data.imgsrc
  } else {
    console.log("INFO: Image-path complete")
  }

  // store new recipe in database
  db.hset("recipes", data.id, JSON.stringify(data), function(err, data){
    if (err) {
      console.log(err)
    } 
  })

}

// DELETE RECIPE -----------------------------------------------------------------------------------
RecipeManager.prototype.delete = function(id){

  // delete recipe via id
  db.hdel("recipes", id, function(err, data){
    if (err) {
      console.log(err)
    } else {
      console.log(data)
    }
  })

}

module.exports = RecipeManager
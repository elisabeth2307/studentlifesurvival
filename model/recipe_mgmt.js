"use strict"
var mycol = "recipes"
var fs = require('fs')
var mongoose = require("mongoose")
var config = require('../config.js')
var uri = "mongodb://"+config.server+":"+config.mongoPort+"/recipes"
var filename = "./data/recipes.db"

// connect to database via URI
mongoose.connect(uri)

// create a new schema for recipes (object)
var recipeSchema = mongoose.Schema({
    _id: String,
    description: String,
    imgsrc: String
})
var Recipe = mongoose.model('Recipe', recipeSchema);

var RecipeManager = function(view, res, parsedurlinfo){
	this.recView = view
	this.parsedurlinfo = parsedurlinfo
	this.res = res
}

// INITIAL FILLING --------------------------------------------------------------------------------
RecipeManager.prototype.filling = function(){
	// find all recipes in database recipes and check if database is empty
	Recipe.find(function (err, recipes) {
  		if (err) {
  			console.error(err)
  			//res.writeHead(200, {'content-type':'text/plain'});
			//res.end("ERROR recipe management - find recipes for initial filling");
  		} else {
  			// if the database is empty...
  			if (!recipes.length) {
  				// read given file with recipes
  				fs.readFile(filename, function(err, data) {
  					if (err) {
  						console.log(err)
  						//res.writeHead(200, {'content-type':'text/plain'});
						//res.end("ERROR: unable to read recipes from file")
  					} else {
  						var recipes = JSON.parse(data) // parse data to json
  						var length = Object.keys(recipes).length // get amount of recipes

  						// loop which inserts all recipes into database
  						for(var i = 1; i <= length; i++) {
  							var tmpRecipe = recipes[i]
  							// prepare new recipe for inserting
							var newRecipe = new Recipe({ 
    							_id: tmpRecipe._id,
    							description: tmpRecipe.description,
    							imgsrc: tmpRecipe.imgsrc
							})

							// save new recipe in database
							newRecipe.save(function (err, data) {
  								if (err) {
  									console.error(err)
  									//res.writeHead(200, {'content-type':'text/plain'});
									//res.end("ERROR recipe manager - not able to save new recipe");
  								} else {
  									console.log("INFO: new recipe inserted")
  								}
							})
  						}
  					}
  				})

  			} else { // if there are already recipes in the database
  				console.log("INFO: recipes already in database - no filling")
  			}
  		}
	})	
}

// READ RECIPES -----------------------------------------------------------------------------------
RecipeManager.prototype.getAll = function(htmlData, headerData){
 	var listRecipe = []
 	var recView = this.recView

 	// find all recipes
 	Recipe.find(function (err, recipes) {
  		if (err) {
  			console.error(err)
  			//res.writeHead(200, {'content-type':'text/plain'});
			//res.end("ERROR recipe management - not able to fetch recipes");
  		} else {
  			// if there are recipes in the database
  			if(recipes.length != 0) {
  				// send recipes and htmlData to view
  				recView.formatHtml(recipes, htmlData, headerData)
  			} else {
  				// if there are no recipes -> format an empty html site
  				recView.formatEmpty(htmlData, headerData)
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

	Recipe.findByIdAndUpdate(id, {$set: {description: data.description, imgsrc: data.imgsrc }}, function (err, recipe) {
  		if (err) {
  			console.log(err)
  		} else {
  			console.log("Updatet recipe: ")
  			console.log(recipe)
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

	// prepare new recipe for inserting
	var newRecipe = new Recipe({ 
    	_id: data.id,
    	description: data.description,
    	imgsrc: data.imgsrc
	})

	// save new recipe in database
	newRecipe.save(function (err, data) {
  		if (err) {
  			console.error(err)
  			//res.writeHead(200, {'content-type':'text/plain'});
			//res.end("ERROR recipe management - not able to save new recipe into database");
  		} else {
  			console.log("INFO: new recipe inserted")
  			//res.writeHead(200, {'content-type':'text/plain'});
			//res.end("ERROR recipe management - not able to save new recipe into database");
  		}
	})
}

// DELETE RECIPE -----------------------------------------------------------------------------------
RecipeManager.prototype.delete = function(id){
	var res = this.res

	// get entry from database via id
	Recipe.findById(id, function (err, tmpRecipe) {
  		if (err) {
  			console.log(err)
  			//res.writeHead(200, {'content-type':'text/plain'});
			//res.end("ERROR recipe management - not able to fetch recipe from database for deleting");
  		} else {
  			console.log("INFO: recipe to delete: "+tmpRecipe)

  			// remove the recipe from the databasee
			if (tmpRecipe != null) {
				tmpRecipe.remove(function(err) {
					if (err) {
						console.log(err)
  						//res.writeHead(200, {'content-type':'text/plain'});
						//res.end("ERROR recipe management - not able to delete recipe");
					} else {
						console.log("INFO: deleting of recipe successful")
  						//res.writeHead(200, {'content-type':'text/plain'});
						//res.end("Deleting successful");
					}
				})
			}
  		}
	})
}

module.exports = RecipeManager
"use strict"
var mycol = "recipes"
var fs = require('fs')
var mongoose = require("mongoose")
var config = require('../config.js')
var uri = "mongodb://"+config.server+":"+config.mongoPort+"/recipes"

// connect to database via URI
mongoose.connect(uri)

// create a new schema for recipes (object)
var recipeSchema = mongoose.Schema({
    _id: Number,
    title: String,
    description: String,
    imgsrc: String
})
var Recipe = mongoose.model('Recipe', recipeSchema);

var RecipeManager = function(view, res, parsedurlinfo){
	this.recView = view
	this.parsedurlinfo = parsedurlinfo
	this.res = res
}

// READ RECIPES -----------------------------------------------------------------------------------
RecipeManager.prototype.getAll = function(htmlData){
 	var listRecipe = []
 	var recView = this.recView

 	// find all recipes
 	Recipe.find(function (err, recipes) {
  		if (err) {
  			console.error(err)
  		} else {
  			console.log(recipes);

  			// if there are recipes in the database
  			if(recipes.length != 0) {
  				// print all recipes to console
  				console.log(recipes)
  				// send recipes and htmlData to view
  				recView.formatHtml(recipes, htmlData)
  			} else {
  				// if there are no recipes -> format an empty html site
  				recView.formatEmpty(htmlData)
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

	// find recipe to update via id
	Recipe.findById(id, function (err, tmpRecipe) {
  		if (err) {
  			console.log(err)
  		} else {
  			console.log("INFO: recipe to modify: ")
  			console.log(tmpRecipe)

  			// modify the recipe
			tmpRecipe.title = data.title
			tmpRecipe.description = data.description
			tmpRecipe.imgsrc = data.imgsrc

			// save it back to the database
			tmpRecipe.save(function(err) {
				if (err) {
					console.log(err)
				} else {
					console.log("INFO: updating successful")
				}
			})
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
    	title: data.title,
    	description: data.description,
    	imgsrc: data.imgsrc
	})

	// save new recipe in database
	newRecipe.save(function (err, data) {
  		if (err) {
  			console.error(err)
  		} else {
  			console.log("INFO: new recipe inserted")
  		}
	})
}

// DELETE RECIPE -----------------------------------------------------------------------------------
RecipeManager.prototype.delete = function(id){
	// get entry from database via id
	Recipe.findById(id, function (err, tmpRecipe) {
  		if (err) {
  			console.log(err)
  		} else {
  			console.log("INFO: recipe to delete: ")
  			console.log(tmpRecipe)

  			// remove the recipe from the databasee
			tmpRecipe.remove(function(err) {
				if (err) {
					console.log(err)
				} else {
					console.log("INFO: deleting of recipe successful")
				}
			})
  		}
	})
}

module.exports = RecipeManager
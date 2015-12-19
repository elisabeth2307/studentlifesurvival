"use strict"
var fs = require('fs')
var redis = require("redis")
var config = require('../config.js')
var db = redis.createClient(config.redisPort,config.server)

var RecipeManager = function(view, res, parsedurlinfo){
	this.recView = view
	this.parsedurlinfo = parsedurlinfo
	this.res = res
}

RecipeManager.prototype.getAll = function(htmlData){
 	var size
 	var listRecipe = []
 	var recView = this.recView
	var recipe 

	// get size of database -> asynchronus
	db.dbsize(function(err, sizeData){
		if (err){
			console.log(err)
			res.writeHead(200, {'content-type':'text/plain'});
			res.end("ERROR get all data");
		} else if (sizeData){
			size = sizeData

			// get all entries
			for(var j = 1; j <= size; j++){
				db.get(j, function(error, data){
					if(data) {
						// add entry to list
						listRecipe.push(data)

						// if list has same size as db -> send data to view
						if(listRecipe.length == size){
							recView.formatHtml(listRecipe, htmlData)
						}
					}
				})
			}
		}
	})
}

RecipeManager.prototype.update = function(id, field, newData){
	var recipe

	// get entry which shall be updated
	db.get(id, function(err, data){
		if(err){
			console.log(err)		
			res.writeHead(200, {'content-type':'text/plain'});
			res.end("ERROR update data");
		} else if (data) {
			// write data for update in json object
			recipe = JSON.parse(data)

			// modify the wanted field
			if (field == "title") {
				recipe.title = newData
			} else if (field == "imgsrc") {
				recipe.imgsrc = newData
			}
			// set updated data to database
			db.set(id, JSON.stringify(recipe))
		}
	})
}

RecipeManager.prototype.insert = function(title, description, imgsrc, id){
	var recipe = {}
	var newId

	// fill object with parameter-data
	recipe.id = id
	recipe.title = title
	recipe.description = description
	recipe.imgsrc = imgsrc

	// get database size for new id
	db.dbsize(function(err, sizeData){
		if (err){
			console.log(err)
			res.writeHead(200, {'content-type':'text/plain'});
			res.end("ERROR insert data");
		} else if (sizeData) {
			newId = parseInt(sizeData)+1
			// set new entry
			db.set(newId, JSON.stringify(recipe))
		}
	})
}

RecipeManager.prototype.delete = function(id){
	// delete entry with parameter-id
	db.del(id, function(err, data){
		if (err) {
			console.log(err)
			res.writeHead(200, {'content-type':'text/plain'});
			res.end("ERROR delete data");
		} else if (data) {
			console.log("deleting successful")
		}
	})
}

module.exports = RecipeManager
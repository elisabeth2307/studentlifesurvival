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
var mgmt = this // just for testing

	// get size of database -> asynchronus
	for(var i = 0; i < 1; i++){
		db.get(i, function(err, sizeData){
			if (err){
				console.log(err)
				console.log("ERROR not able to read size of db")
			} else if (sizeData){
				console.log("in sizeData")
				console.log(sizeData)
				size = JSON.parse(sizeData).size

				// get all entries
				for(var j = 1; j <= size; j++){
					console.log("in loop")
					db.get(j, function(error, data){
						if(data) {
							console.log("data: "+data)
							listRecipe.push(data)

							console.log("size list: "+listRecipe.length)
							console.log("size: "+size)

							if(listRecipe.length == size){
								recView.formatHtml(listRecipe, htmlData)
							}
						}
					})
				}
			}
		})
	}
}

RecipeManager.prototype.update = function(id, field, newData){
	var recipe

	// id shall not be 0 -> todo
	db.get(id, function(err, data){
		if(err){
			console.log(err)		
			res.writeHead(200, {'content-type':'text/plain'});
			res.end("ERROR update data");
		} else if (data) {
			recipe = JSON.parse(data)
			if (field == "title") {
				recipe.title = newData
			} else if (field == "imgsrc") {
				recipe.imgsrc = newData
			}

			db.set(id, JSON.stringify(recipe))
		}
	})
}

RecipeManager.prototype.insert = function(title, description, imgsrc, id){
	var recipe = {}

	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

	recipe.title = title
	recipe.description = description
	recipe.imgsrc = imgsrc

	db.set(id, JSON.stringify(recipe), function(err, data){
		if (err){
			console.log(err)
			console.log("ERROR in recipe_mgmt.js insert")
		} else if (data){
			db.get(0, function(error, sizeData){
				if (error){
					console.log(error)
					console.log("ERROR in recipe_mgmt.js insert/getsize")
				} else if (sizeData){
					var sizeObj = JSON.parse(sizeData)
					sizeObj.size = parseInt(sizeObj.size)+1

					db.set(0, JSON.stringify(sizeObj))
				}
			})
		}
	})




}

module.exports = RecipeManager
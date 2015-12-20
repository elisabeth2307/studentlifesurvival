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
 	var listRecipe = []
 	var recView = this.recView

	// get size of database -> asynchronus
	db.keys('*', function(err, keys){
		if(err){
			console.log(err)
			res.writeHead(200, {'content-type':'text/plain'});
			res.end("ERROR get all data");
		} else if (keys.length > 0){
			for(var i = 0, len = keys.length; i < len; i++) {
				var index = parseInt(keys[i])

				db.get(index, function(error, dataGet){
					if(error){
						console.log(error)
						res.writeHead(200, {'content-type':'text/plain'});
						res.end("ERROR get all data");
					} else if (dataGet) {
						listRecipe.push(dataGet)

						if(listRecipe.length == keys.length){
							recView.formatHtml(listRecipe, htmlData)
						}
					}
				})
			}
		} else {
			recView.formatEmpty(htmlData)
		}
	})
}

RecipeManager.prototype.update = function(paramData, id){
	var newRecipe = {}
	var data = {}
	var keyvals, k, v
		
	paramData && paramData.split("&").forEach( function(keyval){
		keyvals = keyval.split("=")
		k=keyvals[0]
		v=keyvals[1]
		data[k]=v // we are inside a closure and cannot access this.data
	})
	this.data = data

	// fill object with parameter-data
	newRecipe.id = data.id
	newRecipe.title = data.title
	newRecipe.description = data.description
	newRecipe.imgsrc = data.imgsrc

	// get entry which shall be updated
	db.set(parseInt(id), JSON.stringify(newRecipe))
	console.log("INFO: updating successful")
}

RecipeManager.prototype.insert = function(paramData){
	var recipe = {}
	var newId = 0
	var index = 0
	var data = {}
	var keyvals, k, v

	paramData && paramData.split("&").forEach( function(keyval){
		keyvals = keyval.split("=")
		k=keyvals[0]
		v=keyvals[1]
		data[k]=v // we are inside a closure and cannot access this.data
	})
	this.data = data

	// fill object with parameter-data
	recipe.id = data.id
	recipe.title = data.title
	recipe.description = data.description
	recipe.imgsrc = data.imgsrc


	db.keys('*', function(err, keys){
		if (err) {
			console.log(err)
			res.writeHead(200, {'content-type':'text/plain'});
			res.end("ERROR insert data");
		} else {
			keys.sort()

			while (newId == 0) {
				if (keys[index] != index+1){
					newId = index
				}
				index ++
			}
			db.set(parseInt(index), JSON.stringify(recipe))
			console.log("INFO: inserting successful")
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
			console.log("INFO: deleting successful")
		}
	})
}

module.exports = RecipeManager
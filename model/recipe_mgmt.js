"use strict"
var fs = require('fs')
var redis = require("redis")
var config = require('../data/db_size.js')
var db = redis.createClient(config.redisPort,config.server)

var RecipeManager = function(view, res, parsedurlinfo){
	this.recView = view
	this.parsedurlinfo = parsedurlinfo
	this.res = res
}

RecipeManager.prototype.getAll = function(htmlData){
	//database access
 	var size = config.size
 	var listRecipe = []
 	var recView = this.recView
	var recipe 

	// get all entries from database
 	for(var i = 1; i <= size; i++){
 		db.get(i, function(err, data){
 			if (data){
 				listRecipe.push(data)

 				if(listRecipe.length == size) {
 					recView.formatHtml(listRecipe, htmlData)
 				}
 			}
 		})
 		

 	}
}

module.exports = RecipeManager
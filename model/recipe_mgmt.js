var fs = require('fs')
var redis = require("redis")
var db = redis.createClient(6379,"127.0.0.1")

var RecipeManager = function(view, parsedurlinfo, res){
	this.recView = view
	this.parsedurlinfo = parsedurlinfo
	this.res = res
}

RecipeManager.prototype.getAll = function(){
 //database access
 	size = db.dbsize()
 	listRecipe = []
	var recipe 

 	for(var i = 1; i <= size; i++){
 		db.get(i, function(err, data){
 			if (data){
 				recipe = JSON.parse(data)
 			}
 		})

 		listRecipe.push(recipe)

 	}



}

module.exports = RecipeManager
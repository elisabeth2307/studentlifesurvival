var fs = require('fs')
var redis = require("redis")
var db = redis.createClient(6379,"127.0.0.1")

var RecipeManager = function(view, res, parsedurlinfo){
	this.recView = view
	this.parsedurlinfo = parsedurlinfo
	this.res = res
}

RecipeManager.prototype.getAll = function(data){
 //database access
 	size = db.dbsize()
 	listRecipe = []
 	recView = this.recView
	var recipe 

	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ")

 	for(var i = 1; i <= size; i++){
 		db.get(i, function(err, data){
 			if (data){
 				recipe = JSON.parse(data)
 				console.log(recipe)

 			}
 		})

 		listRecipe.push(recipe)

 	}
 	console.log("size list "+listRecipe.length)
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ")

 	recView.formatHtml(listRecipe, data)

}



module.exports = RecipeManager
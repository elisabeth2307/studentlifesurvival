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
 	size = db.size()
 	listRecipe = []


 	for(var i = 1; i <= size; i++){
 		db.get(i, function(err, data){
 			if (data){
 				var recipe = JSON.parse(data)
 			}
 		})

 		listRecipe.append(recipe)

 	}

db.end()


}

module.exports = RecipeManager
"use strict"
var fs = require('fs');
var RecipeView = require("../view/recipe_view.js")
var RecipeManager = require("../model/recipe_mgmt.js")
var Recipe = require("../model/recipe_model.js")

var StaticController=function(parsedurlinfo, res){
	this.parsedurlinfo=parsedurlinfo
	this.res = res
	this.recManager = new RecipeManager
	this.recipeView = new RecipeView(parsedurlinfo, res)
	this.recipeManager = new RecipeManager(this.recipeView, parsedurlinfo, res)

}

StaticController.prototype.handle=function () {
	console.log("\n--- Handling Static Content");

	var filename = this.parsedurlinfo.path
	/*[".", // <= maybe we should add a dynamic path here
			this.parsedurlinfo.resource,
			[this.parsedurlinfo.id,this.parsedurlinfo.format].join(".")
			].join("/")*/
	
	console.log("INFO: serving static file '"+ filename)
	var res=this.res
	var format = this.parsedurlinfo.format
	var id = this.parsedurlinfo.id
	var recipeManager = this.recipeManager
	var content = this.parsedurlinfo.content

	fs.readFile(filename, function(err, data){
			if (err){ // throw	err;
				console.log(err)		
				//console.log("TODO 404 page")
				res.writeHead(200, {'content-type':'text/plain'});
				res.end("Helpful ERROR static controller :-)");
			}else{ 
				var utf8data=data.toString('UTF-8')

				// handling images
				if(content == "image"){
					res.writeHead(200, {'content-type':'image/'+format});
					res.end(data, 'binary')
				} else { // css, html, js
					res.writeHead(200, {'content-type':'text/'+format});

					if(id == "cooking"){
						recipeManager.getAll(utf8data) // evtl auslagern 
					}
					res.end(utf8data);
				}
				console.log("---------------------------------------------------------------")

			}
		
	})
}

module.exports.StaticController = StaticController
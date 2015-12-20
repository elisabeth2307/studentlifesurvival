"use strict"
var fs = require('fs');
var RecipeView = require("../view/recipe_view.js")
var RecipeManager = require("../model/recipe_mgmt.js")
var Recipe = require("../model/recipe_model.js")

var StaticController=function(parsedurlinfo, req, res){
	this.parsedurlinfo=parsedurlinfo
	this.res = res
	this.req = req
}

StaticController.prototype.handle=function () {
	console.log("\n--- Handling Static Content");

	var req = this.req
	var res = this.res
	var parsedurlinfo = this.parsedurlinfo
	var format = this.parsedurlinfo.format
	var id = this.parsedurlinfo.id
	var content = this.parsedurlinfo.content
	var filename = this.parsedurlinfo.path
	
	console.log("INFO: serving static file '"+ filename)

	fs.readFile(filename, function(err, data){
			if (err){ // throw	err;
				console.log(err)		
				res.writeHead(200, {'content-type':'text/plain'});
				res.end("ERROR static controller");
			}else{ 
				res.writeHead(200, {'content-type':''+content+'/'+format});
				var utf8data = data.toString('UTF-8')

				// handling images
				if(content == "image"){
					res.end(data, 'binary')
				} // handling non binary content
				else { 
					if(id == "cooking"){
						var crudContr = require("./crud_contr.js")
						var crudController = new crudContr.CrudController(parsedurlinfo, req, res)
						crudController.setHtmlData(utf8data)
						crudController.handle()
					} else {
						res.end(utf8data);
					}
				}
				console.log("---------------------------------------------------------------")
			}
	})
}

module.exports.StaticController = StaticController
"use strict"
var fs = require('fs');
var RecipeView = require("../view/recipe_view.js")
var RecipeManager = require("../model/recipe_mgmt.js")
var Recipe = require("../model/recipe_model.js")
var template = "./public/template.html"

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


	// load the file itself
	fs.readFile(filename, function(err, data){
			if (err){ // throw	err;
				console.log(err)		
				res.writeHead(200, {'content-type':'text/plain'});
				res.end("ERROR static controller - loading file");
			}else{ 
				res.writeHead(200, {'content-type':''+content+'/'+format});
				var utf8data = data.toString('UTF-8')

				// handling images
				if(content == "image"){
					res.end(data, 'binary')
				}
				// handling html
				else if (format == "html") { 
					// load the template if it's html
					fs.readFile(template, function(error, tempdata){
						if (error) {
							console.log(error)
							res.writeHead(200, {'content-type':'text/plain'});
							res.end("ERROR static controller - loading template");
						} else {
							var result = tempdata.toString()

							// you have to do this here because of the htmldata (utf8data)
							if(id == "cooking"){
								var crudContr = require("./crud_contr.js")
								var crudController = new crudContr.CrudController(parsedurlinfo, req, res)
								crudController.setHtmlData(result, utf8data)
								crudController.handle()
							} else {
								// replace the pattern in the template with the data from the requested file
								result = result.replace(/{CONTENT}/g, utf8data)
								res.end(result);
							}
						}
					})
				} 
				// handling all other files
				else {
					res.end(utf8data)
				}
				console.log("---------------------------------------------------------------")
			}
	})
}

module.exports.StaticController = StaticController
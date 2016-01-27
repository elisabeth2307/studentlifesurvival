"use strict"
var fs = require('fs');
var Recipe = require("../model/recipe_model.js")
var config = require("../config.js")
var template = config.htmltemplate

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
	var cookieSet = this.parsedurlinfo.cookieSet
	
	console.log("INFO: serving static file '"+ filename)

	// load the file itself
	fs.readFile(filename, function(err, data){
			if (err){
				console.log(err)	

				// handle file not found
				fs.readFile("public/images/404.jpg", function(error, img){
					if (error) {
						console.log(error)
						res.writeHead(400, {'content-type':'text/plain'});
						res.end("404 - source not found!");
					} else {
						res.writeHead(200, {'content-type':'image/jpg'});
						res.end(img, 'binary')
					}
				})	
			} 
			// file was found
			else{ 
				// write head
				res.writeHead(200, {'content-type':''+content+'/'+format});
				// html data to string
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
							// html template data to string
							var result = tempdata.toString()

							// set "status-text" depending if logged in or not
							var status = "Register/Login"
							if(cookieSet){
								status = "Logged in"
							}
							result = result.replace(/{STATUS}/g, status)

							// if id is cooking (site with dynamic content) also call crud-controller
							if(id == "cooking"){
								var crudContr = require("./crud_contr.js")
								var crudController = new crudContr.CrudController(parsedurlinfo, req, res)
								crudController.setHtmlData(result, utf8data) // set data for crud controller
								crudController.handle()
								// response is in view/recipe_view.js
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
				// might appear later because of asynchronus operations
				console.log("---------------------------------------------------------------")
			}
	})
}

module.exports.StaticController = StaticController
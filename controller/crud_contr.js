"use strict"
var RecipeView = require("../view/recipe_view.js")
var RecipeManager = require("../model/recipe_mgmt.js")

var CrudController = function(parsedurlinfo, req, res){
	this.parsedurlinfo = parsedurlinfo
	this.req = req
	this.res = res
	this.recipeView = new RecipeView(parsedurlinfo, res)
	this.recipeManager = new RecipeManager(this.recipeView, parsedurlinfo, res)
	this.htmlData = ""
	this.headerData = ""
}

CrudController.prototype.handle = function() {
	var recipeManager = this.recipeManager
	var id = this.parsedurlinfo.id
	var requestedMethod = this.req.method
	var res = this.res
	var req = this.req
	var paramData = this.parsedurlinfo.params
	var htmlData = this.htmlData
	var headerData = this.headerData

	// GET --------------------------------------------------------------
	if (requestedMethod == "GET") {
		console.log("INFO: getting all entries")
		recipeManager.getAll(htmlData, headerData)
	}
	// DELETE --------------------------------------------------------------
	else if (requestedMethod == "DELETE") {
		console.log("INFO: deleting entry with id: "+id)
		recipeManager.delete(id)

		res.writeHead(200, {'content-type':'text/plain'});
		res.end("Deleting of id \""+id+"\" was successful!\n");
	} 
	// POST --------------------------------------------------------------
	else if (requestedMethod == "POST") {
		console.log("INFO: inserting new recipe")

		// get post-data
		var paramData = ''
		req.on("data", function(data){paramData +=data})
			req.on("end",function(){
				paramData = paramData.replace(/%20/g, ' ')
				console.log("POST-DATA: ", paramData)
				recipeManager.insert(paramData)
			} 
		);

		res.writeHead(200, {'content-type':'text/plain'});
		res.end("Insertion was successful!\n");
	} 
	// PUT --------------------------------------------------------------
	else if (requestedMethod == "PUT") {
		console.log("INFO: updating recipe")
		
		// get post-data
		var paramData = ''
		req.on("data", function(data){paramData +=data})
			req.on("end",function(){
				paramData = paramData.replace(/%20/g, ' ')
				console.log("POST-DATA: ", paramData)
				recipeManager.update(paramData, id)
			} 
		);

		res.writeHead(200, {'content-type':'text/plain'});
		res.end("Updating was successful!\n");
	}
}

CrudController.prototype.setHtmlData = function (htmlData, headerData){
	this.htmlData = htmlData
	this.headerData = headerData
}

module.exports.CrudController = CrudController
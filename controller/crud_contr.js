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
		console.log("INFO: getting all recipes")
		recipeManager.getAll(htmlData, headerData) // call manager (database access needed)
	}
	// DELETE --------------------------------------------------------------
	else if (requestedMethod == "DELETE") {
		console.log("INFO: deleting entry with id: "+id)
		recipeManager.delete(id) // call manager and delete from database

		res.writeHead(200, {'content-type':'text/plain'});
		res.end("Delete task of id \""+id+"\" done!\n");
	} 
	// POST --------------------------------------------------------------
	else if (requestedMethod == "POST") {
		console.log("INFO: inserting new recipe")

		// get post-data from request (source: mr feiner)
		var paramData = ''
		req.on("data", function(data){paramData +=data})
			req.on("end",function(){

				// replace with space
				paramData = paramData.replace(/%20/g, ' ')
				paramData = paramData.replace(/\+/g, ' ')
				// replace with slash
				paramData = paramData.replace(/%2F/g, '/')

				console.log("POST-DATA: ", paramData)
				recipeManager.insert(paramData) // call manager and insert into database
			} 
		);

		res.writeHead(200, {'content-type':'text/plain'});
		res.end("Insert task done!\n");
	} 
	// PUT --------------------------------------------------------------
	else if (requestedMethod == "PUT") {
		console.log("INFO: updating recipe")
		
		// get post-data from request (source: mr feiner)
		var paramData = ''
		req.on("data", function(data){paramData +=data})
			req.on("end",function(){

				// replace with space
				paramData = paramData.replace(/%20/g, ' ')

				console.log("POST-DATA: ", paramData)
				recipeManager.update(paramData, id) // call manager and update in database
			} 
		);

		res.writeHead(200, {'content-type':'text/plain'});
		res.end("Update task done!\n");
	}
}

// needed for site cooking
CrudController.prototype.setHtmlData = function (htmlData, headerData){
	this.htmlData = htmlData
	this.headerData = headerData
}

module.exports.CrudController = CrudController
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
	var resource = this.parsedurlinfo.resource
	var requestedMethod = this.req.method
	var res = this.res
	var req = this.req
	var paramData = this.parsedurlinfo.params
	var htmlData = this.htmlData
	var headerData = this.headerData

	// GET --------------------------------------------------------------
	if (requestedMethod == "GET") {
		// one specific recipe is requested
		if (resource == "public/content/recipe"){
			console.log("INFO: getting recipe: "+id)
			recipeManager.get(id, res) // call manager (database access needed)
		} 
		// all recipes are requested
		else {
			console.log("INFO: getting all recipes")
			recipeManager.getAll(htmlData, headerData) // call manager (database access needed)
		}
	}
	// DELETE --------------------------------------------------------------
	else if (requestedMethod == "DELETE") {
		console.log("INFO: deleting entry with id: "+id)

		// call manager and delete from database
		recipeManager.delete(id, res)
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
				recipeManager.insert(paramData, res) // call manager and insert into database
			} 
		);
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
				recipeManager.update(paramData, id, res) // call manager and update in database
			} 
		);
	}
}

// needed for site cooking
CrudController.prototype.setHtmlData = function (htmlData, headerData){
	this.htmlData = htmlData
	this.headerData = headerData
}

module.exports.CrudController = CrudController
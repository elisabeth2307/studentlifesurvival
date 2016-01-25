"use strict"
var Recipe = require("../model/recipe_model.js")

var RecipeView = function(parsedurlinfo, res ){
	this.parsedurlinfo = parsedurlinfo
	this.res = res
}

// function which is called when recipes were found in database
RecipeView.prototype.formatHtml = function(data, htmlTemplate, headerData) {
	var result = htmlTemplate.toString()
	var recList = "<h3>Jump directly to a recipe</h3><ul>" // recipe list in the beginning of the site for a better overview
	var recipes = ""
	var content = ""

	// get amount of recipes
	var length = Object.keys(data).length

	// loop for all recipes
	for(var recipe in data){
		// parse recipe to json-object
		recipe = JSON.parse(data[recipe])

		// new recipe-model
		var tmpRec = new Recipe(recipe.id, recipe.description, recipe.imgsrc)

		// for overview of recipes 
		recList += tmpRec.toLink()

		// recipe with all information
		recipes += tmpRec.toHTML()
	}

	recList += "</ul><br><br>"

	// join all given html parts
	content = headerData.concat(recList)
	content = content.concat(recipes)
	// replace pattern with content (html)
	result = result.replace(/{CONTENT}/g, content)

	// send replaced html template (head was written in static_contr.js)
	this.res.end(result);
}

RecipeView.prototype.formatEmpty = function(htmlTemplate, headerData) {
	// parse the html temple to string and replace the pattern with a message
	var result = htmlTemplate.toString()
	result = result.replace(/{CONTENT}/g, "<h2>No recipies available!</h2><p class=\"textCenter\">You can insert recipes when you are logged in.</p> " +
		"<p class=\"textCenter\">Help the poor students to avoid dying because of hunger!</p><img src=\"../images/cooking.jpg\" class=\"center\">")

	// send replaced html template (head was written in static_contr.js)
	this.res.end(result);
}

module.exports = RecipeView
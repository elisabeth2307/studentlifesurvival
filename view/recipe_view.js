"use strict"
var Recipe = require("../model/recipe_model.js")

var RecipeView = function(parsedurlinfo, res ){
	this.parsedurlinfo = parsedurlinfo
	this.res = res
}

RecipeView.prototype.formatHtml = function(data, htmlTemplate, headerData) {
	var result = htmlTemplate.toString()
	var recList = "<ul>" // recipe list in the beginning for a better overview
	var recipes = ""
	var content = ""

	//var data = JSON.parse(data)
	var length = Object.keys(data).length

	for(var recipe in data){
		recipe = JSON.parse(data[recipe])

		// new recipe via model
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
	// replace pattern with the "big" html part named content
	result = result.replace(/{CONTENT}/g, content)

	// send replaced html template
	this.res.writeHead(200, {'Content-Type': 'text/html'} );
	this.res.end(result);
}

RecipeView.prototype.formatEmpty = function(htmlTemplate, headerData) {
	// parse the html temple to string and replace the pattern with a message
	var result = htmlTemplate.toString()
	result = result.replace(/{CONTENT}/g, "<h2>No recipies available!</h2><p class=\"textCenter\">You can insert recipes if you are logged in.</p> " +
		"<p class=\"textCenter\">Help the poor students to avoid dying because of hunger!</p><img src=\"../images/cooking.jpg\" class=\"center\">")

	// send replaced html template
	this.res.writeHead(200, {'Content-Type': 'text/html'} );
	this.res.end(result);
}

module.exports = RecipeView
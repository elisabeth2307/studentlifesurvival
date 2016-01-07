"use strict"
var fs = require('fs')

var RecipeView = function(parsedurlinfo, res ){
	this.parsedurlinfo = parsedurlinfo
	this.res = res

	//this.layout="view/layout.html"
	//this.rec	="view/song/song_template.html"
}

RecipeView.prototype.formatHtml = function(data,htmlTemplate) {
	var result = htmlTemplate.toString()
	var recList = "<ul>"
	var recipes = ""

	for (var i = 0; i < data.length; i++){
		var recipe = data[i]

		recList += "<a href = #" + recipe.title + ">" + recipe.title + "</a><br>"

		recipes += "<h3><a name = " + recipe.title + ">" + recipe.title + "</a></h3>"
		recipes += "<p>" + recipe.description + "</p>"
		recipes += "<img src = \"" + recipe.imgsrc + "\" >"
	}

	recList += "</ul>"
	result = result.replace(/{LINKS}/g, recList)
	result = result.replace(/{CONTENT}/g, recipes)

	this.res.writeHead(200, {'Content-Type': 'text/html'} );
	this.res.end(result);
}

RecipeView.prototype.formatEmpty = function(htmlTemplate) {
	var result = htmlTemplate.toString()
	result = result.replace(/{LINKS}/g, "<h3>No recipies available!</h3")
	result = result.replace(/{CONTENT}/g, "<p>You can insert recipes if you are logged in.</p> " +
		"<p>Help the poor students to avoid dying because of hunger!</p>")

	this.res.writeHead(200, {'Content-Type': 'text/html'} );
	this.res.end(result);
}

module.exports = RecipeView
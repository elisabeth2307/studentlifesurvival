"use strict"
var fs = require('fs')

var RecipeView = function(parsedurlinfo, res ){
	this.parsedurlinfo = parsedurlinfo
	this.res = res

	//this.layout="view/layout.html"
	//this.rec	="view/song/song_template.html"
}

RecipeView.prototype.formatHtml = function(data,htmlTemplate){
	var result = htmlTemplate.toString()
	var recList = "<ul>"
	var recipies = ""

	for (var i = 0; i < data.length; i++){
		var recipe = JSON.parse(data[i])
		recList += "<li>" + recipe.title + "</li>"

		recipies += "<h3>" + recipe.title + "</h3>"
		recipies += "<p>" + recipe.description + "</p>"
		recipies += "<img src = \"" + recipe.imgsrc + "\" >"
	}

	recList += "</ul>"
	result = result.replace(/{LINKS}/g, recList)
	result = result.replace(/{CONTENT}/g, recipies)


	this.res.writeHead(200, {'Content-Type': 'text/html'} );
	this.res.end(result);


}


module.exports = RecipeView
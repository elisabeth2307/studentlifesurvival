"use strict"

var RecipeView = function(parsedurlinfo, res ){
	this.parsedurlinfo = parsedurlinfo
	this.res = res
}

RecipeView.prototype.formatHtml = function(data,htmlTemplate, headerData) {
	var result = htmlTemplate.toString()
	var recList = "<ul>" // recipe list in the beginning for a better overview
	var recipes = ""
	var content = ""

	for (var i = 0; i < data.length; i++){
		var recipe = data[i]

		// for overview of recipes
		recList += "><a href = #" + recipe.id + ">" + recipe.id + "</a><br>"

		// recipes with all information
		recipes += "<h3><a name = " + recipe.id + ">" + recipe.id + "</a></h3>"
		recipes += "<p>" + recipe.description + "</p>"
		recipes += "<img src = \"" + recipe.imgsrc + "\" class = \"center\">"
		recipes += "<a href=\"updateRecipe.html?id="+recipe.id+"\">Update Recipe "+recipe.id+"</a><br>"
		recipes += "<a href=\"deleteRecipe.html?id="+recipe.id+"\">Delete Recipe "+recipe.id+"</a>"
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
	result = result.replace(/{CONTENT}/g, "<h3>No recipies available!</h3><p>You can insert recipes if you are logged in.</p> " +
		"<p>Help the poor students to avoid dying because of hunger!</p>")

	// send replaced html template
	this.res.writeHead(200, {'Content-Type': 'text/html'} );
	this.res.end(result);
}

module.exports = RecipeView
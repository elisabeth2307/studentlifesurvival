var fs = require('fs')

var RecipeView = function(parsedurlinfo, res ){
	this.parsedurlinfo = parsedurlinfo
	this.res = res

	//this.layout="view/layout.html"
	//this.rec	="view/song/song_template.html"
}

RecipeView.prototype.formatHtml = function(data,htmlTemplate){
	var result = htmlTemplate
	var recList = "<ul>"
	var recipies = ""

	for (var recipe in data){
		var cur_rec = data[recipe]
		recList += "<li>" + cur_rec.title + "</li>"

		recipies = "<h3>" + cur_rec.title + "</h3>"
		recipies = "<p>" + cur_rec.description + "</p>"
		recipies = "<img src = \"" + cur_rec.src + "\" >"
	}
	recList += "</ul>"
	result = result.replace(/{LINKS}/g, recList)
	result = result.replace(/{CONTENT}/g, recipies)

	this.res.writeHead(200, {'Content-Type': 'text/html'} );
	this.res.end(result);


}


module.exports = RecipeView
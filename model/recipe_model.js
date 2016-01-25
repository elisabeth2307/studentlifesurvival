var Recipe = function(id,description, imgsrc){
	this.id = id
	this.description = description
	this.imgsrc = imgsrc
}

// return formatted link for cooking.html
Recipe.prototype.toLink = function(){
	return "<li><a href=#" + this.id + ">" + this.id + "</a></li>"
}

// return formatted recipe for cooking.html
Recipe.prototype.toHTML = function(){
	var recipes = ""

	recipes += "<hr><h3><a name = " + this.id + ">" + this.id + "</a></h3>"
	recipes += "<p>" + this.description + "</p>"
	recipes += "<img src = \"" + this.imgsrc + "\" class = \"center\">"
	recipes += "<a class=\"centerlink\" href=\"updateRecipe.html?id="+this.id+"\"><button>Update "+this.id+"</button></a>"
	recipes += "<a class=\"centerlink\" href=\"deleteRecipe.html?id="+this.id+"\"><button>Delete "+this.id+"</button></a>"

	return recipes
}

module.exports = Recipe
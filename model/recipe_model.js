var Recipe = function(id,title,description, src){
	this.id = id
	this.title = title
	this.description = description
	this.src = src
}

Recipe.prototype.toString = function(){
	return "This is recipe '"+this.title+"'."
}

module.exports = Recipe
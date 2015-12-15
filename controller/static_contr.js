var fs = require('fs');
var RecipeView = require("../view/recipe_view.js")
var RecipeManager = require("../model/recipe_mgmt.js")
var Recipe = require("../model/recipe_model.js")

var StaticController=function(parsedurlinfo, res){
	this.parsedurlinfo=parsedurlinfo
	this.res = res
	this.recManager = new RecipeManager
	this.recipeView = new RecipeView(parsedurlinfo, res)
	this.recipeManager = new RecipeManager(this.recipeView, parsedurlinfo, res)

}

StaticController.prototype.handle=function () {
	console.log("\n--- Handling Static Content");

	filename = this.parsedurlinfo.path
	/*[".", // <= maybe we should add a dynamic path here
			this.parsedurlinfo.resource,
			[this.parsedurlinfo.id,this.parsedurlinfo.format].join(".")
			].join("/")*/
	var res=this.res
	console.log("INFO: serving static file '"+ filename)
	format = this.parsedurlinfo.format
	id = this.parsedurlinfo.id

	fs.readFile(filename, function(err, data){
			if (err){ // throw	err;
				console.log(err)		
				//console.log("TODO 404 page")
				res.writeHead(200, {'content-type':'text/plain'});
				res.end("Helpful ERROR static controller :-)");
			}else{ 
				utf8data=data.toString('UTF-8')

				//TODO send proper mimetype for png/gif/css/js"
				res.writeHead(200, {'content-type':'text/'+format});

				if(id == "cooking"){
					this.songManager.getAll( this.songView ,this.res,this.parsedurlinfo) // evtl auslagern 
				}

				res.end(utf8data);
				console.log("---------------------------------------------------------------")

			}
		
	})
}

module.exports.StaticController = StaticController
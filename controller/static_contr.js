var fs = require('fs');

var StaticController=function(parsedurlinfo, res){
	this.parsedurlinfo=parsedurlinfo
	this.res = res
}

StaticController.prototype.handle=function () {
	console.log("\n--- Handling Static Content");

	filename = this.parsedurlinfo.path
	/*[".", // <= maybe we should add a dynamic path here
			this.parsedurlinfo.resource,
			[this.parsedurlinfo.id,this.parsedurlinfo.format].join(".")
			].join("/")*/
	res=this.res	// needed?
	console.log("INFO: serving static file '"+ filename)
	console.log("---------------------------------------------------------------")

	format = this.parsedurlinfo.format

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
				res.end(utf8data);

			}
		
	})
}

module.exports.StaticController = StaticController
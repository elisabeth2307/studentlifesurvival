var fs = require('fs');

var ImageController=function(parsedurlinfo, res){
	this.parsedurlinfo=parsedurlinfo
	this.res = res
}

ImageController.prototype.handle = function(){
	console.log("\n--- Handling Image Content")

	filename = this.parsedurlinfo.path
	console.log("INFO: serving image '"+ filename)

	format = this.parsedurlinfo.format
	console.log("FORMAT IMAGE CONTROLLER "+format)

	res = this.res

	fs.readFile(filename, function(err, data){
		if (err){ // throw	err;
			console.log(err) // just show error, don't stop server
			res.writeHead(200, {'content-type':'text/plain'});
			res.end("We're sorry, an ERROR occured in image controller :-(");
		}else{ 
			//var img = fs.readFileSync(filename);
			res.writeHead(200, {'content-type':'image/png'});
			res.end(data, 'binary')

		}
	})

}

module.exports.ImageController=ImageController

/*
	var img = fs.readFileSync(filename);
	console.log("image size "+img.length)
     		res.end(img, 'binary');


*/
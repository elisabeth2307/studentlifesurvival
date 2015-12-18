startup = function(){
	var http = require('http');
	var config = require('../config.js')
	var urlp = require('../helper/urlparser.js')
	var staticcontr = require('./static_contr.js');

	var serv = http.createServer(function(req, res) {
		// TODO addCookie(req,res)
		urlparser = new urlp.UrlParser(req);
		console.log("Parser Controller: "+urlparser.controller);

		console.log("INFO: requested url: '"+req.url+"':")
		// TODO handler!
		// TODO: add more controllers, e.g. to manage users: add/delete/login/...
		
		if(urlparser.controller == "static") {
			handlerController = new staticcontr.StaticController(urlparser, res)		
		} else {
			handlerController = new staticcontr.StaticController(urlparser, res)		
		}

		handlerController.handle();	
	});
	serv.listen(config.serverPort);
}

module.exports.startup = startup
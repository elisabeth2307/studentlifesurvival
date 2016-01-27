startup = function(){
	var http = require('http');
	var config = require('../config.js')
	var urlp = require('../helper/urlparser.js')
	var staticcontr = require('./static_contr.js');
	var crudContr = require("./crud_contr.js")
	var regisContr = require("./regis_contr.js")

	var serv = http.createServer(function(req, res) {
		var cookieSet = false
		var handlerController = null

		// check if cookie is set -> needed for urlparser
		if(req.headers.cookie != null){
			cookieSet = true
		}

		// urlparser parses request + console output
		urlparser = new urlp.UrlParser(req, cookieSet);
		console.log("Parser Controller: " + urlparser.controller);
		console.log("INFO: requested method: " + req.method)
		console.log("INFO: requested url: " + req.url)
		

		// call controller depending on method and id
		// REGISTRATION -------------------------------------------------------------------
		if (req.method == "GET" && req.url.split('=')[0] == "/?id") {
			handlerController = new regisContr.RegistrationController(urlparser, req, res)
		}
		else if (req.method == "POST" && urlparser.id == "registration"){
			handlerController = new regisContr.RegistrationController(urlparser, req, res)
		} 
		// RECIPES -----------------------------------------------------------------------
		else if(req.method == "GET" && urlparser.resource == "public/content/recipe") {
			handlerController = new crudContr.CrudController(urlparser, req, res)		
		} 
		else if(req.method == "GET" && urlparser.controller == "static") {
			handlerController = new staticcontr.StaticController(urlparser, req, res)		
		} 
		else if (req.method == "DELETE" && urlparser.resource == "public/content/recipes" && urlparser.permission) {
			handlerController = new crudContr.CrudController(urlparser, req, res)
		} 
		else if (req.method == "POST" && urlparser.resource == "public/content/recipes" && urlparser.permission){
			handlerController = new crudContr.CrudController(urlparser, req, res)
		} 
		else if (req.method == "PUT" && urlparser.resource == "public/content/recipes" && urlparser.permission){
			handlerController = new crudContr.CrudController(urlparser, req, res)
		} 
		else if (!urlparser.permission) {
			// only bad people get here! (e. g. via CURL without being logged in)
			res.writeHead(400, {'content-type':'text/plain'});
			res.end("Please log in to perform changes.");
		}
		// DEFAULT -----------------------------------------------------------------------
		else {
			handlerController = new staticcontr.StaticController(urlparser, req, res)		
		}

		// if handlerController is defined (just null when someone tried to insert/delete/update data with CURL without being logged in)
		if(handlerController != null){
			handlerController.handle();	// controller starts doing something
		}
		
	});
	serv.listen(config.serverPort); // define to which port server should listen
}

module.exports.startup = startup
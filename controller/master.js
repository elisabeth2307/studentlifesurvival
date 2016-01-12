startup = function(){
	var http = require('http');
	var config = require('../config.js')
	var urlp = require('../helper/urlparser.js')
	var staticcontr = require('./static_contr.js');
	var crudContr = require("./crud_contr.js")
	var regisContr = require("./regis_contr.js")

	var serv = http.createServer(function(req, res) {
		// TODO addCookie(req,res)
		urlparser = new urlp.UrlParser(req);
		console.log("Parser Controller: " + urlparser.controller);
		console.log("INFO: requested method: " + req.method)
		console.log("INFO: requested url: '" + req.url+"'")
		// TODO: add more controllers, e.g. to manage users: add/delete/login/...
		
		if(urlparser.controller == "static" && req.method == "GET") {
			handlerController = new staticcontr.StaticController(urlparser, req, res)		
		} 
		else if (req.method == "DELETE") {
			handlerController = new crudContr.CrudController(urlparser, req, res)
		} 
		else if (req.method == "POST" && urlparser.id == "cooking"){
			handlerController = new crudContr.CrudController(urlparser, req, res)
		} 
		else if (req.method == "POST" && urlparser.id == "registration"){
			handlerController = new regisContr.RegistrationController(urlparser, req, res)
		} 
		else if (req.method == "PUT"){
			handlerController = new crudContr.CrudController(urlparser, req, res)
		} 
		else {
			handlerController = new staticcontr.StaticController(urlparser, req, res)		
		}

		handlerController.handle();	
	});
	serv.listen(config.serverPort);
}

module.exports.startup = startup
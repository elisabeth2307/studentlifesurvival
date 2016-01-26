"use strict"
var RegistrationManager = require("../model/registration_mgmt.js")


var RegistrationController = function(parsedurlinfo, req, res){
	this.parsedurlinfo = parsedurlinfo
	this.req = req
	this.res = res
	this.regisManager = new RegistrationManager(parsedurlinfo, res)
}

RegistrationController.prototype.handle = function() {
	var regisManager = this.regisManager
	var id = this.parsedurlinfo.id
	var requestedMethod = this.req.method
	var res = this.res
	var req = this.req
	var paramData = this.parsedurlinfo.params

	console.log("INFO: registration controller")

	//verify
	if (requestedMethod == "GET") {
		
		var params = req.url.substring(2)
		var id = params.split('=')[1].split('&')[0]
		var token = params.split('=')[2]

		console.log("INFO token = "+token)
		regisManager.verifyUser(id, token)
		
		res.writeHead(200, {'content-type':'text/plain'})
		res.end("Email-Adress successfully verified\n")
	}

	//register or login
	else {

		var status = ''
		// get post-data
		var paramData = ''
		req.on("data", function(data){paramData +=data})
		req.on("end",function(){

			// replace @
			paramData = paramData.replace(/%40/g, '@')

			console.log("POST-DATA: ", paramData)
			status = regisManager.insert(paramData)
		});

			res.writeHead(200, {'content-type':'text/plain'});
			res.end(status);
	}
} 

module.exports.RegistrationController = RegistrationController
"use strict"
var RegistrationManager = require("../model/registration_mgmt.js")


var RegistrationController = function(parsedurlinfo, req, res){
	this.parsedurlinfo = parsedurlinfo
	this.req = req
	this.res = res
	this.regisManager = new RegistrationManager(parsedurlinfo, res)
	this.htmlData = ""
	this.headerData = ""
}

RegistrationController.prototype.handle = function() {
	var regisManager = this.regisManager
	var id = this.parsedurlinfo.id
	var requestedMethod = this.req.method
	var res = this.res
	var req = this.req
	var paramData = this.parsedurlinfo.params
	var htmlData = this.htmlData
	var headerData = this.headerData

	console.log("INFO: registration controller")

	if (requestedMethod != "POST")
		console.log("!!!! something went wrong... you shouldn't be here !!!!")

	// get post-data
	var paramData = ''
	req.on("data", function(data){paramData +=data})
	req.on("end",function(){

		// replace @
		paramData = paramData.replace(/%40/g, '@')

		//if user already exists -> login
		console.log("POST-DATA: ", paramData)
		regisManager.insert(paramData)
	});

		res.writeHead(200, {'content-type':'text/plain'});
		res.end("User inserted\n");
} 

module.exports.RegistrationController = RegistrationController
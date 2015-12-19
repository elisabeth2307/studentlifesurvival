"use strict"
var UrlParser = function(request){
	this.req=request
	this.url=request.url;
	this.controller="static";
	this.content="text"
	this.path="";
	this.resource="";
	this.id=null;
	this.format=null;
	this.params={}
	
	this.parse();
}

// TODO: make this stable, i.e. work with MISSING parts in the url :)

UrlParser.prototype.parse=function(){
	console.log("\n\n---------------------------------------------------------------")

	var parts = this.url.split('/');
	var fileandparam = parts.pop()
	var fileandparamlist
	var paramstr
	var fileWithSuffix
	var params
	
	if (parts.length > 2){
		//console.log("TODO:   what happens for short, what with long pathes/urls?")
		this.resource = parts.join('/').substring(1)
	} else {
		this.resource = "public"
	}

	if (fileandparam) {
		fileandparamlist = fileandparam.split("?")
		console.log("DEBUG: fileandparamlist=",fileandparamlist)
	
		if (fileandparamlist.length >1) { // ? was given
			paramstr = fileandparamlist.pop() // => paramstr = 'lan=en&perpage=5'
			fileWithSuffix = fileandparamlist[0] || ""
		} else { // no ? given, i.e. no params => only one element in list
			paramstr=""
			fileWithSuffix=fileandparamlist.pop()
		}
		console.log("DEBUG: paramstr = ",paramstr)
		
		//console.log("TODO: 'STABILITY (avoid errors, handle incomplete input)'")
		//console.log("TODO: what happens with urls without format e.g. /public/test")
		this.id     = fileWithSuffix.split(".")[0]
		this.format = fileWithSuffix.split(".")[1]
	
		// we extract all the key-value pairs of the parameters 
		// into the dict this.params={}
		params={}
		// for e.g. paramstr = 'lan=en&perpage=5'
		paramstr && paramstr.split("&").forEach( function(keyval){
			console.log("DEBUG: keyval=",keyval)
			keyvals = keyval.split("=")
			console.log("DEBUG: keyvals=",keyvals)
			k=keyvals[0]
			v=keyvals[1]
			console.log("DEBUG: params=",params)
			params[k]=v // we are inside a closure and cannot access this.params
		})
		this.params=params
	} else {
		console.log("No files and parameters given with url '"+this.url+"'")
		this.resource = "public"
		this.id       = "index"
		this.format   = "html"
	}

	if(	!(this.format=="html") && 
		!(this.format == "css") && 
		!(this.format == "js")){
		this.content = "image"
	}

	this.path = this.resource + "/" + this.id + "." + this.format
	console.log("\nINFO parsing completed '"+this.url+"'")
	// TODO
	console.log("INFO path      = '"+this.path+"'")
	console.log("INFO resource  = '"+this.resource+"'")
	console.log("INFO id        = '"+this.id+"'")
	console.log("INFO format    = '"+this.format+"'")
	console.log("INFO params    = '"+this.params+"'")
	console.log("INFO content    = '"+this.content+"'")
}

module.exports.UrlParser=UrlParser
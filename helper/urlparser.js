"use strict"
// author: mr feiner and a bit elisabeth haberl

var UrlParser = function(request){
	this.req=request
	this.url=request.url;
	this.controller="static";
	this.content="text"
	this.path="";
	this.resource="";
	this.id=null;
	this.format="";
	this.params={}
	
	this.parse();
}

// TODO: make this stable, i.e. work with MISSING parts in the url :)

UrlParser.prototype.parse=function(){
	console.log("\n\n---------------------------------------------------------------")

	var parts = this.url.split('/');
	var fileandparam = parts.pop()
	var fileandparamlist, paramstr, fileWithSuffix, params, keyvals, k, v

	// set resource 
	if (parts.length > 2){
		this.resource = parts.join('/').substring(1)
	} else {
		this.resource = "public/content" // handles localhost/cooking.html etc.
	}

	// handle files and parameter
	if (fileandparam) {
		fileandparamlist = fileandparam.split("?")
		console.log("DEBUG: fileandparamlist=",fileandparamlist)
	
		if (fileandparamlist.length >1) { // char ? was given
			paramstr = fileandparamlist.pop() // => paramstr = 'lan=en&perpage=5'
			fileWithSuffix = fileandparamlist[0] || ""
		} else { // no ? given, i.e. no params => only one element in list
			paramstr=""
			fileWithSuffix=fileandparamlist.pop()
		}
		console.log("DEBUG: paramstr = ",paramstr)
		
		this.id     = fileWithSuffix.split(".")[0]
		this.format = fileWithSuffix.split(".")[1]
		// when format is not given
		if (this.format == "undefined" || this.format == null) {
			this.format = "html"
		}
	
		// extract key-value pairs of the parameters into the dict params={}
		params={}
		// for e.g. paramstr = 'lan=en&perpage=5'
		paramstr && paramstr.split("&").forEach( function(keyval){
			console.log("DEBUG: keyval=",keyval)
			keyvals = keyval.split("=")
			console.log("DEBUG: keyvals=",keyvals)
			k=keyvals[0]
			v=keyvals[1]
			console.log("DEBUG: params=",params)
			params[k]=v // inside a closure - cannot access this.params
		})
		this.params=params
	} else {
		console.log("No files and parameters given with url '"+this.url+"'")
		this.resource = "public"
		this.id       = "index"
		this.format   = "html"
	}

	// set type of content to image if it's not text (which is set in the beginning)
	if(	!(this.format=="html") && 
		!(this.format == "css") && 
		!(this.format == "js")){
		this.content = "image"
	}

	// handle index (because it's not in folder content)
	if (this.id == "index"){
		this.resource = "public"
	}

	// console output
	this.path = this.resource + "/" + this.id + "." + this.format // build path string
	console.log("\nINFO parsing completed '"+this.url+"'")
	console.log("INFO path      = '"+this.path+"'")
	console.log("INFO resource  = '"+this.resource+"'")
	console.log("INFO id        = '"+this.id+"'")
	console.log("INFO format    = '"+this.format+"'")
	console.log("INFO params    = '"+this.params+"'")
	console.log("INFO content    = '"+this.content+"'")
}

module.exports.UrlParser=UrlParser
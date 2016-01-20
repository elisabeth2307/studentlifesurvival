#!/usr/bin/env node
var request = require('superagent'), 
	assert = require('assert')
var config = require("../config.js")
var servPort = config.server+':'+config.serverPort
var recipeName = "ChickenUnitTest"
var recipeName2 = "Putenstreifensalat"
var htmlSite = 'cooking.html'
var dataInsert = "id="+recipeName+"&title="+recipeName+"&description="+recipeName+"&imgsrc=chicken.jpg"
var dataInsert2 = "id="+recipeName2+"&title="+recipeName2+"&description="+recipeName2+"&imgsrc=chicken.jpg"
var dataUpdate = "id="+recipeName+"&title="+recipeName+"&description=Modified"+recipeName+"&imgsrc=chicken.jpg"

// INSERT REQUEST -------------------------------------------------------------------------------------
var insert = request.post(servPort+'/'+htmlSite).send(dataInsert).end(function(err,response){
	if(err){
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text, "Insert task done!\n")
	}
})

// UPDATE REQUEST -------------------------------------------------------------------------------------
var update = request.put(servPort+'/'+recipeName).send(dataUpdate).end(function(err,response){
	if(err){
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text == "Update task done!\n")
	}
})

// INSERT REQUEST -------------------------------------------------------------------------------------
var insert = request.post(servPort+'/'+htmlSite).send(dataInsert2).end(function(err,response){
	if(err){
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text, "Insert task done!\n")
	}
})

// GET REQUEST -------------------------------------------------------------------------------------
var get = request.get(servPort).send().end(function(err,resp){
	if(err){
		console.log(err)
	} else {
		console.log("response-status: "+resp.status)

		// check
		assert.ok(200 == resp.status, "we expect status code of 200")
	}
})

// DELETE REQUEST -------------------------------------------------------------------------------------
var del = request.delete(servPort+'/'+recipeName2).send().end(function(err, response){
	if(err) {
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text == "Delete task of id \""+recipeName2+"\" done!\n")
	}
})

// DELETE REQUEST -------------------------------------------------------------------------------------
var del = request.delete(servPort+'/'+recipeName).send().end(function(err, response){
	if(err) {
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text == "Delete task of id \""+recipeName+"\" done!\n")
	}
})

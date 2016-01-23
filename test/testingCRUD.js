#!/usr/bin/env node
var request = require('superagent'), 
	assert = require('assert')
var config = require("../config.js")
var servPort = config.server+':'+config.serverPort
var recipeName = "ChickenUnitTest"
var recipeName2 = "Putenstreifensalat"
var dataInsert = "id="+recipeName+"&title="+recipeName+"&description="+recipeName+"&imgsrc=chicken.jpg"
var dataInsert2 = "id="+recipeName2+"&title="+recipeName2+"&description="+recipeName2+"&imgsrc=chicken.jpg"
var dataUpdate = "id="+recipeName+"&title="+recipeName+"&description=Modified"+recipeName+"&imgsrc=chicken.jpg"

// INSERT REQUEST -------------------------------------------------------------------------------------
var insert = request.post(servPort+'/public/content/recipes/'+recipeName+'.txt').send(dataInsert).end(function(err,response){
	if(err){
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text, "Insert task done!\n")
	}
})

// UPDATE REQUEST -------------------------------------------------------------------------------------
var update = request.put(servPort+'/public/content/recipes/'+recipeName+'.txt').send(dataUpdate).end(function(err,response){
	if(err){
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text == "Task was successful!")
	}
})

// INSERT REQUEST -------------------------------------------------------------------------------------
var insert = request.post(servPort+'/public/content/recipes/'+recipeName2+'.txt').send(dataInsert2).end(function(err,response){
	if(err){
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text, "Task was successful!")
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
var del = request.delete(servPort+'/public/content/recipes/'+recipeName2+'.txt').send().end(function(err, response){
	if(err) {
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text == "Recipe "+recipeName2+" deleted.")
	}
})

// DELETE REQUEST -------------------------------------------------------------------------------------
var del = request.delete(servPort+'/public/content/recipes/'+recipeName+'.txt').send().end(function(err, response){
	if(err) {
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text == "Recipe "+recipeName+" deleted.")
	}
})

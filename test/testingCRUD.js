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
		assert.ok(response.text == "Task was successful!", "Expected: Task was successful!")
	}
})

// this test causes problems because of asynchronus calls (update is sent before delete but delete is faster -> update sets
// recipe again after it's deleted)
// UPDATE REQUEST -------------------------------------------------------------------------------------
/*var update = request.put(servPort+'/public/content/recipes/'+recipeName+'.txt').send(dataUpdate).end(function(err,response){
	if(err){
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text == "Task was successful!", "Expected: Task was successful!")
	}
})*/

// INSERT REQUEST -------------------------------------------------------------------------------------
var insert = request.post(servPort+'/public/content/recipes/'+recipeName2+'.txt').send(dataInsert2).end(function(err,response){
	if(err){
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text, "Task was successful!", "Expected: Task was successful!")
	}
})

// GET REQUEST -------------------------------------------------------------------------------------
var get = request.get(servPort).send().end(function(err,resp){
	if(err){
		console.log(err)
	} else {
		console.log("response-status: "+resp.status)

		// check
		assert.ok(200 == resp.status, "Expected: Status-code 200")
	}
})

// GET REQUEST -------------------------------------------------------------------------------------
var get = request.get(servPort+"/cooking.html").send().end(function(err,resp){
	if(err){
		console.log(err)
	} else {
		console.log("response-status: "+resp.status)

		// check
		assert.ok(200 == resp.status, "Expected: Status-code 200")
	}
})

// GET REQUEST -------------------------------------------------------------------------------------
var get = request.get(servPort+"/public/content/recipe/"+recipeName+".txt").send().end(function(err,resp){
	if(err){
		console.log(err)
	} else {
		var result = JSON.parse(resp.text)
		console.log("response-id: "+result.id)

		// check
		assert.ok(recipeName == result.id, "Expected: response-id of recipe "+recipeName)
	}
})

// DELETE REQUEST -------------------------------------------------------------------------------------
var del = request.delete(servPort+'/public/content/recipes/'+recipeName2+'.txt').send().end(function(err, response){
	if(err) {
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text == "Recipe "+recipeName2+" deleted.", "Expected: Recipe "+recipeName2+" deleted.")
	}
})

// DELETE REQUEST -------------------------------------------------------------------------------------
var del = request.delete(servPort+'/public/content/recipes/'+recipeName+'.txt').send().end(function(err, response){
	if(err) {
		console.log(err)
	} else {
		console.log("Response-text: "+response.text)

		// check
		assert.ok(response.text == "Recipe "+recipeName+" deleted.", "Expected: Recipe "+recipeName2+" deleted.")
	}
})

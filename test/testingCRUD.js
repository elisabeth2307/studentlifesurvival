#!/usr/bin/env node

var request = require('superagent'), 
	assert = require('assert')


var r = request.get('localhost:8888').send().end(function(err,resp){
		if(err){
			console.log(err)
		} else {
			console.log(resp)
			console.log("response-status: "+resp.status)

			assert.ok(200 == resp.status, "we expect status code of 200")
		}
	})


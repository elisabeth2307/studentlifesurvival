// execution: "nodeunit unitTestingCRUD.js"

// set "global" user - just once (because of login)
var requestSuperagent = require('superagent');
var testuser = requestSuperagent.agent()

module.exports = {
	setUp: function(callback) {
		console.log("-------------------------------------")
		console.log("SetUp");
		// to get server and port
		var config = require("../config.js")

		// global variables
		this.recipeName = "TurkeyUnitTest"
		this.servPort = config.server+":"+config.serverPort
		this.url = this.servPort+"/cooking.html"

		callback();
	},
	testLogin: function(test){
		// login data (just for testing)
		var data = "id=eli&password=geheim"

		// send post-request
		testuser.post(this.servPort+"/public/content/registration.html").send(data).end(function(err,response){
			if (err) {
				console.log(err)
			} else {
				test.equals(response.status, "200")
				test.done()
			}
		});
	},
	testGet: function(test) {

		// send a get request to cooking.html for checking if the test-recipe doesn't exists
		testuser.get(this.url).send().end(function(err,response){
			if(err){
				console.log(err)
			} else {
				// get html data of cooking.html
				var htmlContent = response.text.toString('UTF-8')

				// console output
				console.log("Response-status: "+response.status)
				console.log("Index of "+this.recipeName+": "+htmlContent.indexOf(this.recipeName))

				// controll if html content contains name of test-recipe -> shall be -1 (not there)
				test.equals(htmlContent.indexOf(this.recipeName), -1)
				test.equals(response.status, "200")
				test.done()
			}
		})
	},
	testInsert: function(test) {
		// string for post data
		var data = "id="+this.recipeName+"&title="+this.recipeName+"&description="+this.recipeName+"&imgsrc=chicken.jpg"

		// send a post request for inserting a new recipe
		testuser.post(this.servPort+"/public/content/recipes/"+this.recipeName+".txt").send(data).end(function(err,response){
			if(err){
				console.log(err)
			} else {
				// console output
				console.log("Response text: "+response.text)
				console.log("Response-status: "+response.status)

				// controll text
				test.equals(response.text, "Task was successful!")
				test.done()
			}
		})
	},
	testUpdate: function(test) {
		var dataUpdate = "id="+this.recipeName+"&title="+this.recipeName+"&description=Modified"+this.recipeName+"&imgsrc=chicken.jpg"
		var searchString = "Modified"+this.recipeName

		// send update request
		testuser.put(this.servPort+"/public/content/recipes/"+this.recipeName+".txt").send(dataUpdate).end(function(error, resp){
			if (error){
				console.log(error)
			} else {
				// console output and test the response-text
				console.log(resp.text)
				test.equals("Task was successful!", resp.text)
				test.done()
			}
		})
	},
	testdelete: function(test) {
		var recipeName = this.recipeName

		// send delete request
		testuser.delete(this.servPort+"/public/content/recipes/"+recipeName+".txt").send().end(function(err, response){
			if (err) {
				console.log(err)
			} else {
				console.log(response.text)

				// test
				test.equals("Recipe "+recipeName+" deleted.", response.text)
				test.done()
			}
		})
	}
}

// execution: "nodeunit unitTestingCRUD.js"
// we were not sure if it is a good idea to deal with the database here so we have used only requests
module.exports = {
	setUp: function(callback) {
		console.log("-------------------------------------")
		console.log("SetUp");
		// to get server and port
		var config = require("../config.js")

		// global variables
		this.request = require('superagent')
		this.recipeName = "TurkeyUnitTest"
		this.servPort = config.server+":"+config.serverPort
		this.url = this.servPort+"/cooking.html"

		callback();
	},
	testGet: function(test) {
		var recipeName = this.recipeName

		// send a get request to cooking.html for checking if the test-recipe doesn't exists
		this.request.get(this.url).send().end(function(err,response){
			if(err){
				console.log(err)
			} else {
				// get html data of cooking.html
				var htmlContent = response.text.toString('UTF-8')

				// console output
				console.log("Response-status: "+response.status)
				console.log("Index of "+recipeName+": "+htmlContent.indexOf(recipeName))

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
		// needed because of Verschachtelung -> Javascript scope ist gemein zu mir
		var request = this.request
		var url = this.url
		var recipeName = this.recipeName

		// send a post request for inserting a new recipe
		request.post(url).send(data).end(function(err,response){
			if(err){
				console.log(err)
			} else {
				// console output
				console.log("Request text: "+response.text)
				console.log("Response-status: "+response.status)

				// controll text
				test.equals(response.text, "Insert task done!\n")

				// call cooking.html for making sure it is really on the website
				request.get(url).send().end(function(err, response){
					if (err) {
						console.log(err)
					} else {
						var htmlContent = response.text.toString('UTF-8')

						// console output
						console.log("Index of "+recipeName+": "+htmlContent.indexOf(recipeName))

						// the recipe should be on the website, the index is something else than -1 (-1 = not found)
						test.notEqual(htmlContent.indexOf(recipeName), -1)
						test.done()
					}
				})
			}
		})
	},
	testUpdate: function(test) {
		var dataUpdate = "id="+this.recipeName+"&title="+this.recipeName+"&description=Modified"+this.recipeName+"&imgsrc=chicken.jpg"
		var searchString = "Modified"+this.recipeName
		var request = this.request
		var url = this.url
		var recipeName = this.recipeName

		// send update request
		request.put(this.servPort+"/"+recipeName+"").send(dataUpdate).end(function(error, resp){
			if (error){
				console.log(error)
			} else {
				// console output and test the response-text
				console.log(resp.text)
				test.equals("Update task done!\n", resp.text)

				// retrieve data again to be sure is has been updated
				request.get(url).send().end(function(errorGet, responseGet){
					if (errorGet) {
						console.log(errorGet)
					} else {
						// get html data of cooking.html
						var htmlContent = responseGet.text.toString('UTF-8')

						// console output
						console.log("Response-status: "+responseGet.status)
						console.log("Index of "+searchString+": "+htmlContent.indexOf(searchString))

						// the searchpattern shall be found (something else than -1)
						test.notEqual(htmlContent.indexOf(searchString), -1)
						test.done()
					}
				})
			}
		})
	},
	testdelete: function(test) {
		var recipeName = this.recipeName

		// send delete request
		this.request.delete(this.servPort+"/"+recipeName).send().end(function(err, response){
			if (err) {
				console.log(err)
			} else {
				console.log(response.text)

				// test
				test.equals("Delete task of id \""+recipeName+"\" done!\n", response.text)
				test.done()
			}
		})
	}
}

filling = function(){
	var fs = require('fs')
	var config = require('../config.js')
	var redis = require("redis")
	var db = redis.createClient(config.redisPort,config.server)
	var filename = "./data/recipes.db"

	// database access is asynchronus -> interlaced construction needed for sequential flow
	db.dbsize(function(err, data){
		if(err){
			console.log("ERROR: not able to get database size")
		} else {
			// database is empty
			if (data == 0){ 
				console.log("INFO: filling database with initial-data")

				// read data file
				fs.readFile(filename,function(err, data){
					if (err){
						console.log("ERROR: unable to read initial-data file: ",err)
					}else{
						var recStr = data.toString('UTF-8')
						var recipes = JSON.parse(recStr)
						var count = Object.keys(recipes).length

						console.log("DEBUG read recipes data from file: " + filename)
						console.log("DEBUG amount of entries " + count)
						// insert into database
						for(var i = 1; i <= count; i++){
							db.set(i, JSON.stringify(recipes[i]))
						}
					}
				})
			}
		}
	})
}

module.exports.filling = filling
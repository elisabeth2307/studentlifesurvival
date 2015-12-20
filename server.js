#!/usr/bin/env node

var config = require('./config.js')

config.serverPort = (process.argv.length > 2) ? process.argv[2] : config.serverPort // if port -> argument

console.log("Server starting on Port " + config.serverPort + " on " + config.server)
console.log("Studentlife Survival")
console.log("Version: " + config.version)
console.log("Author: " + config.author)

var databasecheck = require('./helper/initialDataFilling.js')
databasecheck.filling() // note that it's asynchronus -> console output might appear later

var theapp = require('./controller/master.js')
theapp.startup()

console.log("Server running on Port " + config.serverPort + " on " + config.server)

#!/usr/bin/env node

var config = require('./config.js')

config.port = (process.argv.length > 2) ? process.argv[2] : config.port

console.log("Server starting on Port " + config.port + " on " + config.server)
console.log("Studentlife Survival")
console.log("Version: " + config.version)
console.log("Author: " + config.author)

var theapp = require('./controller/master.js')
theapp.startup()

console.log("Server running on Port " + config.port + " on " + config.server)

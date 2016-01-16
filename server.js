#!/usr/bin/env node

var config = require('./config.js')

config.serverPort = (process.argv.length > 2) ? process.argv[2] : config.serverPort // if port -> argument

console.log("Server starting on Port " + config.serverPort + " on " + config.server)
console.log("Studentlife Survival")
console.log("Version: " + config.version)
console.log("Author: " + config.author)

// do inital filling of recipes
var RecipeManager = require('./model/recipe_mgmt.js')
var recipeManager = new RecipeManager(null, null, null)
recipeManager.filling() // note that it's asynchronus -> console output might appear later

// do initial filling of users
var RegistrationManager = require('./model/registration_mgmt.js')
var regisManager = new RegistrationManager(null, null, null)
regisManager.filling()

// start server
var theapp = require('./controller/master.js')
theapp.startup()

console.log("Server running on Port " + config.serverPort + " on " + config.server)

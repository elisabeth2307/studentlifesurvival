var nodemailer = require('nodemailer')
var config = require('../config.js')

var Mailer = function(){

	this.transporter = nodemailer.createTransport(
	{
		host: 'mail.fh-joanneum.at',
		port: 25,
	})
}

Mailer.prototype.sendMail = function(name, email, token){
	console.log("SENDING MAIL to " + email)
	this.transporter.sendMail({
		from: 'studentlifesurvival@fh-joanneum.at',
		to: email,
		subject: 'Registration',
		text: 'Dear '+name+',\n\nWelcome to StudentlifeSurvival!\n\nPlease confirm your email adress: http://'+config.server+':'+config.serverPort+'?id='+name+'&token='+token,

	}, function(err, info) {
		if (!err) 
			console.log("[INFO] msg id ", info.messageId)
		else
			console.log(err)
	})
}

module.exports = Mailer
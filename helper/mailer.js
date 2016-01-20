var nodemailer = require('nodemailer')
var config = require('../config.js')

var Mailer = function(){

	this.transporter = nodemailer.createTransport(
	{
		host: 'mail.fh-joanneum.at',
		port: 25,
	})
}

Mailer.prototype.sendMail = function(email, token){
	email = 'tabea.halmschlager@edu.fh-joanneum.at'
	console.log("SENDING MAIL to " + email)
	this.transporter.sendMail({
		from: 'studentlifesurvival@fh-joanneum.at',
		to: email,
		subject: 'registration',
		text: 'Please confirm your email adress: http://'+config.server+':'+config.serverPort+'?token='+token,

	}, function(err, info) {
		if (!err) 
			console.log("[INFO] msg id ", info.messageId)
		else
			console.log(err)
	})
}

module.exports = Mailer
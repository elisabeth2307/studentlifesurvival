var nodemailer = require('nodemailer')

var Mailer = function(){

	this.transporter = nodemailer.createTransport(
	{
		host: 'mail.fh-joanneum.at',
		port: 25,
	})
}

Mailer.prototype.sendMail = function(email, token){

	console.log("SENDING MAIL")
	this.transporter.sendMail({
		from: 'studentlifesurvival@fh-joanneum.at',
		to: this.adress,
		subject: 'registration',
		text: 'Please confirm your email adress:'+this.token,

	}, function(err, info) {
		if (!err) 
			console.log("[INFO] msg id ", info.messageId)
		else
			console.log(err)
	})
}

module.exports = Mailer
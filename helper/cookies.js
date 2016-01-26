
function Cookie(name, v){
	this.name = name
	this.value = v
	
	var expireOn = new Date()
	expireOn.setDate(expireOn.getDate()+1) //in one day

	this.expires = expireOn.toUTCString()
}

Cookie.prototype.toString = function(){
	var result = this.name + " = " + this.value
	
	if(this.expires)
		result += "; expires=" + this.expires

	return result
}

module.exports = Cookie
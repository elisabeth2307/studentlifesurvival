function handleRegis(){
	// fetch variables for post-request
	var id = document.getElementById("idRegister").value
	var email = document.getElementById("emailRegister").value
	var password = document.getElementById("passwordRegister").value
	var data = "id="+id+"&email="+email+"&password="+password+""

    console.log("handling Registration")

	// if id and description are empty no ajax-request is sent!
	if(id == "" || email == "" || password == ""){
		document.getElementById("statustext2").innerHTML = "<b>All fields need to be filled in!</b>"
	}
	
	// everything ok -> send AJAX call
	else {
		// create AJAX-object and specify method, url and true (asynchronous)
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "/public/content/registration.html", true);

		// define function which is called when ready state changes
		xhttp.onreadystatechange = function() {
			// disable button when clicked
			document.getElementById("regisbutton").disabled = true;
			
			// if response data has arrived and status is ok
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				// insert response-text
	    		document.getElementById("regisHeadline").innerHTML = xhttp.responseText;
	    		// delete form-content and infotext
	    		document.getElementById("register").innerHTML = ""; 
	    		document.getElementById("statustext2").innerHTML = ""; 
	    		document.getElementById("infotext2").innerHTML = ""; 
	  		}
	  	}

	  	// send request
		xhttp.send(data);
	}
}



function handleLogin(){
	// fetch variables for post-request
	var id = document.getElementById("idLogin").value
	var password = document.getElementById("passwordLogin").value
	var data = "id="+id+"&password="+password+""

    console.log("handling Login")

	// if id and description are empty no ajax-request is sent!
	if(id == "" || password == ""){
		document.getElementById("statustext3").innerHTML = "<b>All fields need to be filled in!</b>"
	}
	
	// everything ok -> send AJAX call
	else {
		// create AJAX-object and specify method, url and true (asynchronous)
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "/public/content/registration.html", true);

		// define function which is called when ready state changes
		xhttp.onreadystatechange = function() {
			// disable button when clicked
			document.getElementById("regisbutton").disabled = true;
			
			// if response data has arrived and status is ok
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				// insert response-text
	    		document.getElementById("regisHeadline").innerHTML = xhttp.responseText;
	    		// delete form-content and infotext
	    		document.getElementById("register").innerHTML = ""; 
	    		document.getElementById("statustext3").innerHTML = ""; 
	  		}
	  	}

	  	// send request
		xhttp.send(data);
	}
}

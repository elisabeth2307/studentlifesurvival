function handleInput(){
	// fetch variables for post-request
	var id = document.getElementById("inputTitle").value
	var description = document.getElementById("inputDescription").value
	var imgsrc = document.getElementById("inputImgsrc").value
	var data = "id="+id+"&title="+id+"&description="+description+"&imgsrc="+imgsrc+""

	// if id and description are empty no ajax-request is sent!
	if(id == "" || description == ""){
		document.getElementById("statustext").innerHTML = "<b>Fields title and description are mandatory fields!</b>"
	} else {
		// create AJAX-object and specify method, url and true (asynchronus)
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "/public/content/recipes/"+id+".txt", true);

		// define function which is called when ready state changes
		xhttp.onreadystatechange = function() {
			// disable button when clicked
			document.getElementById("inputbutton").disabled = true;
			
			// if response data has arrived and status is ok
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				// insert response-text
	    		document.getElementById("insertHeadline").innerHTML = xhttp.responseText + "\nThank you for your support!";
	    		// delete form-content and infotext
	    		document.getElementById("inputform").innerHTML = ""; 
	    		document.getElementById("statustext").innerHTML = ""; 
	    		document.getElementById("infotext").innerHTML = ""; 
	  		}
	  	}

	  	// send request
		xhttp.send(data);
	}
}

function handleUpdate(){
	// fetch necessary data
	var url = window.location.href
	var id = url.substring(url.search("id=")+3)
	var description = document.getElementById("updateDescription").value
	var imgsrc = document.getElementById("updateImgsrc").value
	var data = "id="+id+"&title="+id+"&description="+description+"&imgsrc="+imgsrc+""

	// if description is empty no ajax-request is sent!
	if(description == ""){
		document.getElementById("statustext").innerHTML = "<b>Please insert a description!</b>"
	} else {
		// create AJAX-object and specify method, url and true (asynchronus)
		var xhttp = new XMLHttpRequest();
		xhttp.open("PUT", "/public/content/recipes/"+id+".txt", true);

		// define function which is called when ready state changes
		xhttp.onreadystatechange = function() {
			// disable button when clicked
			document.getElementById("updateButton").disabled = true;

			// if response data has arrived and status is ok
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				// insert response-text
	    		document.getElementById("updateHeadline").innerHTML = xhttp.responseText + "\nThank you for your support!";
	    		// delete form-content and infotext
	    		document.getElementById("inputform").innerHTML = ""; 
	    		document.getElementById("statustext").innerHTML = ""; 
			}
		}

		// send request
		xhttp.send(data);
	}
}

function handleDelete(){
	// fetch necessary data
	var url = window.location.href
	var id = url.substring(url.search("id=")+3)

	// create AJAX-object and specify method, url and true (asynchronus)
	var xhttp = new XMLHttpRequest();
	xhttp.open("DELETE", "/public/content/recipes/"+id+".txt", true);

	// define function which is called when ready state changes
	xhttp.onreadystatechange = function() {
		// disable button when clicked
		document.getElementById("deleteButton").disabled = true;

		// if response data has arrived and status is ok
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			// insert response-text
			document.getElementById("deleteText").innerHTML = ""; 
    		document.getElementById("deleteHeadline").innerHTML = xhttp.responseText;
		}
	}

	// send request
	xhttp.send()
}

function loadDescription(){
	// fetch necessary data
	var url = window.location.href
	var id = url.substring(url.search("id=")+3)

	// create AJAX-object and specify method, url and true (asynchronus)
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "/public/content/recipe/"+id+".txt", true);

	// define function which is called when ready state changes
	xhttp.onreadystatechange = function() {
		// if response data has arrived and status is ok
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			// parse response text to ajax
			var result = JSON.parse(xhttp.responseText)

			// set fetched description from json-object
			document.getElementById("updateDescription").value = result.description
		}
	}

	// send request
	xhttp.send();
}
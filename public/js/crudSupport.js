function handleInput(){
	// fetch variables for post-request
	var id = document.getElementById("inputTitle").value
	var description = document.getElementById("inputDescription").value
	var imgsrc = document.getElementById("inputImgsrc").value
	var data = "id="+id+"&title="+id+"&description="+description+"&imgsrc="+imgsrc+""

	// AJAX-object
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "cooking.html", true);

	xhttp.onreadystatechange = function() {
		// disable button when clicked
		document.getElementById("inputbutton").disabled = true;
		
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			// insert response-text
    		document.getElementById("statustext").innerHTML = xhttp.responseText + "\nThank you for your support!";
    		// delete form-content and infotext
    		document.getElementById("inputform").innerHTML = ""; 
    		document.getElementById("infotext").innerHTML = ""; 
  		}
  	}

	//xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(data);
}

function handleUpdate(){
	var url = window.location.href
	var id = url.substring(url.search("id=")+3)

	var description = document.getElementById("updateDescription").value
	var imgsrc = document.getElementById("updateImgsrc").value
	var xhttp = new XMLHttpRequest();
	var data = "id="+id+"&title="+id+"&description="+description+"&imgsrc="+imgsrc+""

	xhttp.open("PUT", ""+id+".html", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(data);
}

function handleDelete(id){
	var xhttp = new XMLHttpRequest();
	xhttp.open("DELETE", ""+id+".html", true);
	xhttp.send()
}

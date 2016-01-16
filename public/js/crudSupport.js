function handleInput(){
	var id = document.getElementById("inputTitle").value
	var description = document.getElementById("inputDescription").value
	var imgsrc = document.getElementById("inputImgsrc").value
	var xhttp = new XMLHttpRequest();
	var data = "id="+id+"&title="+id+"&description="+description+"&imgsrc="+imgsrc+""

	xhttp.open("POST", "cooking.html", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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

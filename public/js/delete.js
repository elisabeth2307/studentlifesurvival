delete(var id) {
	alert("in del")
	$.ajax({
    type: "DELETE",
    url: "index.html",
    data: "id="+id"",
    success: function(msg){
        alert("Data Deleted: " + msg);
    }
});
}
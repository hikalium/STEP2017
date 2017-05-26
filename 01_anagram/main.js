
var a = 0;
if(1){
	var chars = "";
	var rows = document.body.children[1].children[0].children[0].childNodes[0].children[0].children[0].children;
	for(var y = 0; y < 4; y++){
		var row = rows[y].children;
		for(var x = 0; x < 4; x++){
			chars += row[x].children[0].innerText;
		}
	}
	console.log(chars);
}

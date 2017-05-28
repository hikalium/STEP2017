
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	document.getElementById("MoveField").value = request.chars;
});

var a = 0;
try{
	var chars = "";
	var rows = document.body.children[1].children[0].children[0].childNodes[0].children[0].children[0].children;
	for(var y = 0; y < 4; y++){
		var row = rows[y].children;
		for(var x = 0; x < 4; x++){
			chars += row[x].children[0].innerText;
		}
	}
	console.log(chars);
	chrome.runtime.sendMessage({type: "chars", chars: chars});
} catch(e){
	console.log("error: " + e)
}

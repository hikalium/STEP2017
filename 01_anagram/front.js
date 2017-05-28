var cons = console;
document.getElementById("sendWordBtn").onclick = function(){
	chrome.runtime.sendMessage({
		type: "word", 
		chars: document.getElementById("wordInput").value
	});
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	document.getElementById("charsInput").value = request.chars;
	document.getElementById("getWordBtn").click();
	chrome.runtime.sendMessage({type: "word", chars: "test"});
});
console.log("loaded!");

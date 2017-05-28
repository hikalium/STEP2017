(function(){
	chrome.tabs.onUpdated.addListener(function(tabID, info, tab) {
		if(info.status !== "complete") return;
		if(~tab.url.indexOf("icanhazwordz")) {
			chrome.tabs.executeScript(tabID, {file: "main.js"});
		}
		if(~tab.title.indexOf("i can hack wordz")) {
			chrome.tabs.executeScript(tabID, {file: "front.js"});
		}
	});
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if(request.type === "chars"){
			chrome.tabs.query({title: "i can hack wordz"}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, request);
			});
		} else if(request.type === "word"){
			chrome.tabs.query({url: "*://icanhazwordz.appspot.com/*"}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, request);
			});
		}
	});
})();

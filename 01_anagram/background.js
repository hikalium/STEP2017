(function(){
	var flg = 1;
	chrome.tabs.onUpdated.addListener(function(tabID, info, tab) {
		if (info.status == "complete" && ~tab.url.indexOf("icanhazwordz")) {
			flg = 0;
			chrome.tabs.executeScript(tabID, {file: "main.js"});
		}
	});
})();

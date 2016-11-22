//Corey Walo - November 2016

var url = "http://www.fakeout-extension.com/blacklist.json";
var blacklist = [];
var lastMatchedSite = "";

function fetchBlacklistAndNotify() {		
	//check to see if we can even present a notification
    if(!window.Notification) {
		return;
    }
	
	if (blacklist.length > 0) {
		notify();
	} else {
		jQuery.getJSON(url, function(json) {
			blacklist = json;
			notify();
		});
	}
}

function notify() {
	var activeTab = safari.application.activeBrowserWindow.activeTab;
	var currentURL = activeTab.url;
	
	if (currentURL === undefined) { return; }

	var matchURL = "";
	
	//try to match on the site's url
	for (var i = 0; i < blacklist.length; i++) {
		if (currentURL.includes(blacklist[i])) { 
			matchURL = blacklist[i];
			break;
		}
	}
	
	//in cases where the document is reloaded or the body is modified, onload can get called multiple times
	//so we store the last matched site and return if we've already shown a notification for it
	if (lastMatchedSite === matchURL) { return; }
	
	if (matchURL != "") {				
		var options = {
			body: "This site is known to provide false or misleading information. Do your own due diligence!",
			tag: "com.coreywalo.fakeout"
		};
		
		var n = new Notification("Warning for " + matchURL, options);
		lastMatchedSite = matchURL;
	}
}

safari.application.addEventListener("navigate", fetchBlacklistAndNotify, true);

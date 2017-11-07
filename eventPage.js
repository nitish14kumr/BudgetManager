var contextMenuItem = {
	"id": "spendMoney",
	"title": "Spend Money",
	"contexts": ["selection"]
};
chrome.contextMenus.create(contextMenuItem);


function isInt (value) {
	return !isNaN(value) && parseInt(Number(value)) == 
			value && !isNaN(parseInt(value,10));
}


chrome.contextMenus.onClicked.addListener(function(clickData){
	if(clickData.menuItemId == "spendMoney" && clickData.selectionText){
		if(isInt(clickData.selectionText)){
			chrome.storage.sync.get(['total','limit'], function(budget){
				var newTotal = parseInt(clickData.selectionText);
				if(budget.total)
					newTotal += parseInt(budget.total);
				chrome.storage.sync.set({'total': newTotal}, function(){
					if (newTotal >= budget.limit) {
						var notif = {
							type: 'basic',
							iconUrl: 'icon48.png',
							title: 'Limit Reached!',
							message: 'Uh oh! Looks like you\'ve reached your limit!'
						};
						chrome.notifications.create('limitNotif', notif);
					}
					else {
						var notif = {
							type: 'basic',
							iconUrl: 'icon48.png',
							title: 'Added Money!',
							message: "Amount has been added to your spend money!"
						};
						chrome.notifications.create('addNotif', notif);
					}
				});
			});
		}
		else {
			var notif = {
				type: 'basic',
				iconUrl: 'icon48.png',
				title: 'Invalid Selection!',
				message: "Selected text isn't a number!"
			};
			chrome.notifications.create('errorNotif', notif);
		}
	}
});

chrome.storage.onChanged.addListener(function (changes, storageName) {
	chrome.browserAction.setBadgeText({"text": changes.total.newValue.toString()});
	chrome.storage.sync.get(['total', 'limit'], function(budget){
		if (budget.total >= budget.limit) {
			chrome.browserAction.setBadgeBackgroundColor({color:'red'});
		}
		else
			chrome.browserAction.setBadgeBackgroundColor({color:'green'});
	});
});
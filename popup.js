$(function() {

	chrome.storage.sync.get(['total','limit'],function(budget){
		$('#total').text(budget.total);
		$('#limit').text(budget.limit);
		if(budget.total > budget.limit){
			$('#info').text('*Limit Exceeded!');
		}
	});


	$('#clear').click(function() {
		chrome.storage.sync.set({'total': 0});
		$('#total').text(0);
		$('#info').text('');
	});

	$('#spendAmount').click(function() {
		chrome.storage.sync.get(['total','limit'],function(budget){
				var newTotal = 0;
				if(budget.total){
					newTotal += parseInt(budget.total);
				}

				var amount = $('#amount').val();
				if(amount){
					newTotal += parseInt(amount);
				}

				chrome.storage.sync.set({'total': newTotal});
				$('#total').text(newTotal);
				if(newTotal == budget.limit){
					$('#info').text('*Limit Reached!');
					var notifOptions = {
						type: 'basic',
						iconUrl: 'icon48.png',
						title: 'Limit reached!',
						message: "Uh oh! Look like you've reached your limit!"
					};
					chrome.notifications.create('limitNotif', notifOptions);
				}
				if(newTotal > budget.limit){
					$('#info').text('*Limit Exceeded!');
				}
				$('#amount').val('');
		});
	});
});
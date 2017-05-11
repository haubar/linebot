const linebot = require('./index.js');

const bot = linebot({
	channelId: process.env.channelId,
	channelAccessToken: process.env.accessToken,
    channelSecret: process.env.channelSecret,
	verify: true // default=true
});

 const eat_options = {
						method: 'GET',
						uri: 'https://api.imgur.com/3/album/${album_id}/images',
						headers: {
						"Authorization": 'Client-ID '+process.env.client_id
						},
						json: true
					};

function getImage(eat_options, album_id){
   rp(eat_options).then(function (response){
		var imagurs = []
		response.data.forEach(function(items){
			imagurs.push(items.link)
		})
		return imagurs[Math.floor(Math.random()*imagurs.length)]
	})
}


bot.on('message', function (event) {
	switch (event.message.type) {
		case 'text':
			switch (event.message.text) {
				case '給我id':
					event.source.profile().then(function (profile) {
						return event.reply('嗨 ' + profile.displayName + ' 你要幹嘛!! ' + profile.userId);
					});
					break;
				case 'picture':
					event.reply({
						type: 'image',
						originalContentUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png',
						previewImageUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png'
					});
					break;
				case '早餐':
					event.reply({
						type: 'image',
						originalContentUrl: getImage(eat_options, '6YSY1'),
						previewImageUrl: getImage(eat_options, '6YSY1')
					});
					break;
				case '午餐':
					event.reply({
						type: 'image',
						originalContentUrl: getImage(eat_options, 'D4BDl'),
						previewImageUrl: getImage(eat_options, 'D4BDl')
					});
					break;
				case '晚餐':
					event.reply({
						type: 'image',
						originalContentUrl: getImage(eat_options, 'zXNwB'),
						previewImageUrl: getImage(eat_options, 'zXNwB')
					});
					break;	
				case 'location':
					event.reply({
						type: 'location',
						title: 'LINE Plus Corporation',
						address: '1 Empire tower, Sathorn, Bangkok 10120, Thailand',
						latitude: 13.7202068,
						longitude: 100.5298698
					});
					break;
				// case 'push':
				// 	bot.push('U6350b7606935db981705282747c82ee1', ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);
				// 	break;
				// case 'push2':
				// 	bot.push(['U6350b7606935db981705282747c82ee1', 'U6350b7606935db981705282747c82ee1'], ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);
				// 	break;
				// case 'multicast':
				// 	bot.push(['U6350b7606935db981705282747c82ee1', 'U6350b7606935db981705282747c82ee1'], 'Multicast!');
				// 	break;
				case 'confirm':
					event.reply({
						type: 'template',
						altText: 'this is a confirm template',
						template: {
							type: 'confirm',
							text: 'Are you sure?',
							actions: [{
								type: 'message',
								label: 'Yes',
								text: 'yes'
							}, {
								type: 'message',
								label: 'No',
								text: 'no'
							}]
						}
					});
					break;
				case 'mult':
					event.reply(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']);
					break;
				// case 'version':
				// 	event.reply('linebot@' + require('../package.json').version);
				// 	break;
				default:
					event.reply(event.message.text).then(function (data) {
						console.log('Success', data);
					}).catch(function (error) {
						console.log('Error', error);
					});
					break;
			}
			break;
		case 'image':
			event.message.content().then(function (data) {
				const s = data.toString('base64').substring(0, 30);
				return event.reply('Nice picture! ' + s);
			}).catch(function (err) {
				return event.reply(err.toString());
			});
			break;
		case 'video':
			event.reply('Nice movie!');
			break;
		case 'audio':
			event.reply('Nice song!');
			break;
		case 'location':
			event.reply(['That\'s a good location!', 'Lat:' + event.message.latitude, 'Long:' + event.message.longitude]);
			break;
		case 'sticker':
			event.reply({
				type: 'sticker',
				packageId: 1,
				stickerId: 1
			});
			break;
		default:
			event.reply('Unknow message: ' + JSON.stringify(event));
			break;
	}
});

bot.on('follow', function (event) {
	event.reply('follow: ' + event.source.userId);
});

bot.on('unfollow', function (event) {
	event.reply('unfollow: ' + event.source.userId);
});

bot.on('join', function (event) {
	event.reply('join: ' + event.source.groupId);
});

bot.on('leave', function (event) {
	event.reply('leave: ' + event.source.groupId);
});

bot.on('postback', function (event) {
	event.reply('postback: ' + event.postback.data);
});

bot.on('beacon', function (event) {
	event.reply('beacon: ' + event.beacon.hwid);
});

bot.listen('/webhook', process.env.PORT || 3333, () => {
  console.log('Example app listening on port 3333!')
})
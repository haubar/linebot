const linebot = require('./index.js');
const rp = require('request-promise');

const bot = linebot({
    channelId: process.env.channelId,
    channelAccessToken: process.env.accessToken,
    channelSecret: process.env.channelSecret,
    verify: true // default=true
});

const Data_ig = function (data) {
    this.max_image = data.thumbnail_src
    this.mini_image = data.thumbnail_resources[1]
}


function getImage(eat_options, event) {
    rp(eat_options).then(function(response) {
        var imagurs = []
        response.data.forEach(function(items) {
            imagurs.push(items.link)
        })
        var url_image = imagurs[Math.floor(Math.random() * imagurs.length)]
        return event.reply({
            type: 'image',
            originalContentUrl: url_image,
            previewImageUrl: url_image
        });

    })
}

function getigImage(ig_options, event) {
    rp(ig_options).then(function(response) {
        var ig_image = []
        // return event.reply('74894984') 
        // response.data.graphgl.hashtag.edge_hashtag_to_top_posts.edges.node[Math.floor(Math.random() * 9)].forEach(function(items) {
        response.graphgl.hashtag.edge_hashtag_to_top_posts.edges.forEach(function(items) {
            // ig_image.concat(items.node)
            let item = new Data_ig(items.node)
            list.push(item)
        })
        return event.reply('74894984') 
        var random_val = [Math.floor(Math.random() * ig_image.length)]
        var url_image_m = ig_image[random_val].thumbnail_src
        var url_image_s = ig_image[random_val].thumbnail_resources[1].src
        // return event.reply(['url_image_m'])
        return event.reply('74894984') 
        return event.reply([random_val]) 
        return event.reply({
            type: 'image',
            originalContentUrl: url_image_m,
            previewImageUrl: url_image_s
        });

    })
}


bot.on('message', function(event) {
    switch (event.message.type) {
        case 'text':
            switch (event.message.text) {
                case '給我id':
                    event.source.profile().then(function(profile) {
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
                    var eat_options = {
                        method: 'GET',
                        uri: 'https://api.imgur.com/3/album/6YSY1/images',
                        headers: {
                            "Authorization": 'Client-ID ' + process.env.client_id
                        },
                        json: true
                    };
                    var breakfast_img = getImage(eat_options, event);
                    break;
                case '午餐':
                    var eat_options = {
                        method: 'GET',
                        uri: 'https://api.imgur.com/3/album/D4BDl/images',
                        headers: {
                            "Authorization": 'Client-ID ' + process.env.client_id
                        },
                        json: true
                    };
                    var lunch_img = getImage(eat_options, event);
                    break;
                case '晚餐':
                    var eat_options = {
                        method: 'GET',
                        uri: 'https://api.imgur.com/3/album/zXNwB/images',
                        headers: {
                            "Authorization": 'Client-ID ' + process.env.client_id
                        },
                        json: true
                    };
                    var dinner_img = getImage(eat_options, event)

                    break;
                case '測試圖':
                    var eat_options = {
                        method: 'GET',
                        uri: 'https://api.imgur.com/3/album/zXNwB/images',
                        headers: {
                            "Authorization": 'Client-ID ' + process.env.client_id
                        },
                        json: true
                    };
                    var test_img = getImage(eat_options, event)

                    break;
                case 'location':
                    event.reply({
                        type: 'location',
                        title: 'LINE Plus Corporation',
                        address: '別問我你在哪~~~',
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
                case '指令':
                    event.reply(['早餐', '午餐', '晚餐', '測試圖']);
                    // event.reply(['!picture', '!早餐', '!午餐', '!晚餐', '!測試圖', '!location', '!confirm', '!mult']);
                    break;
                    // case 'version':
                    // 	event.reply('linebot@' + require('../package.json').version);
                    // 	break;
                    // case '指令':
                    //     event.reply(['picture', '早餐', '午餐', '晚餐', '測試圖', 'location', 'confirm', 'mult']);
                    //     break;
                    // case 'version':
                    // 	event.reply('linebot@' + require('../package.json').version);
                    // 	break;
                default:
                    var encode_tag = encodeURIComponent(event.message.text) 
                    var ig_options = {
                        uri: 'https://www.instagram.com/explore/tags/'+ encode_tag +'?__a=1',
                        json: true
                    };
                    var get_ig_image = getigImage(ig_options, event);
                    // event.reply([encode_tag]);
                    // event.reply(breakfast_img).then(function (data) {
                    // 	console.log('Success', data);
                    // }).catch(function (error) {
                    // 	console.log('Error', error);
                    // });
                    break;
            }
            break;
        case 'image':
            event.message.content().then(function(data) {
                const s = data.toString('base64').substring(0, 30);
                return event.reply('Nice picture! ' + s);
            }).catch(function(err) {
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

bot.on('follow', function(event) {
    event.reply('follow: ' + event.source.userId);
});

bot.on('unfollow', function(event) {
    event.reply('unfollow: ' + event.source.userId);
});

bot.on('join', function(event) {
    event.reply('join: ' + event.source.groupId);
});

bot.on('leave', function(event) {
    event.reply('leave: ' + event.source.groupId);
});

bot.on('postback', function(event) {
    event.reply('postback: ' + event.postback.data);
});

bot.listen('/webhook', process.env.PORT || 3333, () => {
    console.log('Example app listening on port 3333!')
})
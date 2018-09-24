const linebot = require('./index.js');
const rp = require('request-promise');

const bot = linebot({
    channelId: process.env.channelId,
    channelAccessToken: process.env.accessToken,
    channelSecret: process.env.channelSecret,
    verify: true // default=true
});

var Data_ig = function (data) {
    this.max_image = data.thumbnail_src
    this.mini_image = data.thumbnail_resources[0].src
}

var Data_youtube = function (data) {
    this.video_id = data.id.videoId
    this.video_image_url = data.snippet.thumbnails.default.url
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
        })

    })
}

function getigImage(ig_options, event) {
    rp(ig_options).then(function(response) {
        var ig_image = []
        var array_top_posts = response.graphql.hashtag.edge_hashtag_to_top_posts.edges
        for (let origin of array_top_posts) {
            let item = new Data_ig(origin.node)
            ig_image.push(item)
        }

        var random_val = [Math.floor(Math.random() * ig_image.length)]
        var url_image_m = ig_image[random_val].max_image
        var url_image_s = ig_image[random_val].mini_image
       
        return event.reply({
            type: 'image',
            originalContentUrl: url_image_m,
            previewImageUrl: url_image_s
        })

    })
}

function getYoutube(yt_options, event) {
    rp(yt_options).then(function(response) {
        // return event.replay(yt.yt_options)
        var video = []
        var array_video_data = response.items
        for (let origin of array_video_data) {
            let item = new Data_youtube(origin)
            video.push(item)
        }

        var random_val = [Math.floor(Math.random() * video.length)]
        var url_video = 'https://www.youtube.com/watch?v='+video[random_val].video_id
        var url_image = video[random_val].video_image_url

        return event.reply({
                "type": "imagemap",
                "baseUrl": url_image+'?', //防呆line網址縮圖
                "altText": '........',
                "baseSize": {
                    "width": 400,
                    "height": 300
                },
                "actions": [
                    {
                        "type": "uri",
                        "linkUri": url_video,
                        "area": {
                            "x": 0,
                            "y": 0,
                            "width": 400,
                            "height": 300
                        }
                    }
                    // {
                    //     "type": "message",
                    //     "text": "Hello",
                    //     "area": {
                    //         "x": 520,
                    //         "y": 0,
                    //         "width": 520,
                    //         "height": 1040
                    //     }
                    // }
                ]
        })
    })
}

function getR18Image(dmm_options, event) {
    rp(dmm_options).then(function(response) {
        return event.reply([response])
        var url_image_small = dmm_options.small
        var url_image_large = dmm_options.large
        return event.reply({
            type: 'image',
            originalContentUrl: url_image_large,
            previewImageUrl: url_image_small
        })
    }).catch(function (err) {
        return event.reply('歹勢啦~我的資料裡沒這張圖~')
    })
}


bot.on('message', function(event) {
    switch (event.message.type) {
        case 'text':
            if (event.message.text.substr(0,1) == '#') {
                var encode_tag = encodeURIComponent(event.message.text.substr(1).trim()) 
                    var ig_options = {
                        uri: 'https://www.instagram.com/explore/tags/'+ encode_tag +'?__a=1',
                        json: true
                    };
                    var get_ig_image = getigImage(ig_options, event);
            }
            else if (event.message.text.substr(0,2) == 'yt') {
                var encode_keyword = encodeURIComponent(event.message.text.substr(2).trim()) 
                    var yt_options = {
                        uri: 'https://www.googleapis.com/youtube/v3/search?'+'key='+process.env.youtubeToken+'&q='+encode_keyword+'&type=video'+'&part=snippet',
                        json: true
                    };
                    var get_youtube_video = getYoutube(yt_options, event);
            }
            else if (event.message.text.substr(0,3) == '18+') {
                        let source_code = event.message.text.substr(3).trim()
                        let pic_code = source_code.replace(/\d/g, '')
                        let pic_number = source_code.replace(/[a-z]/ig, '')
                        var fix_source_code = pic_code+'00'+pic_number 
                            var dmm_options = {
                                uri: 'https://pics.dmm.co.jp/digital/video/'+fix_source_code+'/'+fix_source_code+'ps.jpg',
                                small: 'https://pics.dmm.co.jp/digital/video/'+fix_source_code+'/'+fix_source_code+'ps.jpg',
                                large: 'https://pics.dmm.co.jp/digital/video/'+fix_source_code+'/'+fix_source_code+'pl.jpg',
                                json: true
                            };
                            var get_r18_image = getR18Image(dmm_options, event);
            } else {
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
                    case 'location':
                        event.reply({
                            type: 'location',
                            title: 'LINE Plus Corporation',
                            address: '別問我你在哪~~~',
                            latitude: 13.7202068,
                            longitude: 100.5298698
                        });
                        break;
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
                        break;
                    case '幹':
                        event.reply('....請冷靜 '+String.fromCharCode(0x10007B));
                        break;
                    //case '早餐':
                    //     var eat_options = {
                    //         method: 'GET',
                    //         uri: 'https://api.imgur.com/3/album/6YSY1/images',
                    //         headers: {
                    //             "Authorization": 'Client-ID ' + process.env.client_id
                    //         },
                    //         json: true
                    //     };
                    //     var breakfast_img = getImage(eat_options, event);
                    //     break;
                    // case '午餐':
                    //     var eat_options = {
                    //         method: 'GET',
                    //         uri: 'https://api.imgur.com/3/album/D4BDl/images',
                    //         headers: {
                    //             "Authorization": 'Client-ID ' + process.env.client_id
                    //         },
                    //         json: true
                    //     };
                    //     var lunch_img = getImage(eat_options, event);
                    //     break;
                    // case '晚餐':
                    //     var eat_options = {
                    //         method: 'GET',
                    //         uri: 'https://api.imgur.com/3/album/zXNwB/images',
                    //         headers: {
                    //             "Authorization": 'Client-ID ' + process.env.client_id
                    //         },
                    //         json: true
                    //     };
                    //     var dinner_img = getImage(eat_options, event)

                    //     break;
                    // case '測試圖':
                    //     var eat_options = {
                    //         method: 'GET',
                    //         uri: 'https://api.imgur.com/3/album/zXNwB/images',
                    //         headers: {
                    //             "Authorization": 'Client-ID ' + process.env.client_id
                    //         },
                    //         json: true
                    //     };
                    //     var test_img = getImage(eat_options, event)

                    //     break;
                
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
                        // event.reply(event.message.text.substr(0,2))
                        break;
                }
            }
            break;
        case 'image':
        //     event.message.content().then(function(data) {
        //         const s = data.toString('base64').substring(0, 30);
        //         return event.reply('Nice picture! ' + s);
        //     }).catch(function(err) {
        //         return event.reply(err.toString());
        //     });
            break;
        case 'video':
            event.reply('Nice movie!');
            break;
        case 'audio':
            event.reply('Nice song!');
            break;
        case 'location':
        //     event.reply(['That\'s a good location!', 'Lat:' + event.message.latitude, 'Long:' + event.message.longitude]);
            break;
        case 'sticker':
        //     event.reply({
        //         type: 'sticker',
        //         packageId: 1,
        //         stickerId: 1
        //     });
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
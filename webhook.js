const linebot = require('./index.js');
const dataflit = require('./lib/dataflit');
const rp = require('request-promise');
const airtable = require('airtable');

// const firebase = require("firebase");


const bot = linebot({
    channelId: process.env.channelId,
    channelAccessToken: process.env.accessToken,
    channelSecret: process.env.channelSecret,
    verify: true // default=true
});

const firebase_config = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    storageBucket: process.env.storageBucket,
};
 
// firebase.initializeApp(firebase_config);
 
// const firedb = firebase.database();



var Data_ig = function (data) {
    this.max_image = data.thumbnail_src
    this.mini_image = data.thumbnail_resources[0].src
}

var Data_youtube = function (data) {
    this.video_id = data.id.videoId
    this.video_image_url = data.snippet.thumbnails.default.url
}

var base = new airtable({
    apiKey: process.env.airtableKey
}).base('appC80QmYDOvGT5cx')


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
        console.log(response)
        var ig_image = []
        var array_top_posts = response.data.hashtag.edge_hashtag_to_top_posts.edges
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
                ]
        })
    })
}

function getR18Image(dmm_options, event) {
    rp(dmm_options).then(function(response) {
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

function getWeather(weather_options, event) {
    rp(weather_options).then(function(response) {
        let res = JSON.parse(response)
        let w_status = res.current.condition.text

        return event.reply({
            type: 'image',
            originalContentUrl: w_icon,
            previewImageUrl: w_icon
        })
    }).catch(function (err) {
        return event.reply('歹勢啦~我沒有你輸入的地區資料')
    })
}

function getPrice(options, event) {
    rp(options).then(function(response) {
        let res = JSON.parse(response)
        console.log(res)
        let lastItem = res[res.length - 1]
        return event.reply(lastItem.close)
    }).catch(function (err) {
console.log(err)
        return event.reply('歹勢啦~我沒有最新的資料Q口Q')
    })
}


function transLang(lang_options, event) {
    rp(lang_options).then(function(response) {
        let res = JSON.parse(response)
        return event.reply(res.text[0])
    }).catch(function (err) {
        return event.reply('歹勢啦~我不曉得你哩工啥米Q口Q')
    })
}

function getStock(stock_id, event) {
    let stock_tse = {
       uri: 'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_'+stock_id+'.tw&json=1&delay=0'
    }
    let stock_otc = {
       uri: 'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=otc_'+stock_id+'.tw&json=1&delay=0'
    }
    
    rp(stock_tse).then(function(response) {
        let res = JSON.parse(response)
        let info = res.msgArray[0]
        if(!!info){
            let name = '名稱:'+info.nf
            let hight = '最高價:'+info.h
            let low = '最低價:'+info.l
            let now_qty = '當盤成交量:'+info.tv
            let all_qty = '累積成交量:'+info.v
            let now_buy = '現買價:'+ (info.b).split("_", 1)
            let now_sell = '現賣價:'+ (info.a).split("_", 1)
            let msg = name +" \n"+ now_buy +" \n"+ now_sell +" \n"+ hight +" \n"+low+" \n"+now_qty+" \n"+all_qty
            return event.reply(msg)
        }else{
            rp(stock_otc).then(function(response) {
                let res = JSON.parse(response)
                let info = res.msgArray[0]
                if(!!info){
                    let name = '名稱:'+info.nf
                    let hight = '最高價:'+info.h
                    let low = '最低價:'+info.l
                    let now_qty = '當盤成交量:'+info.tv
                    let all_qty = '累積成交量:'+info.v
                    let now_buy = '現買價:'+ (info.b).split("_", 1)
                    let now_sell = '現賣價:'+ (info.a).split("_", 1)
                    let msg = name +" \n"+ now_buy +" \n"+ now_sell +" \n"+ hight +" \n"+low+" \n"+now_qty+" \n"+all_qty
                    return event.reply(msg)
                } else {
                    return event.reply('沒有這筆代號資料喲, 咩噗Q口Q')
                }
            }).catch(function (err) {
                return event.reply('沒有這筆代號資料喲, 咩噗Q口Q')
            })
        }
    }).catch(function (err) {
        return event.reply('沒有這筆代號資料喲, 咩噗Q口Q')
        
        /*
        
        */
        
    })
}

bot.on('message', function(event) {
    switch (event.message.type) {
        case 'text':
            if (event.message.text.substr(0,1) == '#') {
                let ig_keyword = event.message.text.substr(1).trim()
                // firedb.ref("getmessage/").push(ig_keyword);
                var encode_tag = encodeURIComponent(ig_keyword) 
                    var ig_options = {
                        //uri: 'https://www.instagram.com/explore/tags/'+ encode_tag +'?__a=1',
                        uri: 'https://www.instagram.com/graphql/query/?query_hash=298b92c8d7cad703f7565aa892ede943&variables={"tag_name":"'+ encode_tag +'","first":0}',
                        json: true
                    };
                    var get_ig_image = getigImage(ig_options, event);
            }
            else if (event.message.text.substr(0,2) == 'yt') {
                var yt_keyword = event.message.text.substr(2).trim()
                // firedb.ref("getmessage/").push(yt_keyword);
                var encode_keyword = encodeURIComponent(yt_keyword) 
                    var yt_options = {
                        uri: 'https://www.googleapis.com/youtube/v3/search?'+'key='+process.env.youtubeToken+'&q='+encode_keyword+'&type=video'+'&part=snippet',
                        json: true
                    };
                    var get_youtube_video = getYoutube(yt_options, event);
            }
            else if (event.message.text.substr(0,5) == 'stock') {
                let stock_id = event.message.text.substr(5).trim()
                // firedb.ref("getmessage/").push(yt_keyword);
   
                    // var stock_tse = {
                    //     uri: 'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_'+stock_id+'.tw&json=1&delay=0'
                    // };
                
                    // var stock_otc = {
                    //     uri: 'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=otc_'+stock_id+'.tw&json=1&delay=0'
                    // };
                   
                    var get_stock_info = getStock(stock_id, event);
                    //var get_stock_info = getStock(stock_otc, event);
            }
            else if (event.message.text.substr(0,2) == '天氣') {
                let area = event.message.text.substr(2).trim()

                    var weather_options = {
                        uri: 'https://api.apixu.com/v1/current.json?key='+process.env.weatherKey+'&q='+area+'&lang=zh_tw'
                    };
                    let get_current_weather = getWeather(weather_options, event);
                    
            }
            else if (event.message.text.substr(0,3) == '中翻英') {
                let text = event.message.text.substr(3).trim()
                
                    var lang_options = {
                        uri: 'https://translate.yandex.net/api/v1.5/tr.json/translate?key='+process.env.yandexKey+'&lang=zh-en&text='+encodeURIComponent(text)
                    };
                    var get_lang = transLang(lang_options, event);

            }
            else if (event.message.text.substr(0,2) == '黃金') {
                let times = Date.now() - 60000
                    var options = {
                        uri: 'https://www.wantgoo.com/global/gold/realtimeprice-pricemin1?equalandafter='+times
                    };
	console.log(options)
                    var get_gold = getPrice(options, event);

            }
            else if (event.message.text.substr(0,3) == '18+') {
                let source_code = event.message.text.substr(3).trim()
                // firedb.ref("getmessage/").push(source_code);
                let pic_number = source_code.match(/\d/g).join('')
                let pic_code = source_code.match(/[a-z]/ig).join('')
                if (pic_number.length > 3 ) {
                    pic_number = '0'+pic_number
                } else {
                    pic_number = '00'+pic_number
                }
                var filekey = new dataflit(pic_code.toLowerCase())
                var fix_source_code = filekey.filename()+pic_number 
                
                    var dmm_options = {
                        uri: 'https://pics.dmm.co.jp/digital/video/'+fix_source_code+'/'+fix_source_code+'ps.jpg',
                        small: 'https://pics.dmm.co.jp/digital/video/'+fix_source_code+'/'+fix_source_code+'ps.jpg',
                        large: 'https://pics.dmm.co.jp/digital/video/'+fix_source_code+'/'+fix_source_code+'pl.jpg',
                        resolveWithFullResponse: true,
                        followRedirect: false
                    };
                    var get_r18_image = getR18Image(dmm_options, event);
            }
            else if (event.message.text.substr(0,2) == '片片') {
                let mv_keyword = event.message.text.substr(2).trim()
                let filter = ('SEARCH("'+mv_keyword+'", {name})')
               
                base('eighteen').select({
                    maxRecords: 1,
                    view: 'Grid view',
                    filterByFormula: filter
                }).firstPage(function(err, records) {
                    if (err || mv_keyword == '' ) { 
                        console.log(err)
                        event.reply('沒有你要的資料，是不是太重口味了呢???')
                        return false
                    }
                    records.forEach(function(record) {
                        // console.log('Retrieved', record.get('url'));
                        event.reply([record.get('url'), record.get('name')])
                    });
                });
            } else {
                switch (event.message.text) {
                    case '給我id':
                        event.source.profile().then(function(profile) {
                            return event.reply('嗨 ' + profile.displayName + ' 你要幹嘛!! ' + profile.userId);
                        });
                        break;
                    case '給我info':
                        event.reply(JSON.stringify(event.source));
                        break;
                    case 'bot滾':
                        if (!!event.source.roomId){
                            let roomId = event.source.roomId;
                            return this.post('/room/' + roomId + '/leave/').then(function (res) {
                                return res.json();
                            });
                        } else {
                            let groupId = event.source.groupId;
                            return this.post('/group/' + groupId + '/leave/').then(function (res) {
                                return res.json();
                            });
                        }
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
                    case 'createmenu':
                        let data = 
                             {
                              "size": {
                                "width": 2500,
                                "height": 1686
                              },
                              "selected": false,
                              "name": "Nice richmenu",
                              "chatBarText": "Tap to open",
                              "areas": [
                                {
                                  "bounds": {
                                    "x": 0,
                                    "y": 0,
                                    "width": 2500,
                                    "height": 1686
                                  },
                                  "action": {
                                    "type": "postback",
                                    "data": "action=buy&itemid=123"
                                  }
                                }
                              ]
                            }
                       return this.post('/richmenu', data).then(function (res) {
                                return res.json();
                            });
                        break;
                    case 'menu':
                        return this.get('/richmenu/list').then(function (res) {
                                return res.json();
                            });
                        break;
                    case '指令':
                        event.reply(['#關鍵字', 'yt關鍵字', '18+番號', '中翻英中文', 'stock{股號}']);
                        break;
                    case '早知道':
                        event.reply('股市深淵－－－沒有早知道（ ＴДＴ）')
                        break;    
                    case '幹':
                        let emjoi = '🖕'
                        event.reply('....請冷靜 ' + emjoi)
                        // event.reply('....請冷靜 '+ "🖕");
                        break;
                    default:
                        // event.reply(event.message.text)
                        break;
                }
            }
            break;
        case 'video':
            event.reply('Nice movie!');
            break;
        case 'audio':
            event.reply('Nice song!');
            break;
         case 'image':
            break;
        case 'video':
            event.reply('Nice movie!');
            break;
        case 'audio':
            event.reply('Nice song!');
            break;
        case 'location':
            break;
        case 'sticker':
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
    if (!!event.source.groupId) {
        var joinid = event.source.groupId
    } else {
        var joinid = event.source.roomId
    }
    event.reply('join: ' + joinid);
});

bot.on('leave', function(event) {
    if (!!event.source.groupId) {
        var leaveid = event.source.groupId
    } else {
        var leaveid = event.source.roomId
    }
    event.reply('leave: ' + leaveid);
});

bot.on('postback', function(event) {
    event.reply('postback: ' + event.postback.data);
});

bot.listen('/webhook', process.env.PORT || 3333, () => {
    console.log('Example app listening on port 3333!')
})

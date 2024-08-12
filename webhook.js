const linebot = require('./index.js');
const dataflit = require('./lib/dataflit');
const rp = require('request-promise').defaults({ jar: true });
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
}).base('app2oVW62FODpXmq0');

async function findstock(stock) {
    let stock_id = stock
    //判斷中文
    let reg = /^[\u4E00-\u9FA5]+$/
    if (reg.test(stock)) {
        var filter = 'FIND("' +stock+ '", {name}) > 0'
        const records = await base('stock_list').select({
            maxRecords: 1,
            view: 'Grid view',
            filterByFormula: filter
        }).all()
        if(records.length>0){
            stock_id = records[0].get('no')
        }
    }
    return (!!stock_id) ? stock_id : stock;
    
    
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

function testigImage() {
    let encode_tag = encodeURIComponent("抹茶")
    let ig_options = {
        headers: {
            'User-Agent': "insomnia/2023.5.8",
            'Referer': "https://www.instagram.com",
        },
        uri: 'https://www.instagram.com/explore/tags/'+ encode_tag +'/?__a=1&__d=dis',
        json: true
    };
    rp(ig_options).then(function(response) {
        return response
        console.log(response)
        return  response.data.hashtag.name
        // return  response.data.hashtag.edge_hashtag_to_top_posts.edges[0]

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

function getfrImage(options, event) {
    rp(options).then(function(response) {
        var flickr_images = []    
	for (let origin of response.items) {
            flickr_images.push(origin.media)
        }
        var media = flickr_images[Math.floor(Math.random() * flickr_images.length)]
        return event.reply({
            type: 'image',
            originalContentUrl: media.m,
            previewImageUrl: media.m
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

function getGemini(options, event) {
    rp(options).then(function(response) {
        let res = JSON.parse(response)
        return event.reply(JSON.stringify(res))
        let message = res.candidates[0].content.parts[0].text
        return event.reply(message)
    }).catch(function (err) {
        return event.reply(JSON.stringify(err))
        return event.reply('歹勢啦~Gemini無法回你喲')
    })
}

function getPrice(options, event) {
    rp(options).then(function(response) {
        let res = JSON.parse(response)
        let lastItem = res[res.length - 1]
        return event.reply(lastItem.close)
    }).catch(function (err) {
        return event.reply('歹勢啦~我沒有最新的資料Q口Q')
    })
}

function getReport(category, event) {
    let today = new Date().toISOString().replace('-', '').split('T')[0].replace('-', '');
    let stock_report = {
       uri: 'https://www.twse.com.tw/fund/T86?response=json&date='+today+'&selectType='+category+'&_=1643005796331'
    }
    rp(stock_report).then(function(response) {
        let res = JSON.parse(response)
        let status = res.stat
        let title = res.title
        let info = res.data
        if(status == 'OK'){
            let msg = self_pluck(info)
            return event.reply(msg)
        }else{
            return event.reply(status)
        }
    }).catch(function (err) {
        return event.reply('歹勢啦~我不曉得你哩工啥米Q口Q')
    })
}

// 抓取回傳的指定資料
function self_pluck(array) {
    let pluck_msg = array.map(o => o[0]+''+o[1].trim()+' : '+o[18]).slice(0, 12);
    return pluck_msg.join(" \n")
}

function transLang(lang_options, event) {
    rp(lang_options).then(function(response) {
        let res = JSON.parse(response)
        return event.reply(res.text[0])
    }).catch(function (err) {
        return event.reply('歹勢啦~我不曉得你哩工啥米Q口Q')
    })
}

// 最低手續費、交易費計算
function getDiscMsg(price, event) {
    let disc = getDisc(price)
    let msg = '最低手續費用計算:' + disc
    return event.reply(msg)
}

// 最低手續費、交易費計算
function getDisc(price) {
    //大約計算
    let disc = (parseFloat(price)) * 1000*0.2680/100
    return disc
}

//檔位判斷
function getPart(price) {
    return fee = price<10?0.01:(price<50?0.05:(price<100?0.1:(price<500?0.5:(price<1000?1:5)))); 
}

//取得跳的檔位
function getick(price) {
    price = parseFloat(price)
    let disc = getDisc(price)
    let num = getPart(price)
    let part = Math.ceil(disc/(num*1000))
    increase_price = (price + (part*num)).toFixed(2)
    let msg = '最少要跳'+part+'檔,'+increase_price+'賣出'
    return msg
}

async function getStock(stock, event) {
    let stock_id = await findstock(stock)
	if(stock_id == '0000') {
	    let stock_tai = {
       	  	uri: 'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_t00.tw&json=1&delay=0'
    	}
	    rp(stock_tai).then(function(response) {
            let res = JSON.parse(response)
            let info = res.msgArray[0]
            if(!!info){
                let name = info.c+info.n
                let fullname = info.c+'名稱:'+info.n
                let hight = '最高價:'+info.h
                let low = '最低價:'+info.l
                let all_qty = '累積成交量:'+info.v
                let yd = '昨收價:'+info.y
                let now_buy = '現價:'+ info.z
                let now_level = '漲跌:'+ (parseFloat(info.z) - parseFloat(info.y))
                let msg = name +" \n"+fullname +" \n"+ now_buy +" \n"+ hight +" \n"+ low+" \n"+all_qty+" \n"+yd+" \n"+now_level
               
                return event.reply(msg)
            }
            return event.reply(stock_id)    
	    })
	}

    let stock_option = {
       uri: 'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_'+stock_id+'.tw|otc_'+stock_id+'.tw&json=1&delay=0'
    }

    
    rp(stock_option).then(function(response) {
        let res = JSON.parse(response)
        let info = res.msgArray[0]
        if(!!info){
            let name = info.c+info.n
            let fullname = info.c+'名稱:'+info.nf
            let hight = '最高價:'+info.h
            let lock = '漲停價:'+info.u
            let low = '最低價:'+info.l
            let down = '跌停價:'+info.w
            let now_qty = '當盤成交量:'+info.tv
            let all_qty = '累積成交量:'+info.v
            let yd = '昨收價:'+info.y
            let now_buy = '現買價:'+ (info.b).split("_", 1)
            let now_sell = '現賣價:'+ (info.a).split("_", 1)
            let now_level = '漲跌:'+ (parseFloat((info.b).split("_", 1)) - parseFloat(info.y))
            let now_sell_amont = '現賣量:'+ (info.f).split("_", 1)
            let now_buy_amont = '現買量:'+ (info.g).split("_", 1)
            let disc = '最低手續費用計算:'+ (parseFloat((info.b).split("_", 1))*1000*0.2697/100)
            let tick = getick((info.b).split("_", 1))
            let msg = name +" \n"+fullname +" \n"+now_level +" \n"+ now_buy +" \n"+ now_buy_amont +" \n"+ now_sell +" \n"+ now_sell_amont +" \n"+ hight +" \n"+ lock +" \n"+low+" \n"+ down +" \n"+now_qty+" \n"+all_qty+" \n"+disc+" \n"+ tick
            return event.reply(msg)
        }else{
            return event.reply('沒有這筆代號資料喲, 咩噗Q口Q')
        }
    }).catch(function (err) {
        return event.reply('沒有這筆代號資料喲, 咩噗Q口Q')        
    })
}

bot.on('message', function(event) {
    switch (event.message.type) {
        case 'text':
            if(event.message.text == 'test') {
                let msg = testigImage()
                event.reply(msg)
            }
            if (event.message.text.substr(0,1) == '#' && event.message.text.substr(0,2) !== '##') {
                let ig_keyword = event.message.text.substr(1).trim()
                // firedb.ref("getmessage/").push(ig_keyword);
                var encode_tag = encodeURIComponent(ig_keyword)
                var ig_options = {
                    headers: {
                        'User-Agent': "insomnia/2023.5.8",
                        'Referer': "https://www.instagram.com",
                    },
                    uri: 'https://www.instagram.com/explore/tags/'+ encode_tag +'/?__a=1&__d=dis',
                    json: true
                };
                var get_ig_image = getigImage(ig_options, event);
            }
	        if (event.message.text.substr(0,2) == '##') {
                let keyword = event.message.text.substr(1).trim()
                // firedb.ref("getmessage/").push(ig_keyword);
                var encode_tag = encodeURIComponent(keyword)
                    var options = {
                        uri: 'https://www.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1&tags='+ encode_tag,
			            json: true
                    };
                    var get_image = getfrImage(options, event);
            }
            if (event.message.text.substr(0,1) == '!') {
                let ig_keyword = event.message.text.substr(1).trim()
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
            else if (event.message.text.substr(0,5).toLowerCase() == 'stock') {
		        let string_stock = event.message.text.trim()
                let stock_id = string_stock.substr(5).trim()
                // firedb.ref("getmessage/").push(yt_keyword);
                var get_stock_info = getStock(stock_id, event);
                    
            }
            else if (event.message.text.substr(0,4) == '三大法人') {
                    let category = 'ALL';       
                    var get_report_stock = getReport(category,event);
            }
            else if (event.message.text.substr(0,2) == '凱基') {
                let msg = 'https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgb/zgb0.djhtm?a=9200&b=9268&c=B&d=1';
                event.reply(msg);
                    
            }
            else if (event.message.text.substr(0,2) == '盤後') {
                    let msg = 'https://fubon-ebrokerdj.fbs.com.tw/Z/ZG/ZGB/ZGB.djhtm';
                    event.reply(msg);
            }
            else if (event.message.text.substr(0,2) == '天氣') {
                    let area = event.message.text.substr(2).trim()

                    var weather_options = {
                        uri: 'https://api.apixu.com/v1/current.json?key='+process.env.weatherKey+'&q='+area+'&lang=zh_tw'
                    };
                    let get_current_weather = getWeather(weather_options, event);
                    
            }
            else if (event.message.text.substr(0,2).toLowerCase() == 'ai') {
                let text = event.message.text.substr(2).trim()
                const options = {
                    method: 'POST',
                    url: 'https://script.google.com/macros/s/AKfycbyYM5gyVv9O8sngZpCHuNAmbX9mBR0gvQcpmTfbLdQu7xz3SKllTqErJHj_KuoJuEhDhQ/exec',
                    headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.3.0'},
                    body: {message: '北極熊'},
                    json: true
                  };
                let gemini = getGemini(options, event);
                
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
	
                    var get_gold = getPrice(options, event);

            }
            else if (event.message.text.substr(0,4) == 'disc') {
                    let stock_price = event.message.text.substr(4).trim()
                    var get_disc = getDiscMsg(stock_price, event);
            }
            else if (event.message.text.substr(0,1) == '沖') {
                    let msg =   "當沖三不"+" \n"+
                            "不留目前倉超過該時段"+" \n"+
                            "手中不大量持倉"+" \n"+
                            "不要不作功課亂沖";
                    event.reply(msg);
            }
            else if (event.message.text.substr(0,1) == '表') {
                    let msg = "370~500→三檔"+" \n"+
                            "370~184→兩檔"+" \n"+
                            "184~100→一檔"+" \n"+
                            "100~75→三檔"+" \n"+
                            "74~50→兩檔"+" \n"+
                            "50~38→三檔"+" \n"+
                            "37~18→兩檔"+" \n"+
                            "18~11→一檔"+" \n"+
                            "10~3.7→兩檔"+" \n"+
                            "3.6 以下→一檔";
                    event.reply(msg);
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
                        let emjoi = '🖕🖕🖕🖕'
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

// line的各項動作綁定
bot.on('follow', function(event) {
    event.reply('follow: ' + event.source.userId);
});

// 取消追隨
bot.on('unfollow', function(event) {
    event.reply('unfollow: ' + event.source.userId);
});

//加入群組或聊天室
bot.on('join', function(event) {
    if (!!event.source.groupId) {
        let joinid = event.source.groupId
    } else {
        let joinid = event.source.roomId
    }
    event.reply('join: ' + joinid);
});

//離開群組或聊天室
bot.on('leave', function(event) {
    if (!!event.source.groupId) {
        let leaveid = event.source.groupId
    } else {
        let leaveid = event.source.roomId
    }
    event.reply('leave: ' + leaveid);
});


bot.on('postback', function(event) {
    event.reply('postback: ' + event.postback.data);
});


bot.listen('/webhook', process.env.PORT || 3333, () => {
    console.log('Example app listening on port 3333!')
})

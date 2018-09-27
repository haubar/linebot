const linebot = require('./index.js');
const dataflit = require('./lib/dataflit');
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

var data_r18 = function (data) {
    let list = 
        {
   	       "star": "1star",
   	       "sace": "1sace",
		  	"sddm": "1sddm",
        	"sdde": "1sdde",
        	"sdds": "1sdds",
			"sdmt": "1sdmt",		
            "sdmu": "1sdmu",
            "sdnm": "1sdnm",
            "sden": "1sden",
            "svdvd": "1svdvd",
            "sw": "1sw",
            "iscr": "1iscr",
            "iesp": "1iesp",
            "idol": "1idol",
            "iene": "1iene",
            "fset": "1fset",
            "open": "1open",
            "gs": "1gs",
            "hbad": "1hbad",
            "rct": "1rct",
            "rctd": "1rctd",
            "kmhr": "1kmhr",
            "kwpo": "1kwpo",
            "dandy": "1dandy",
            "dvd": "1dvd",
            "dvdes": "1dvdes",
            "dvdps": "1dvdps",
            "trct": "1trct",
            "ngks": "1ngks",
            "nhdtb": "1nhdtb",
            "nhdta": "1nhdta",
            "nhdt": "1nhdt",
            "nhvr": "1nhvr",
            "mmgh": "1mmgh",
            "mane": "1mane",
            "cwm": "2cwm",
            "dje": "2dje",
            "dgre": "2dgre",
            "dfdm": "2dfdm",
            "ekai": "2ekai",
            "ecb": "2ecb",
            "hgwp": "2hgwp",
            "yvh": "2yvh",
            "wsp": "2wsp",
            "wwk": "2wwk",
            "wpvr": "2wpvr",
            "wdi": "2wdi",
            "wanz": "3wanz",
            "wnz": "3wnz",
            "wnzs": "3wnzs",
            "wfs": "3wfs",
            "wf": "3wf",
            "wfs": "3wfs",
            "nama": "3nama",
            "sfw": "3sfw",
            "val": "12val",
            "lol": "12lol",
            "avg": "13avg",
            "ayb": "13ayb",
            "box": "13box",
            "gvg": "13gvg",
            "gqe": "13gqe",
            "hvg": "13hvg",
            "mvg": "13mvg",
            "ovg": "13ovg",
            "rvg": "13rvg",
            "sgv": "13sgv",
            "sqv": "13sqv",
            "yvg": "13yvg",
            "djr": "15djr",
            "dim": "15dim",
            "dme": "15dme",
            "ddka": "15ddka",
            "cmd": "24cmd",
            "hfd": "24hfd",
            "fsd": "24fsd",
            "mzd": "24mzd",
            "lid": "24lid",
            "ned": "24ned",
            "pzd": "24pzd",
            "ufd": "24ufd",
            "qbd": "24qbd",
            "vdd": "24vdd",
            "pk": "36pk",
            "tdsu": "36tdsu",
            "doks": "36doks",
            "dmow": "36dmow",
            "dic": "36dic",
            "drop": "36drop",
            "did": "36did",
            "dili": "36dili",
            "dksm": "36dksm",
            "hmpd": "41hmpd",
            "hodv": "41hodv",
            "bndv": "41bndv",
            "adz": "47adz",
            "cadv": "49cadv",
            "ekdv": "49ekdv",
            "fa": "49fa",
            "he": "49he",
            "madm": "49madm",
            "mvs": "49mvs",
            "mva": "49mva",
            "nitr": "49nitr",
            "porn": "49porn",
            "pe": "49pe",
            "sc": "49sc",
            "tmhk": "49tmhk",
            "akb": "55akb",
            "adi": "55adi",
            "aikb": "55aikb",
            "htma": "55htma",
            "boya": "55boya",
            "ksdo": "55ksdo",
            "tsms": "55tsms",
            "tmaf": "55tmaf",
            "bazx": "61bazx",
            "rmds": "61rmds",
            "mdb": "61mdb",
            "mds": "61mds",
            "mdtm": "61mdtm",
            "bzvr": "84bzvr",
            "kmvr": "84kmvr",
            "mkmp": "84mkmp",
            "mild": "84mild",
            "umso": "84umso",
            "okax": "84okax",
            "okad": "84okad",
            "abp": "118abp",
            "ama": "118ama",
            "abs": "118abs",
            "afs": "118afs",
            "aka": "118aka",
            "any": "118any",
            "bgn": "118bgn",
            "chn": "118chn",
            "cdc": "118cdc",
            "cmi": "118cmi",
            "dic": "118dic",
            "docp": "118docp",
            "dcx": "118dcx",
            "esk": "118esk",
            "fch": "118fch",
            "fnc": "118fnc",
            "ftn": "118ftn",
            "fis": "118fis",
            "fiv": "118fiv",
            "goal": "118goal",
            "gets": "118gets",
            "good": "118good",
            "giro": "118giro",
            "har": "118har",
            "hcm": "118hcm",
            "jbs": "118jbs",
            "job": "118job",
            "kbh": "118kbh",
            "kkj": "118kkj",
            "lxvs": "118lxvs",
            "long": "118long",
            "mgt": "118mgt",
            "mzq": "118mzq",
            "mas": "118mas",
            "nrs": "118nrs",
            "nmp": "118nmp",
            "npv": "118npv",
            "once": "118once",
            "onez": "118onez",
            "pbs": "118pbs",
            "ppt": "118ppt",
            "pxh": "118pxh",
            "prd": "118prd",
            "rix": "118rix",
            "rdd": "118rdd",
            "rddp": "118rddp",
            "rdt": "118rdt",
            "rtp": "118rtp",
            "sga": "118sga",
            "srs": "118srs",
            "tem": "118tem",
            "ths": "118ths",
            "tre": "118tre",
            "tus": "118tus",
            "ult": "118ult",
            "yrh": "118yrh",
            "yrz": "118yrz",
            "bdd": "143bdd",
            "dsts": "145dsts",
            "rd": "149rd",
            "xrw": "172xrw",
            "real": "172real",
            "oned": "433oned",
            "natr": "h_067natr",
            "srxv": "h_105srxv",
            "saba": "h_244saba",
            "love": "h_491love",
            "fone": "h_491fone",
            "very": "h_491very",
            "ktif": "h_491ktif",
            "fsre": "h_491fsre",
            "fstb": "h_491fstb",
            "fstc": "h_491fstc",
            "fstd": "h_491fstd",
            "fsta": "h_491fsta",
            "fste": "h_491fste",
            "fskt": "h_491fskt",
            "tmdi": "h_452tmdi",
            "scop": "h_565scop",
            "mks": "h_618mks",
            "mnri": "h_618mnri",
            "mdjy": "h_618mdjy",
            "mkz": "h_618mkz",
            "mzro": "h_618mzro",
            "mmgm": "h_618mmgm",
            "mnrs": "h_618mnrs",
            "mhip": "h_618mhip",
            "mnimz": "h_618mnimz",
            "mhso": "h_618mhso",
            "sexy": "h_697sexy",
            "tbtb": "h_840tbtb",
            "vspds": "h_910vspds",
		}

        this.result = list[data]
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
        // return event.reply(response.size())
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
                        let pic_number = source_code.match(/\d/g).join('')
                        let pic_code = source_code.match(/[a-z]/ig).join('')
                        if (pic_number.length > 3 ) {
                            pic_number = '0'+pic_number
                        } else {
                            pic_number = '00'+pic_number
                        }
                        var fix_source_code = new dataflit(pic_code.toLowerCase())+pic_number 
                        return event.reply(fix_source_code)
                            var dmm_options = {
                                uri: 'https://pics.dmm.co.jp/digital/video/'+fix_source_code+'/'+fix_source_code+'ps.jpg',
                                small: 'https://pics.dmm.co.jp/digital/video/'+fix_source_code+'/'+fix_source_code+'ps.jpg',
                                large: 'https://pics.dmm.co.jp/digital/video/'+fix_source_code+'/'+fix_source_code+'pl.jpg',
                                resolveWithFullResponse: true,
                                followRedirect: false
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
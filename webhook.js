const linebot = require('./index.js');
const dataflit = require('./lib/dataflit');
const rp = require('request-promise').defaults({ jar: true });
const airtable = require('airtable');

const bot = linebot({
    channelId: process.env.channelId,
    channelAccessToken: process.env.accessToken,
    channelSecret: process.env.channelSecret,
    verify: true // default=true
});

const base = new airtable({
    apiKey: process.env.airtableKey
}).base('app2oVW62FODpXmq0');

const DataIg = (data) => ({
    max_image: data.thumbnail_src,
    mini_image: data.thumbnail_resources[0].src
});

const DataYoutube = (data) => ({
    video_id: data.id.videoId,
    video_image_url: data.snippet.thumbnails.default.url
});

const findStock = async(stock) => {
    let stock_id = stock
    //判斷中文
    const reg = /^[\u4E00-\u9FA5]+$/
    if (reg.test(stock)) {
        const filter = 'FIND("' +stock+ '", {name}) > 0'
        const records = await base('stock_list').select({
            maxRecords: 1,
            view: 'Grid view',
            filterByFormula: filter
        }).all()
        if(records.length > 0){
            stock_id = records[0].get('no')
        }
    }
    return stock_id || stock;
}

const getIgImage = async(options, event) => {
    try {
        const response = await rp(options);
        const ig_image = response.data.hashtag.edge_hashtag_to_top_posts.edges.map(origin => DataIg(origin.node));
        const random_val = Math.floor(Math.random() * ig_image.length);
        const url_image_m = ig_image[random_val].max_image;
        const url_image_s = ig_image[random_val].mini_image;
        return event.reply({
            type: 'image',
            originalContentUrl: url_image_m,
            previewImageUrl: url_image_s
        });
    } catch (error) {
        console.error(error);
    }
}

const getFrImage = async(options, event) => {
    try {
        const response = await rp(options);
        const flickr_images = response.items.map(origin => origin.media);
        const media = flickr_images[Math.floor(Math.random() * flickr_images.length)];
        return event.reply({
            type: 'image',
            originalContentUrl: media.m,
            previewImageUrl: media.m
        });
    } catch (error) {
        console.error(error);
    }
}

const getYoutube = async(options, event) => {
    try {
        const response = await rp(options);
        const video = response.items.map(origin => DataYoutube(origin));
        const random_val = Math.floor(Math.random() * video.length);
        const url_video = `https://www.youtube.com/watch?v=${video[random_val].video_id}`;
        const url_image = video[random_val].video_image_url;
        return event.reply({
            type: 'imagemap',
            baseUrl: `${url_image}?`, //防呆line網址縮圖
            altText: '........',
            baseSize: { width: 400, height: 300 },
            actions: [{
                type: 'uri',
                linkUri: url_video,
                area: { x: 0, y: 0, width: 400, height: 300 }
            }]
        });
    } catch (error) {
        console.error(error);
    }
}

const getR18Image = async(options, event) => {
    try {
        await rp(options);
        return event.reply({
            type: 'image',
            originalContentUrl: options.large,
            previewImageUrl: options.small
        });
    } catch (err) {
        return event.reply('歹勢啦~我的資料裡沒這張圖~');
    }
}

const getWeather = async(options, event) => {
    try {
        const response = await rp(options);
        const w_status = JSON.parse(response).current.condition.text;
        return event.reply({
            type: 'image',
            originalContentUrl: w_icon,
            previewImageUrl: w_icon
        });
    } catch (err) {
        return event.reply('歹勢啦~我沒有你輸入的地區資料');
    }
}

const getGemini = async(options, event) => {
    try {
        const response = await rp(options);
        const message = JSON.parse(response).candidates[0].content.parts[0].text;
        return event.reply(message);
    } catch (err) {
        return event.reply('歹勢啦~Gemini無法回你喲');
    }
}

const getPrice = async(options, event) => {
    try {
        const response = await rp(options);
        const lastItem = JSON.parse(response).pop();
        return event.reply(lastItem.close);
    } catch (err) {
        return event.reply('歹勢啦~我沒有最新的資料Q口Q');
    }
}

const getReport = async(category, event) => {
    const today = new Date().toISOString().replace('-', '').split('T')[0].replace('-', '');
    const stock_report = {
       uri: 'https://www.twse.com.tw/fund/T86?response=json&date='+today+'&selectType='+category+'&_=1643005796331'
    }
    try {
        const response = await rp(stock_report);
        const res = JSON.parse(response);
        if (res.stat === 'OK') {
            const msg = res.data.map(o => `${o[0]}${o[1].trim()} : ${o[18]}`).slice(0, 12).join(" \n");
            return event.reply(msg);
        } else {
            return event.reply(res.stat);
        }
    } catch (err) {
        return event.reply('歹勢啦~我不曉得你哩工啥米Q口Q');
    }
}

const transLang = async(options, event) => {
    try {
        const response = await rp(options);
        return event.reply(JSON.parse(response).text[0]);
    } catch (err) {
        return event.reply('歹勢啦~我不曉得你哩工啥米Q口Q');
    }
}

const getDiscMsg = (price, event) => {
    const disc = getDisc(price)
    const msg = `最低手續費用計算: ${disc}`
    return event.reply(msg)
}

// 最低手續費、交易費計算
const getDisc = (price) => {
    //大約計算
    return (parseFloat(price)) * 1000*0.2680/100
}

//檔位判斷
const getPart = (price) => {
    return (price < 10 ? 0.01 : price < 50 ? 0.05 : price < 100 ? 0.1 : price < 500 ? 0.5 : price < 1000 ? 1 : 5);
}

//取得跳的檔位
const getTick = (price) => {
    price = parseFloat(price);
    const disc = getDisc(price);
    const num = getPart(price);
    const part = Math.ceil(disc / (num * 1000));
    const increase_price = (price + (part * num)).toFixed(2);
    const msg = `最少要跳${part}檔, ${increase_price}賣出`;
    return msg;
};

const formatMsg = (msg) => {
    if(!msg) return false; 
    return msg.replace(/\n\s+/g, '\n').trim();
};


const getStock = async(stock, event) => {
    const stock_id = await findStock(stock);
    const stock_uri = stock_id === '0000' ? 'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_t00.tw&json=1&delay=0' : `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_${stock_id}.tw|otc_${stock_id}.tw&json=1&delay=0`;
    const stock_option = { uri: stock_uri };

    try {
        const response = await rp(stock_option);
        const info = JSON.parse(response).msgArray[0];
        if (info) {
            const msg = `
                ${info.c}${info.n}
                ${info.c}名稱: ${info.nf}
                現價: ${info.z}
                漲跌: ${(parseFloat(info.z) - parseFloat(info.y))}
                最高價: ${info.h}
                最低價: ${info.l}
                累積成交量: ${info.v}
                昨收價: ${info.y}
            `;
            return event.reply(msg);
        } else {
            return event.reply('沒有這筆代號資料喲, 咩噗Q口Q');
        }
    } catch (err) {
        return event.reply('沒有這筆代號資料喲, 咩噗Q口Q');
    }
}


bot.on('message', async (event) => {
    switch (event.message.type) {
        case 'text':
            const msgText = event.message.text;
            if (msgText === 'test') {
                return event.reply("TEST");
            } else if (msgText.startsWith('##')) {
                const keyword = msgText.slice(1).trim();
                const encode_tag = encodeURIComponent(keyword);
                const options = {
                    uri: `https://www.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1&tags=${encode_tag}`,
                    json: true
                };
                await getFrImage(options, event);
            } else if (msgText.startsWith('#') && !msgText.startsWith('##')) {
                const ig_keyword = msgText.slice(1).trim();
                const encode_tag = encodeURIComponent(ig_keyword);
                const ig_options = {
                    headers: {
                        'User-Agent': "insomnia/2023.5.8",
                        'Referer': "https://www.instagram.com",
                    },
                    uri: `https://www.instagram.com/explore/tags/${encode_tag}/?__a=1&__d=dis`,
                    json: true
                };
                await getIgImage(ig_options, event);
            }  else if (msgText.startsWith('!')) {
                const ig_keyword = msgText.slice(1).trim();
            } else if (msgText.toLowerCase().startsWith('yt')) {
                const yt_keyword = msgText.slice(2).trim();
                const encode_keyword = encodeURIComponent(yt_keyword);
                const yt_options = {
                    uri: `https://www.googleapis.com/youtube/v3/search?key=${process.env.youtubeToken}&q=${encode_keyword}&type=video&part=snippet`,
                    json: true
                };
                await getYoutube(yt_options, event);
            } else if (msgText.toLowerCase().startsWith('stock')) {
                const stock_id = msgText.slice(5).trim();
                await getStock(stock_id, event);
            } else if (msgText.startsWith('三大法人')) {
                await getReport('ALL', event);
            } else if (msgText.startsWith('凱基')) {
                return event.reply('https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgb/zgb0.djhtm?a=9200&b=9268&c=B&d=1');
            } else if (msgText.startsWith('盤後')) {
                return event.reply('https://fubon-ebrokerdj.fbs.com.tw/Z/ZG/ZGB/ZGB.djhtm');
            } else if (msgText.startsWith('天氣')) {
                const area = msgText.slice(2).trim();
                const weather_options = {
                    uri: `https://api.apixu.com/v1/current.json?key=${process.env.weatherKey}&q=${area}&lang=zh_tw`
                };
                await getWeather(weather_options, event);
            } else if (msgText.toLowerCase().startsWith('ai')) {
                const text = msgText.slice(2).trim();
                const options = {
                    method: 'POST',
                    uri: 'https://script.google.com/macros/s/AKfycbyYM5gyVv9O8sngZpCHuNAmbX9mBR0gvQcpmTfbLdQu7xz3SKllTqErJHj_KuoJuEhDhQ/exec',
                    headers: { 'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.3.0' },
                    body: { message: text },
                    json: true,
                    resolveWithFullResponse: true,
                    simple: false,
                    followRedirect: true,
                    followAllRedirects: true,
                    maxRedirects: 5
                };
                await getGemini(options, event);
            } else if (msgText.startsWith('中翻英')) {
                const text = msgText.slice(3).trim();
                const lang_options = {
                    uri: `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${process.env.yandexKey}&lang=zh-en&text=${encodeURIComponent(text)}`
                };
                await transLang(lang_options, event);
            } else if (msgText.startsWith('黃金')) {
                const times = Date.now() - 60000;
                const options = {
                    uri: `https://www.wantgoo.com/global/gold/realtimeprice-pricemin1?equalandafter=${times}`
                };
                await getPrice(options, event);
            } else if (msgText.startsWith('disc')) {
                const stock_price = msgText.slice(4).trim();
                await getDiscMsg(stock_price, event);
            } else if (msgText.startsWith('沖')) {
                const msg = `
                    當沖三不
                    不留目前倉超過該時段
                    手中不大量持倉
                    不要不作功課亂沖
                `;
                return event.reply(formatMsg(msg));
            } else if (msgText.startsWith('表')) {
                const msg = `
                    370~500→三檔
                    370~184→兩檔
                    184~100→一檔
                    100~75→三檔
                    74~50→兩檔
                    50~38→三檔
                    37~18→兩檔
                    18~11→一檔
                    10~3.7→兩檔
                    3.6 以下→一檔
                `;
                return event.reply(formatMsg(msg));
            } else if (msgText.startsWith('18+')) {
                const source_code = msgText.slice(3).trim();
                let pic_number = source_code.match(/\d/g).join('');
                const pic_code = source_code.match(/[a-z]/ig).join('');
                pic_number = pic_number.padStart(3, '0');
                const filekey = new dataflit(pic_code.toLowerCase());
                const fix_source_code = `${filekey.filename()}${pic_number}`;
                const dmm_options = {
                    uri: `https://pics.dmm.co.jp/digital/video/${fix_source_code}/${fix_source_code}ps.jpg`,
                    small: `https://pics.dmm.co.jp/digital/video/${fix_source_code}/${fix_source_code}ps.jpg`,
                    large: `https://pics.dmm.co.jp/digital/video/${fix_source_code}/${fix_source_code}pl.jpg`,
                    resolveWithFullResponse: true,
                    followRedirect: false
                };
                await getR18Image(dmm_options, event);
            } else if (msgText.startsWith('片片')) {
                const mv_keyword = msgText.slice(2).trim();
                const filter = `SEARCH("${mv_keyword}", {name})`;
                base('eighteen').select(
                {
                    maxRecords: 1,
                    view: 'Grid view',
                    filterByFormula: filter
                }).firstPage((err, records) => {
                    if (err || !mv_keyword) {
                        console.error(err);
                        return event.reply('沒有你要的資料，是不是太重口味了呢???');
                    }
                    records.forEach(record => event.reply([record.get('url'), record.get('name')]));
                });
            } else {
                switch (msgText) {
                    case '給我id':
                        return event.source.profile().then(profile => event.reply(`嗨 ${profile.displayName} 你要幹嘛!! ${profile.userId}`));
                    case '給我info':
                        return event.reply(JSON.stringify(event.source));
                    case 'bot滾':
                        if (event.source.roomId) {
                            return bot.post(`/room/${event.source.roomId}/leave/`).then(res => res.json());
                        }
                        return bot.post(`/group/${event.source.groupId}/leave/`).then(res => res.json());
                    case 'picture':
                        return event.reply({
                            type: 'image',
                            originalContentUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png',
                            previewImageUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png'
                        });
                    case 'location':
                        return event.reply({
                            type: 'location',
                            title: 'LINE Plus Corporation',
                            address: '別問我你在哪~~~',
                            latitude: 13.7202068,
                            longitude: 100.5298698
                        });
                    case 'confirm':
                        return event.reply({
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
                    case 'createmenu':
                        const data = {
                            size: {
                                width: 2500,
                                height: 1686
                            },
                            selected: false,
                            name: "Nice richmenu",
                            chatBarText: "Tap to open",
                            areas: [{
                                bounds: {
                                    x: 0,
                                    y: 0,
                                    width: 2500,
                                    height: 1686
                                },
                                action: {
                                    type: "postback",
                                    data: "action=buy&itemid=123"
                                }
                            }]
                        };
                        return bot.post('/richmenu', data).then(res => res.json());
                    case 'menu':
                        return bot.get('/richmenu/list').then(res => res.json());
                    case '指令':
                        return event.reply(['#關鍵字', 'yt關鍵字', '18+番號', '中翻英中文', 'stock{股號}']);
                    case '早知道':
                        return event.reply('股市深淵－－－沒有早知道（ ＴДＴ）');
                    case '幹':
                        const emoji = '🖕🖕🖕🖕';
                        return event.reply(`....請冷靜 ${emoji}`);
                    case '龍破斬':
                        return event.reply(['比黃昏還要昏暗的東西，比血液還要鮮紅的東西，在時間之流中出現吧！在您偉大的名下，我在這黑闇中起誓，把阻擋在我們前方，所有的愚蠢之物，集合你我之力，賜與他們平等的毀滅吧！', '🫸🏻🔥🐲'])
                    default:
                        break;
                }
            }
            break;
        case 'video':
            return event.reply('Nice movie!');
        case 'audio':
            return event.reply('Nice song!');
        case 'image':
            break;
        case 'location':
            break;
        case 'sticker':
            break;
        default:
            return event.reply(`Unknow message: ${JSON.stringify(event)}`);
    }
});

// line的各項動作綁定
bot.on('follow', event => event.reply(`follow: ${event.source.userId}`));

// 取消追隨
bot.on('unfollow', event => event.reply(`unfollow: ${event.source.userId}`));

//加入群組或聊天室
bot.on('join', event => {
    const joinid = event.source.groupId || event.source.roomId;
    event.reply(`join: ${joinid}`);
});

//離開群組或聊天室
bot.on('leave', event => {
    const leaveid = event.source.groupId || event.source.roomId;
    event.reply(`leave: ${leaveid}`);
});

bot.on('postback', event => event.reply(`postback: ${event.postback.data}`));

bot.listen('/webhook', process.env.PORT || 3333, () => {
    console.log('Example app listening on port 3333!')
})

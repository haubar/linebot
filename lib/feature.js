const rp = require('request-promise').defaults({ jar: true });
const airtable = require('airtable');

//************ 內部使用 ****************

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

// 最低手續費、交易費計算
const getDisc = (price) => {
    //大約計算
    return (parseFloat(price)) * 1000*0.2680/100
}

//檔位判斷
const getPart = (price) => {
    return (price < 10 ? 0.01 : price < 50 ? 0.05 : price < 100 ? 0.1 : price < 500 ? 0.5 : price < 1000 ? 1 : 5);
}

// *********** 外部呼叫 *************

const getInspiration = (event) => {
    const content = [
        "失敗乃成功之母。",
        "不經一事，不長一智。",
        "天道酬勤。",
        "有志者事竟成。",
        "千里之行，始於足下。",
        "學無止境。",
        "自助者天助。",
        "滴水穿石，非一日之功。",
        "讀萬卷書，行萬里路。",
        "機會是留給有準備的人。",
        "困難是成功的墊腳石。",
        "堅持就是勝利。",
        "逆境中成長。",
        "勇於挑戰自我。",
        "每一次挫折都是成長的機會。",
         "七転び八起き (ななころびやおき) - Fall seven times, stand up eight.",
        "一期一会 (いちごいちえ) - Treasure every encounter, for it will never recur.",
        "猿も木から落ちる (さるもきからおちる) - Even monkeys fall from trees.",
        "花鳥風月 (かちょうふうげつ) - Appreciating the beauty of nature.",
        "雨降って地固まる (あめふってじかたまる) - After the rain, the ground hardens.",
        "石の上にも三年 (いしのうえにもさんねん) - Perseverance prevails.",
        "笑う門には福来たる (わらうかどにはふくきたる) - Fortune comes to a merry home.",
        "初心忘るべからず (しょしんわするべからず) - Never forget your original intention.",
        "風林火山 (ふうりんかざん) - Swift as the wind, silent as a forest, fierce as fire, immovable as a mountain.",
        "温故知新 (おんこちしん) - Learn from the past to create new insights.",
        "The only way to do great work is to love what you do. - Steve Jobs",
        "In the middle of every difficulty lies opportunity. - Albert Einstein",
        "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
        "Believe you can and you're halfway there. - Theodore Roosevelt",
        "The best way to predict the future is to invent it. - Alan Kay",
    ];
    try {
        const randomIndex = Math.floor(Math.random() * content.length);
        return event.reply(content[randomIndex]);
    } catch (error) {   
        return event.reply('I dont fucking speak right now.');
        console.error(error);
    }
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
        // const message = JSON.parse(response).candidates[0].content.parts[0].text;
        const message = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        //   const message = JSON.stringify(response, null, 2);
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
            return event.reply(formatMsg(msg));
        } else {
            return event.reply('沒有這筆代號資料喲, 咩噗Q口Q');
        }
    } catch (err) {
        return event.reply('沒有這筆代號資料喲, 咩噗Q口Q');
    }
}


module.exports = {
    getIgImage,
    getFrImage,
    getYoutube,
    getR18Image,
    getWeather,
    getGemini,
    getPrice,
    getReport,
    transLang,
    getDiscMsg,
    getTick,
    formatMsg,
    getStock,
    getInspiration
};



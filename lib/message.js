const feature = require('./feature');
const dataflit = require('./dataflit');

const command_list = {
    'template': async (event) => {
           event.reply({
                type: 'template',
                altText: '這是一個確認範本',
                template: {
                    type: 'confirm',
                    text: '你確定要執行這個動作嗎？',
                    actions: [
                        { type: 'message', label: '是', text: '是' },
                        { type: 'message', label: '否', text: '否' }
                    ]
                }
            });
        },
     'button': async (event) => {
            event.reply({
                type: 'template',
                altText: '這是一個按鈕範本',
                template: {
                    type: 'buttons',
                    thumbnailImageUrl: 'https://images.pexels.com/photos/29780009/pexels-photo-29780009/free-photo-of-relaxed-orange-and-white-cat-basking-in-sunlight.jpeg', // 圖片 URL (可選)
                    title: '這是標題', // 標題 (可選)
                    text: '這是訊息內容', // 必填
                    actions: [
                        { type: 'postback', label: '按鈕1', data: 'action=buy&itemid=123' },
                        { type: 'message', label: '按鈕2', text: '按鈕2被點擊' },
                        { type: 'uri', label: '按鈕3', uri: 'https://kerker.in/' }
                    ]
                }
            }); 
     },
     'carousel': async (event) => {
        event.reply({
            type: 'template',
            altText: '這是一個圖文選單範本',
            template: {
                type: 'carousel',
                columns: [
                    {
                        thumbnailImageUrl: 'https://images.pexels.com/photos/10811957/pexels-photo-10811957.jpeg', // 圖片 URL
                        title: '第一張',
                        text: '第一張 的描述',
                        actions: [
                            { type: 'postback', label: '選擇', data: 'action=select&itemid=1' },
                            { type: 'uri', label: '查看', uri: 'https://kerker.in' }
                        ]
                    },
                    {
                        thumbnailImageUrl: 'https://images.pexels.com/photos/105819/pexels-photo-105819.jpeg',
                        title: '第二張',
                        text: '第二張 的描述',
                        actions: [
                            { type: 'postback', label: '選擇', data: 'action=select&itemid=2' },
                            { type: 'uri', label: '查看', uri: 'https://kerker.in/' }
                        ]
                    },
                    {
                        thumbnailImageUrl: 'https://images.pexels.com/photos/30159988/pexels-photo-30159988/free-photo-of-glowing-blue-jellyfish-in-underwater-ocean-scene.jpeg',
                        title: '第三張',
                        text: '第三張 的描述',
                        actions: [
                            { type: 'postback', label: '選擇', data: 'action=select&itemid=3' },
                            { type: 'uri', label: '查看', uri: 'https://kerker.in/' }
                        ]
                    }
                ]
            }
        });
     },
     'imagemap': async (event) => {
        event.reply({
            type: 'imagemap',
            baseUrl: 'https://images.pexels.com/photos/14267216/pexels-photo-14267216', // 圖片 URL (不包含副檔名)
            altText: '這是一個圖文訊息',
            baseSize: { width: 1040, height: 1040 }, // 圖片大小
            actions: [
                {
                    type: 'uri',
                    linkUri: 'https://kerker.in/',
                    area: { x: 0, y: 0, width: 520, height: 520 }
                },
                {
                    type: 'message',
                    text: '點擊了區塊 2',
                    area: { x: 520, y: 0, width: 520, height: 520 }
                }
            ]
        });
     },
     'flex': async (event) => {
        event.reply({
            type: 'flex',
            altText: '這是一個 Flex 訊息',
            contents: {
                type: 'bubble',
                hero: {
                    type: 'image',
                    url: 'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg',
                    size: 'full',
                    aspectRatio: '20:13',
                    aspectMode: 'cover'
                },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: '標題',
                            weight: 'bold',
                            size: 'xl'
                        },
                        {
                            type: 'box',
                            layout: 'baseline',
                            margin: 'md',
                            contents: [
                                { type: 'text', text: '描述', size: 'sm', color: '#999999' }
                            ]
                        }
                    ]
                },
                footer: {
                    type: 'box',
                    layout: 'vertical',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'button',
                            style: 'primary',
                            action: { type: 'uri', label: '查看', uri: 'https://kerker.in' }
                        }
                    ]
                }
            }
        });
     },
    'test': async (event) => event.reply("TEST"),
    '三大法人': async (event) => feature.getReport('ALL', event),
    '凱基': async (event) => event.reply('https://fubon-ebrokerdj.fbs.com.tw/z/zg/zgb/zgb0.djhtm?a=9200&b=9268&c=B&d=1'),
    '盤後': async (event) => event.reply('https://fubon-ebrokerdj.fbs.com.tw/Z/ZG/ZGB/ZGB.djhtm'),
    '沖': async (event) => {
        const msg = [
            "當沖三不",
            "不留目前倉超過該時段",
            "手中不大量持倉",
            "不要不作功課亂沖"
        ];
        return event.reply(mutiple_message(msg));
    },
    '表': async (event) => {
        const msg = [
            "370~500→三檔",
            "370~184→兩檔",
            "184~100→一檔",
            "100~75→三檔",
            "74~50→兩檔",
            "50~38→三檔",
            "37~18→兩檔",
            "18~11→一檔",
            "10~3.7→兩檔",
            "3.6 以下→一檔",
    ];
        return event.reply(mutiple_message(msg));
    },
    // '指令': async (event) => event.reply(['#關鍵字', 'yt關鍵字', '18+番號', '中翻英中文', 'stock{股號}']),
    //顯示全部程式指令
    '指令': async (event) => {
        const msg = [   
            '##關鍵字：Flickr圖片搜尋',
            '#關鍵字：Instagram圖片搜尋',
            'yt關鍵字：YouTube影片搜尋',
            'ai{問題}：AI問答（Google Gemini）',
            '18+番號：番號片片封面搜尋',
            'stock{股號}：股票即時資訊',
            '天氣{地區}：即時天氣查詢',
            '三大法人：查詢三大法人買賣超',
            '凱基：凱基投顧盤後資訊',
            '盤後：盤後資訊查詢',
            '沖：當沖三不',
            '表：股票買賣表',
            '早知道：股市深淵',
            '幹：請冷靜',
            '呷賽：賀呷',
            '十二恨：劍君十二恨',
            '狂刀：亂世狂刀',
            '一頁書：一頁書',
            '壓力大：給你加油打氣',
            '龍破斬：龍破斬咒語',
            'inspire：隨機勵志名言',
            '噴水：噴水',
            '西瓜：西瓜',
        ];
        return event.reply(mutiple_message(msg));
    },
    '早知道': async (event) => event.reply('股市深淵－－－沒有早知道（ ＴДＴ）'),
    '幹': async (event) => event.reply(`....請冷靜 🖕🖕🖕🖕`),
    '呷賽': async (event) => event.reply(`....賀呷 💩💩💩💩`),
    '十二恨': async (event) => event.reply(mutiple_message([
        "一恨才人無行",
        "二恨紅顏薄命",
        "三恨江浪不息",
        "四恨世態炎冷",
        "五恨月台易漏",
        "六恨蘭葉多焦", 
        "七恨河豚甚毒",
        "八恨架花生刺",
        "九恨夏夜有蚊", 
        "十恨薜蘿藏虺",
        "十一恨未食敗果", 
        "十二恨天下無敵",
    ])),
    '狂刀': async (event) => event.reply(mutiple_message([
        "慕容嬋啊∼"  
    ])),
    '噴水': async (event) => event.reply('🐳 🐳 🐳 🐳 🐳 🐳'),
    '一頁書': async (event) => event.reply(mutiple_message([
        "世事如棋，乾坤莫測，笑盡英雄啊啊啊",
    ])),
    '西瓜': async (event) => event.reply(mutiple_message([
        "風吹風吹~ 風中呷西瓜~ 🍉🍉🍉",
    ])),
    '壓力大': async (event) => event.reply('壓力大就對了，沒有壓力的人生才可怕！💪💪💪'),
    '龍破斬': async (event) => event.reply([
        '比黃昏還要昏暗的東西，比血液還要鮮紅的東西，在時間之流中出現吧！在您偉大的名下，我在這黑闇中起誓，把阻擋在我們前方，所有的愚蠢之物，集合你我之力，賜與他們平等的毀滅吧！',
        '🫸🏻🔥🐲'
    ]),
    'inspire': async (event) => {
        return feature.getInspiration(event);
    },

    // 前綴判斷
    '##': async (event, msgText) => {
        const keyword = msgText.slice(1).trim();
        const encode_tag = encodeURIComponent(keyword);
        const options = {
            uri: `https://www.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1&tags=${encode_tag}`,
            json: true
        };
        return feature.getFrImage(options, event);
    },
    '#': async (event, msgText) => {
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
        return feature.getIgImage(ig_options, event);
    },
    'yt': async (event, msgText) => {
        const yt_keyword = msgText.slice(2).trim();
        const encode_keyword = encodeURIComponent(yt_keyword);
        const yt_options = {
            uri: `https://www.googleapis.com/youtube/v3/search?key=${process.env.youtubeToken}&q=${encode_keyword}&type=video&part=snippet`,
            json: true
        };
        return feature.getYoutube(yt_options, event);
    },
    'ai': async (event, msgText) => {
        const keyword = msgText.slice(2).trim();
        const options = {
                    method: 'POST',
                    uri: 'https://script.google.com/macros/s/AKfycbyYM5gyVv9O8sngZpCHuNAmbX9mBR0gvQcpmTfbLdQu7xz3SKllTqErJHj_KuoJuEhDhQ/exec',
                    headers: { 'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.3.0' },
                    body: { message: keyword },
                    json: true,
                    resolveWithFullResponse: true,
                    simple: false,
                    followRedirect: true,
                    followAllRedirects: true,
                    maxRedirects: 5
                };
        await feature.getGemini(options, event);
    },
    'stock': async (event, msgText) => {
        const stock_id = msgText.slice(5).trim();
        return feature.getStock(stock_id, event);
    },
    '天氣': async (event, msgText) => {
        const area = msgText.slice(2).trim();
        const weather_options = {
            uri: `https://api.apixu.com/v1/current.json?key=${process.env.weatherKey}&q=${area}&lang=zh_tw`
        };
        return feature.getWeather(weather_options, event);
    },
    '18+': async (event, msgText) => {
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
        return feature.getR18Image(dmm_options, event);
    }
};

// 定義指令比對的功能
async function output_message(event) {
    const msgText = event.message.text;

    // 比對輸入的指令與define command
    for (const [command, handler] of Object.entries(command_list)) {
        if (msgText.trim().startsWith(command)) {
            return handler(event, msgText.trim());
        } 
        // return handler(event, 'inspire');       
    }
     //沒有符合的指令就inspire回應
    return command_list['inspire'](event);
    
    // return event.reply(`Unknown command: ${msgText}`);
}

const mutiple_message = (msg) => {
    if (Array.isArray(msg)) {
        return `${msg.join("\n")}`;
    } else {
        return `${msg}`;
    }
}

module.exports = { output_message };




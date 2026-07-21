const linebot = require('./index.js');
const storage = require('./lib/storage');

const bot = linebot({
    channelId: process.env.channelId,
    channelAccessToken: process.env.accessToken,
    channelSecret: process.env.channelSecret,
    verify: true // default=true
});

// 必須在 require('./lib/message') 之前 export，
// 因為 lib/message -> lib/feature 會 require('../webhook') 拿 bot 實例，
// 若晚 export，feature.js 拿到的會是還沒賦值的空物件（循環參照的時序問題）
module.exports = bot;

const { output_message } = require('./lib/message');

//接受訊息的動作判斷
bot.on('message', async (event) => {
    switch (event.message.type) {
        case 'text':
            return output_message(event);
        case 'video':
            return output_message(event);
        case 'audio':
            return output_message(event);
        case 'image':
            return output_message(event);
        case 'file':
            return output_message(event);
        case 'location':
            return event.reply('No yet support map');
        case 'sticker':
            return event.reply('No yet support sticker');
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

// 定期清理 tmp/ 裡超過 7 天的媒體檔案，避免磁碟被塞滿
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
storage.cleanupOldMedia();
setInterval(() => storage.cleanupOldMedia(), ONE_DAY_MS);

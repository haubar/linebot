const linebot = require('./index.js');

const { handleMessage } = require('./botSwitchHandler');




const bot = linebot({
    channelId: process.env.channelId,
    channelAccessToken: process.env.accessToken,
    channelSecret: process.env.channelSecret,
    verify: true // default=true
});

//接受訊息的動作判斷
bot.on('message', async (event) => {
    switch (event.message.type) {
        case 'text':
            return handleMessage(event);
        case 'video':
            return event.reply('No yet support movie');
        case 'audio':
            return event.reply('No yet support song');
        case 'image': 
            return event.reply('No yet support image');
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

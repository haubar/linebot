const linebot = require('./index.js');
const { output_message, getContent }  = require('./lib/message');


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
            return output_message(event);
        case 'video':
            return output_message(event);
        case 'audio':
            return output_message(event);
        case 'image': 
            let buffer = getContent(event);
            // let buffer = bot.getMessageContent(event.message.id);
            return event.reply(buffer);
            // return event.reply(buffer.toString('base64'));
          
            // return event.reply("99887777");
            
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

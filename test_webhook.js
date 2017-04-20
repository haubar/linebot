'use strict'
require('dotenv').config()
const line = require('./index')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
var dismes = null

// need raw buffer for signature validation
app.use(bodyParser.json({
  verify (req, res, buf) {
    req.rawBody = buf
  }
}))

// init with auth
line.init({
  accessToken: process.env.accessToken,
  // (Optional) for webhook signature validation
  channelSecret: process.env.channelSecret
})

/**
 * response example (https://devdocs.line.me/ja/#webhook):
 * {
 *   "events": [
 *     {
 *       "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
 *       "type": "message",
 *       "timestamp": 1462629479859,
 *       "source": {
 *         "type": "user",
 *         "userId": "u206d25c2ea6bd87c17655609a1c37cb8"
 *       },
 *       "message": {
 *         "id": "325708",
 *         "type": "text",
 *         "text": "Hello, world"
 *       }
 *     }
 *   ]
 * }
 */

app.post('/webhook/', line.validator.validateSignature(), (req, res, next) => {
  // get content from request body
  const promises = req.body.events.map(event => {
    if (event.type === 'follow') {
      // do something when your bot account is added as a friend
      return Promise.resolve()
    } else if (event.type === 'message') {
      switch (event.message.type) {
        case 'text':
           dismes =  '你為何要跟我說'+event.message.text+'我不想聽!!';
        break;
        case 'image':
           dismes =  '想色誘我嗎?太天真了!';
        break;
        case 'sticker':
           dismes = '我不想看這個, 給'+event.source.profile.displayName+'看就好...';
        break;
        // case 'location':
        //    dismes = '我不想看這個, 給'+displayName+'看就好...';
        // break;
        case 'audio':
           dismes = '拒絕肉片，你我有責!';
        break;

        default: dismes = '你為何要跟我說'+event.message.text+'我不想聽!!';
          break;
      }

      return line.client
        .replyMessage({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: dismes
            }
          ]
        })
      return Promise.resolve()
    } else {
      
      return Promise.resolve()
    }

  })
  Promise
    .all(promises)
    .then(() => res.json({success: true}))
})

app.listen(process.env.PORT || 3333, () => {
  console.log('Example app listening on port 3333!')
})

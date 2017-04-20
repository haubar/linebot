'use strict'
require('dotenv').config()
const line = require('./index')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

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
    return line.client
      .replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: '你為何要跟我說'+event.message.text+'我不想聽!!'
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

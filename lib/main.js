

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

function getPrice(options, event) {
    rp(options).then(function(response) {
        let res = JSON.parse(response)
        console.log(res)
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

function getStock(stock_id, event) {
    let stock_tse = {
       uri: 'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_'+stock_id+'.tw&json=1&delay=0'
    }
    let stock_otc = {
       uri: 'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=otc_'+stock_id+'.tw&json=1&delay=0'
    }
    
    rp(stock_tse).then(function(response) {
        let res = JSON.parse(response)
        let info = res.msgArray[0]
        if(!!info){
            let name = '名稱:'+info.nf
            let hight = '最高價:'+info.h
            let low = '最低價:'+info.l
            let now_qty = '當盤成交量:'+info.tv
            let all_qty = '累積成交量:'+info.v
            let buy_num = (info.b).split("_", 1)
            let now_buy = '現買價:'+ buy_num
            let now_sell = '現賣價:'+ (info.a).split("_", 1)
            let disc = '最低手續費用計算:'+ (parseFloat((info.b).split("_", 1))*1000*0.2697/100)
            let tick = getick(buy_num)
            let msg = name +" \n"+ now_buy +" \n"+ now_sell +" \n"+ hight +" \n"+low+" \n"+now_qty+" \n"+all_qty+" \n"+disc+" \n" + tick
            return event.reply(msg)
        }else{
            rp(stock_otc).then(function(response) {
                let res = JSON.parse(response)
                let info = res.msgArray[0]
                if(!!info){
                    let name = '名稱:'+info.nf
                    let hight = '最高價:'+info.h
                    let low = '最低價:'+info.l
                    let now_qty = '當盤成交量:'+info.tv
                    let all_qty = '累積成交量:'+info.v
                    let buy_num = (info.b).split("_", 1)
                    let now_buy = '現買價:'+ buy_num
                    let now_sell = '現賣價:'+ (info.a).split("_", 1)
                    let disc = '最低手續費用計算:'+ (parseFloat((info.b).split("_", 1))*1000*0.2697/100)
                    let tick = getick(buy_num)
                    let msg = name +" \n"+ now_buy +" \n"+ now_sell +" \n"+ hight +" \n"+low+" \n"+now_qty+" \n"+all_qty+" \n"+disc+" \n"+ tick
                    return event.reply(msg)
                } else {
                    return event.reply('沒有這筆代號資料喲, 咩噗Q口Q')
                }
            }).catch(function (err) {
                return event.reply('沒有這筆代號資料喲, 咩噗Q口Q')
            })
        }
    }).catch(function (err) {
        return event.reply('沒有這筆代號資料喲, 咩噗Q口Q')
        
        /*
        
        */
        
    })
}

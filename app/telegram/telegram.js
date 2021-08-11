var telegram = require('telegram-bot-api');
const HOST = 'https://stock-analysis-3k.herokuapp.com/'
const TOKEN = '1545978004:AAHpuhtFWib_TvR5hUZ-wz2vvOIA2v4n3Gw'
var CHAT_ID = -408895188

function sendMessage(data, pattern) {
    try {
        var captionText = `${data.stockCode} ${data.price}(${data.change} ${data.perChange}%) ${pattern}`;
        var api = new telegram({
            token: TOKEN,
            updates: {
                enabled: true,
                get_interval: 1000
            }
        });

        api.sendMessage({
            chat_id: CHAT_ID,
            text: 'aaa'
        }).catch(err => {console.log(err)})

        // api.sendPhoto({
        //     chat_id: CHAT_ID,
        //     caption: captionText,
        //     photo: HOST + stockCode + '.png'
        // })
        //     .then(function (data) {
        //         console.log(data);
        //     })
    } catch (err) {
        console.log(err);
    }
}

const TG = require('telegram-bot-api/lib/index')
function getUpdate() {
    const api = new TG({
        token: TOKEN
    })

    api.setMessageProvider(new TG.GetUpdateMessageProvider())
    api.start()
        .then(() => {
            console.log('API is started')
        })
        .catch(console.err)

    api.on('update', (update) => {
        const chat_id = update.message.chat.id

        var message = update.message.text
        if (message.includes('check')) {
            callStock(message.split(' ')[1])
        }
    })
}

function sendMessage(message) {
    try {
        var api = new telegram({
            token: TOKEN,
            updates: {
                enabled: true,
                get_interval: 1000
            }
        });

        api.sendMessage({
            chat_id: CHAT_ID,
            text: message
        })
            .then(function (data) {
                console.log(data);
            })
    } catch (err) {
        console.log(err);
    }
}

function callStock(code) {
    var request = require('request');
    var url = 'https://stock-analysis-3k.herokuapp.com/stock/';
    var paramsObject = { 'stockCode': code };

    request({ url: url, qs: paramsObject }, function (err, response, body) {
        if (err) { console.log(err); return; }
        console.log("Response: " + JSON.parse(response.body).pattern);
        if(JSON.parse(response.body).pattern == ""){
            sendMessage(`[${code}] no pattern found`);
        }
    });
}

exports.sendMessage = sendMessage
exports.getUpdate = getUpdate
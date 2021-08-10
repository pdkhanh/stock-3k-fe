var request = require("request");
var dateFormat = require('dateformat');

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};

var today = dateFormat(new Date(), "yyyy-mm-dd");

var dayMinus30 = new Date(); 
dayMinus30.setDate(dayMinus30.getDate() - 30);
dayMinus30 = dateFormat(dayMinus30, "yyyy-mm-dd");

function getStockData(stockID) {
    return new Promise(function (resolve, reject) {
        URL = `https://finance.vietstock.vn/data/KQGDThongKeGiaStockPaging?page=1&pageSize=20&catID=1&stockID=${stockID}&fromDate=${dayMinus30}&toDate=${today}`;
        console.log(URL)
        request({
            url: URL,
            method: "GET",
            headers: headers,
            json: true,
        }, function (error, response, body) {
            resolve(getData(response.body[1]))
            if(error) reject(error)
        })
    });
}

function getData(body){
    try{
        open = []
        close = []
        high = []
        low = []
        body.forEach(element => {
            stockCode = element['StockCode']
            open.push(element['OpenPrice'])
            close.push(element['ClosePrice'])
            high.push(element['HighestPrice'])
            low.push(element['LowestPrice'])
        });
        
        var data = {
            'stockCode': stockCode,
            'stockName': body[1].StockName,
            'date': today,
            'price': body[0].ClosePrice,
            'change': body[0].Change,
            'perChange': body[0].PerChange,
            'mTotalVol': body[0].M_TotalVol,
            'marketCap': body[0].MarketCap, 
        }
        for (let index = 1; index < 31; index++) {
            data[`dayInput${index}`] = {
                'open':open.slice(0,index).reverse(),
                'high':high.slice(0,index).reverse(),
                'close':close.slice(0,index).reverse(),
                'low':low.slice(0,index).reverse(),
             }
        }
        return data
    }catch(err){
        console.log(body)
    }
}

exports.getData = getData;
exports.getStockData = getStockData;


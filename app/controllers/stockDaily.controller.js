const { lowest } = require("technicalindicators");
const db = require("../models");
const vietstock = require("../vietstock/vietstock.js")
const StockDaily = db.StockDaily;
var indicator = require("../indicator/indicator.js")

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Create a Tutorial
    const stockDaily = new StockDaily({
        date: req.body.date,
        stock: req.body.stock
    });

    // Save Tutorial in the database
    stockDaily
        .save(stockDaily)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

exports.findStock = async (req, res) => {
    let stockList = require('../../stock-code.json');
    stockList.data.forEach(e => findPattern(e.StockID))
    res.send('OK')
};

async function findPattern(stockId){
    let stock
    let data = await vietstock.getStockData(stockId);
    if(data.mTotalVol < 100000) return
    let indicatorResult = indicator.scanCandlestick(data)
    if(indicatorResult.pattern.length > 0 ) {
        stock = {
            code: data.stockCode,
            name: data.stockName,
            date: data.date,
            price: data.price,
            change: data.change,
            perChange: data.perChange,
            mTotalVol: data.mTotalVol,
            marketCap: data.marketCap,
            image: indicatorResult.image,
            pattern: indicatorResult.pattern,
        }
        saveStockPattern(stock)
    }

}

function saveStockPattern(data){
    const stockDaily = new StockDaily({
        date: data.date,
        code: data.code,
        name: data.name,
        price: data.price,
        change: data.change,
        perChange: data.perChange,
        mTotalVol: data.mTotalVol,
        ptTotalVol: data.ptTotalVol,
        image: data.image,
        marketCap: data.marketCap,
        pattern: data.pattern
    });
    stockDaily
        .save(stockDaily)
}

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const date = req.query.date;
    var condition = date ? { date: { $regex: new RegExp(date), $options: "i" } } : {};
  
    StockDaily.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {

};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};
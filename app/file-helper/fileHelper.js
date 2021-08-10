var drawCandleStick = require('draw-candlestick');
var fs = require('fs');

function writeImage(stockCode, dayInput){
    console.log(dayInput)
    var fileImageName = `./output/${stockCode}.png`;
    var imageBuffer = drawCandleStick(dayInput);

    // fs.writeFile(fileImageName, imageBuffer, function (err) {
    //     if (err) throw err;
    // });
    return imageBuffer
}

function writePatternResult(data, pattern){
    var resultFileName = `./output/result.txt`;
    var result = `\n${data.stockCode}\t${data.price}(${data.change} ${data.perChange}%)\t${pattern}`
    fs.appendFileSync(resultFileName, result, function (err) {
        if (err) throw err;
    });
}

exports.writeImage = writeImage;
exports.writePatternResult = writePatternResult;
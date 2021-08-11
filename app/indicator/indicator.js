var technicalindicators = require('technicalindicators');
var fileHelper = require('../file-helper/fileHelper')

function scanCandlestick(data) {
    try {
        var pattern = [];
        var image
        var oneDayInput = data.dayInput1
        var twoDayInput = data.dayInput2;
        var threeDayInput = data.dayInput3;
        var fiveDayInput = data.dayInput5

        technicalindicators.abandonedbaby(threeDayInput) ? pattern.push('AbandonedBaby') : "";
        technicalindicators.bearishengulfingpattern(twoDayInput) ? pattern.push('bearishengulfingpattern') : "";
        technicalindicators.bullishengulfingpattern(twoDayInput) ? pattern.push('bullishengulfingpattern') : "";
        technicalindicators.darkcloudcover(twoDayInput) ? pattern.push('darkcloudcover') : "";
        technicalindicators.threeblackcrows(threeDayInput) ? pattern.push('threeblackcrows') : "";
        technicalindicators.threewhitesoldiers(threeDayInput) ? pattern.push('threewhitesoldiers') : "";
        technicalindicators.hangingman(fiveDayInput) ? pattern.push('hangingman') : "";
        technicalindicators.shootingstar(fiveDayInput) ? pattern.push('shootingstar') : "";
        technicalindicators.morningdojistar(threeDayInput) ? pattern.push('morningdojistar') : "";
        technicalindicators.morningstar(threeDayInput) ? pattern.push('morningstar') : "";
        technicalindicators.tweezertop(fiveDayInput) ? pattern.push('tweezertop') : "";
        technicalindicators.tweezerbottom(fiveDayInput) ? pattern.push('tweezerbottom') : "";

        technicalindicators.hammerpattern(fiveDayInput) ? pattern.push('hammer') : "";
        technicalindicators.dragonflydoji(oneDayInput) ? pattern.push('dragonflydoji') : "";

        if (pattern.length > 0) {
            image = fileHelper.writeImage(data.stockCode, data.dayInput12);
            // fileHelper.writePatternResult(data, pattern);
        }

        var result = {
            image: image,
            pattern: pattern
        }
        return result;
    } catch (err) {
        console.log(err)
        console.log('data: ' + data)
    }
}

exports.scanCandlestick = scanCandlestick;
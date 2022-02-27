let stocks = [];

const yourDate = new Date()
let date = yourDate.toISOString().split('T')[0]
initDate()

function initDate() {
    let url = new URL(window.location.href)
    let searchDate = url.searchParams.get('date')
    console.log(searchDate)
    date = searchDate ? searchDate : date
    document.getElementById('date').value = date
}

function setDate() {
    loadSpinner(true)
    date = document.getElementById('date').value
    let table = document.querySelector("#chartTable")
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
    rock()
}

async function loadData() {
    const response = await fetch(`https://stock-3k-be.herokuapp.com/api/stockDaily?date=${date}`, { mode: 'cors' });
    stocks = await response.json();
}

async function createChart() {
    stocks.forEach(stock => {
        createChartContainer(stock);
    });
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function createChartContainer(stock) {
    var dataTable = anychart.data.table();
    dataTable.addData(stock.daily);

    var mapping = dataTable.mapAs({ 'open': 1, 'high': 2, 'low': 3, 'close': 4, 'volume': 5 });
    var chart = anychart.stock();
    var series = chart.plot(0).candlestick(mapping);
    series.name("Price");
    // var title = chart.title();
    // title.enabled(true);
    // title.fontWeight("bold")
    // title.text(stock.code + '\n' + stock.name);


    var pricePlot = chart.plot(0);
    pricePlot.height(400)
    var ema9 = pricePlot.ema(mapping, 9).series();
    ema9.stroke('green');

    var ema20 = pricePlot.ema(mapping, 20).series();
    ema20.stroke('red');
    var indicatorPlot = chart.plot(1);
    var macdIndicator = indicatorPlot.macd(mapping);
    var indicatorSeries = macdIndicator.macdSeries();
    indicatorSeries.stroke("red");

    chart.scroller(false)
    var volumePlot = chart.plot(2);
    var volumeMa = volumePlot.volumeMa(mapping, 9, "sma", "column", "line");
    volumeMa.volumeSeries().fallingFill("red");
    volumeMa.volumeSeries().fallingStroke("red");
    volumeMa.volumeSeries().risingFill("green");
    volumeMa.volumeSeries().risingStroke("green");

    // modify the color of candlesticks making them black and white
    series.fallingFill("red");
    series.fallingStroke("red");
    series.risingFill("green");
    series.risingStroke("green");
    // set the container id
    chart.container(stock.code);

    // draw the chart
    chart.draw();
    return chart
}

function isEven(number) {
    return number % 2 === 0
}

function createInfoDiv(stock) {
    let mainDiv = document.createElement("div")

    let stockInfoDiv = document.createElement("div")
    // stockInfoDiv.innerText = stock.code + " - " + stock.name + "\n"
    stockInfoDiv.innerText = stock.code + "\n"
    stockInfoDiv.className = "info"

    let priceInfoP = document.createElement("p")
    priceInfoP.innerText = `${addCommas(stock.price)} (${stock.change} ${stock.perChange}%) - ${addCommas(stock.mTotalVol)}`
    priceInfoP.className = getPricePerChangeColor(stock.perChange)

    let patternDiv = document.createElement("div")
    patternDiv.textContent = stock.pattern
    patternDiv.className = "px-2 inline-flex text-lg text-mid leading-5 font-semibold rounded-full bg-green-100 text-green-800"

    stockInfoDiv.append(priceInfoP)
    mainDiv.append(stockInfoDiv)
    mainDiv.append(patternDiv)
    return mainDiv
}

function getPricePerChangeColor(perChange) {
    if (perChange >= 6.5) return "pricePurple"
    if (perChange > 0) return "priceGreen"
    if (perChange == 0) return "priceOrange"
    if (perChange < 6.5) return "priceRed"
    return "priceBlue"
}

async function addChart() {
    let table = document.querySelector("#chartTable")
    let tr
    let count = 0
    stocks.forEach(stock => {
        if (isEven(count)) {
            tr = document.createElement("tr")
        }
        // let info = document.createElement("div");
        // info.textContent = stock.pattern
        // info.className = "px-2 inline-flex text-lg text-mid leading-5 font-semibold rounded-full bg-green-100 text-green-800"
        let tdChart = document.createElement("td")
        let chartDiv = document.createElement("div")
        chartDiv.id = stock.code
        chartDiv.className = "chart"

        tdChart.append(createInfoDiv(stock))
        tdChart.append(chartDiv)
        tr.append(tdChart)
        table.append(tr)
        count++
    });
}

async function loadSpinner(display) {
    let spinner = document.querySelector('.orbit-spinner')
    let cssDisplay = display ? 'block' : 'none'
    spinner.style.setProperty("--is-display", cssDisplay);
}

async function rock() {
    await loadSpinner(true)
    await loadData()
    await addChart()
    await createChart()
    await loadSpinner(false)
}

rock()
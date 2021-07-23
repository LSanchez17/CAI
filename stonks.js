/*
*  Data comes in as follows, Date, Open, High, Low, Close, Volume   
*  Parse it, and return these questions answered in a new .txt file
*  What day had the largest variance between High and Low
*  What was the average volume for July 2012 
*  What is the max profit potential per share? 
*  What day(s) would you have had to buy low and sell high to get max profit
*/
const csvToJson = require('csvtojson');
const fs = require('fs');

const main = async ([txtFile]) => {
    // console.log(txtFile)

    //Read up on TSVs, had some knowledge of CSV parsing and data manipulation 
    //from some older tinkering.  csvToJson is a neat library to using different types
    //tab delimited, so \t
    const stocks = await csvToJson({delimiter:'\t'}).fromFile(txtFile);
    /* 
            Structured like so
            {
                Date: '18-Jun-12',
                Open: '133.59',
                High: '134.73',
                Low: '133.28',
                Close: '134.43',
                Volume: '29353246'
            }
    */

    let largestVarianceDate = new Set();
    let priceVariance = 0;
    let averageVolume = 0;
    let julyCount = 0;
    let julyRegex = new RegExp('([0-9]{1,}\-Jul\-[0-2]{2,})');

    for(let stockData of stocks){
        //O(n), n being the size of the data set
        //achieved through ~O(1) access time through objects
        let currentVariance = (parseFloat(stockData.High) - parseFloat(stockData.Low)).toFixed(2);


        if(currentVariance > priceVariance){
            largestVarianceDate.clear();
            largestVarianceDate.add(stockData.Date);
            priceVariance = currentVariance;
        }

        if(julyRegex.test(stockData.Date)){
            julyCount++;
            averageVolume += parseInt(stockData.Volume);
        }

    }

    averageVolume = (averageVolume/julyCount).toFixed(2);

    let maxProfit = findBiggestGains(stocks);
    writeAnswers(largestVarianceDate, averageVolume, maxProfit);

    return;
}

const findBiggestGains = (stockData) => {
    //fast access, and key value for ease of writing
    let maxProfitValue = new Map();

    //array is backwards when read by parsers
    //array runs from earliest date possible, and compares to itself and the rest of the years
    //since you cant buy a stock in the future and sell it in the past
    //O(n^2), could be improved to O(n log n) through use of pointers, but could become hard to read and maintain
    //Finding the initial highest point could save some time, but worst case scenario is the highest point is at the beginning, which
    //means we still have to search the entire array.
    for(let i=stockData.length-1; i>-1; i--){
        let currentLow = parseFloat(stockData[i].Low);
        let dateOfLow = stockData[i].Date;
        let optimalProfit = 0;
        let dateOfHigh = '';
        let currentHigh = 0;

        for(let j=i; j>-1; j--){
            let todaysHigh = parseFloat(stockData[j].High);

            if(currentHigh < todaysHigh){
                currentHigh = todaysHigh;
                dateOfHigh = stockData[j].Date;
            }
        }

        optimalProfit = (currentHigh - currentLow).toFixed(2);

        //Has this profit for this share combination been seen
        if(!maxProfitValue.has(optimalProfit)){
            maxProfitValue.set(optimalProfit, [dateOfLow, dateOfHigh]);
        }
    }

    return maxProfitValue;
}

const writeAnswers = (largestVarianceDate, averageVolume, maxProfit) => {
    let answers = [];

    answers.push(`The largest variance occured on ${largestVarianceDate.values().next().value}`);
    answers.push(`The average volume in July was 2012 was ${averageVolume} shares`);
    maxProfit.forEach((profit, idx) => {
        if(profit[0] === profit [1]){
            answers.push(`The potential profit for this share is $${idx}, and is achieved by buying low and sellig high on the same day`)
        }
        answers.push(`The potential profit for a share bought on ${profit[0]} is $${idx} when it is sold on ${profit[1]}`);
    });

    //now write file with answers;
    const writingModule = fs.createWriteStream('./answersLuisSanchez.txt', {
        flags: 'a'
    });

    try{
        for(let data of answers){
            writingModule.write(data + '\r\n');
        }
    }
    catch(err){
        console.error(err);
    }

    console.log('File written successfully!')
    
    return;
}

//call function from CLI
main(process.argv.slice(2));

exports.main = main;
exports.findBiggestGains = findBiggestGains;
exports.writeAnswers = writeAnswers;
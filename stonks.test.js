const stonks = require('./stonks');

describe('Testing the stock analysis application', () => {
    it('tests the main function reading a file correctly', () => {
        let commanLineArgs = ['test', 'stocks.txt'];
        let expectedOutput = undefined;
        let functionOutput = stonks.main(commanLineArgs);

        expect(functionOutput).not.toBe(expectedOutput);
    });

    it('tests the findBiggestGains', () => {
        let stockGains = [
            {Date:'3-Jan-12', Open:'150', High:'155', Low:'144', Close:'152', Volume:'123123'}, 
            {Date:'2-Jan-12', Open:'151', High:'152', Low:'150', Close:'151.50', Volume:'53453'}, 
            {Date:'1-Jan-12', Open:'150', High:'154', Low:'151', Close:'152', Volume:'234234'}];

        let output = new Map();
        output.set('4.00', ['1-Jan-12', '3-Jan-12']);
        output.set('5.00', ['2-Jan-12', '3-Jan-12']);
        output.set('11.00', ['3-Jan-12', '3-Jan-12']);

        let functionOutPut = stonks.findBiggestGains(stockGains);

        expect(functionOutPut).toEqual(output);
    });

    it('writes a small txt file with data', () => {
        let variance = new Set();
        variance.add('3-Jan-12');

        let volume = 10;
        let maxProfit = new Map();

        maxProfit.set('4.00', ['1-Jan-12', '3-Jan-12']);
        maxProfit.set('5.00', ['2-Jan-12', '3-Jan-12']);
        maxProfit.set('11.00', ['3-Jan-12', '3-Jan-12']);

        let answer = undefined;
        let finalCall = stonks.writeAnswers(variance, volume, maxProfit);

        expect(answer).toBe(finalCall);
    })


})
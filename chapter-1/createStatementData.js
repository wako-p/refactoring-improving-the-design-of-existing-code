
class PerformanceCalculator {

    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play        = aPlay;
    }

    get amount() {

        let result = 0;

        switch (this.play.type)
        {
            case "tragedy":
                throw `想定外の呼び出し`;

            case "comedy":
                throw `想定外の呼び出し`

            default:
                throw new Error(`unknown type: ${ this.performance.play.type }`);
        }

        return result;
    }

    get volumeCredits() {

        let result = 0;

        result += Math.max(this.performance.audience - 30, 0);

        if (this.play.type === "comedy") {
            result += Math.floor(this.performance.audience / 5);
        }

        return result;
    }
}

class TragedyCalculator extends PerformanceCalculator {

    get amount() {

        result = 40000;

        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }

        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {

    get amount() {

        result = 30000;

        if (this.performance.audience > 20) {
            result += 10000 + (500 * (this.performance.audience - 20));
        }
        result += 300 * this.performance.audience;

        return result;
    }
}

export default function createStatementData(invoice, plays) {

    const statementData = {};

    statementData.customer           = invoice.customer;
    statementData.performances       = invoice.performances.map(enrichPerformance(performance));
    statementData.totalAmount        = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);

    return statementData;

    function enrichPerformance(aPerformance) {

        const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
        const result     = Object.assign({}, aPerformance);

        result.play          = calculator.play;
        result.amount        = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;

        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function totalAmount(data) {

        let result = 0;

        for (let performance of data.performances) {
            result += performance.amount;
        }

        return result;
    }

    function totalVolumeCredits(data) {

        let result = 0;

        for (let performance of data.performances) {
            result += performance.volumeCredits;
        }

        return result;
    }
}

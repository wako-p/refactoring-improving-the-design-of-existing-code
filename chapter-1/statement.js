
function statement(invoice, plays) {

    const statementData = {};

    statementData.customer           = invoice.customer;
    statementData.performances       = invoice.performances.map(enrichPerformance(performance));
    statementData.totalAmount        = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);

    return renderPlaneText(statementData, invoice, plays);

    function enrichPerformance(aPerformance) {

        const result = Object.assign({}, aPerformance);

        result.play          = playFor(result);
        result.amount        = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);

        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {

        let result = 0;

        switch (aPerformance.play.type)
        {
            case "tragedy":
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
    
            case "comedy":
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + (500 * (aPerformance.audience - 20));
                }
                result += 300 * aPerformance.audience;
                break;
    
            default:
                throw new Error(`unknown type: ${ aPerformance.play.type }`);
        }

        return result;
    }

    function volumeCreditsFor(aPerformance) {

        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);

        // 喜劇の場合は10人につき、さらにポイント加算
        if (aPerformance.play.type === "comedy") {
            result += Math.floor(aPerformance.audience / 5);
        }

        return result;
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

function renderPlaneText(data, plays) {

    let result = `Statement for ${ data.customer }\n`;

    for (let performance of data.performances) {
        result += `${ performance.play.name }: ${ usd(performance.amount) } (${ performance.audience } seats)\n`;
    }

    result += `Amount owed is ${ usd(data.totalAmount) }\n`;
    result += `You earned ${ data.totalVolumeCredits } credits\n`;

    return result;

    function usd(aNumber) {
        return new Intl.NumberFormat(
            "en-US",
            {
                style:                 "currency",
                currency:              "USD",
                minimumFractionDigits: 2
            }
        ).format(aNumber/100);
    }
}

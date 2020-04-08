
function statement(invoice, plays) {
    const statementData = {};
    return renderPlaneText(invoice, plays);
}

function renderPlaneText(data, invoice, plays) {

    let result = `Statement for ${ invoice.customer }\n`;

    for (let performance of invoice.performances) {
        result += `${ playFor(performance).name }: ${ usd(amountFor(performance)) } (${ performance.audience } seats)\n`;
    }

    result += `Amount owed is ${ usd(totalAmount()) }\n`;
    result += `You earned ${ totalVolumeCredits() } credits\n`;

    return result;

    function totalAmount() {

        let result = 0;

        for (let performance of invoice.performances) {
            result += amountFor(performance);
        }

        return result;
    }

    function totalVolumeCredits() {

        let result = 0;

        for (let performance of invoice.performances) {
            result += volumeCreditsFor(performance);
        }

        return result;
    }

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

    function volumeCreditsFor(aPerformance) {

        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);

        // 喜劇の場合は10人につき、さらにポイント加算
        if (playFor(aPerformance).type === "comedy") {
            result += Math.floor(aPerformance.audience / 5);
        }

        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {

        let result = 0;

        switch (playFor(aPerformance).type)
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
                throw new Error(`unknown type: ${ playFor(aPerformance).type }`);
        }

        return result;
    }
}

import createStatementData from "./createStatementData.js";

function statement(invoice, plays) {
    return renderPlaneText(createStatementData(invoice, plays));
}

function renderPlaneText(data) {

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

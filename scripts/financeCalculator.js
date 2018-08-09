/*
 * Finance Calculator - demonstrating the Conversation Flow Language
 */

var violet = require('./lib/violet').script();

violet.addInputTypes({
  "billAmt": "number",
  "numPeople": "number",
  "principalAmt": "number",
  "percentageAmt": "number",
  "paymentAmt": "number",
});

var app = {
  divide: (a, b)=>{return parseInt(a)/parseInt(b); },
  calcTip: (percentageAmt, billAmt)=>{return (1+parseInt(percentageAmt)/100)*parseInt(billAmt); },
  sayNumPayments: (response, principalAmt, percentageAmt, paymentAmt)=>{
    // basic fmla: https://www.wikihow.com/Calculate-Mortgage-Payments
    // for our needs: n=log(M/(M-Pr))/log(1+r)
    var M = parseInt(paymentAmt);
    var P = parseInt(principalAmt);
    var r = parseInt(percentageAmt)/12/100;
    var n = Math.log(M / (M-P*r)) / Math.log(1+r);
    console.log(M, P, r, n);
    if (n<1)
      response.say(`You don't have any payments needed to be made for a ${P} dollar principal with ${M} dollar payment amount`);
    else
      response.say(`You would need ${Math.ceil(n)} payments for a ${P} dollar principal with ${M} dollar payment amount`);
  }
}
violet.addFlowScript(`<app>
<choice id="launch">
  <expecting>What can you do</expecting>
  <say>I can help you split a bill, calculate tips, or calculate number of payments on your mortgage</say>
</choice>
<choice>
  <expecting>Split [[billAmt]] among [[numPeople]] people</expecting>
  <say>Splitting [[billAmt]] [[numPeople]] ways gives [[app.divide(billAmt, numPeople)]]</say>
</choice>
<choice>
  <expecting>How much is tip on {a bill of|} [[billAmt]] {dollars|}</expecting>
  <decision>
    <ask>Are you thinking of a standard tip of 15 percent or some other amount?</ask>
    <choice>
      <expecting>standard tip</expecting>
      <expecting>yes</expecting>
      <say>15 percent tip on [[billAmt]] is [[app.calcTip(15, billAmt)]]</say>
    </choice>
    <choice>
      <expecting>[[percentageAmt]] percent tip</expecting>
      <say>[[percentageAmt]] percent tip on [[billAmt]] is [[app.calcTip(percentageAmt, billAmt)]]</say>
    </choice>
  </decision>
</choice>
<dialog id="mortgage" elicit="dialog.nextReqdParam()">
  <expecting>How many payments on my mortgage</expecting>
  <item name="principalAmt" required>
    <ask>What is the mortgage amount?</ask>
    <expecting>I owe the bank [[principalAmt]] {dollars|}</expecting>
    <expecting>The principal is [[principalAmt]] {dollars|}</expecting>
  </item>
  <item name="percentageAmt" required>
    <ask>What is the interest rate?</ask>
    <expecting>{Interest rate is|} [[percentageAmt]] percent</expecting>
  </item>
  <item name="paymentAmt" required>
    <ask>How large a payment do you typically make?</ask>
    <expecting>{Every month|I typically pay} [[paymentAmt]] dollars</expecting>
  </item>
  <resolve value="app.sayNumPayments(response, principalAmt, percentageAmt, paymentAmt)"/>
</dialog>
</app>`, {app});

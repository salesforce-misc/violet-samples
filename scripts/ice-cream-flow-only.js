var violet = require('violet').script();

// id's below are not essential
violet.addFlowScript(`
<app>
<choice id="launch">
    <expecting>What can you do</expecting>
    <say>Hi! We have vanilla, chocolate, and strawberry ice cream. Which one do you want?</say>
</choice>
<choice id="order_implicit">
    <expecting>I want some ice cream</expecting>
    <say>Sure. Which one - vanilla, strawberry or chocolate?</say>
</choice>
<choice id="order_explicit">
    <expecting>Vanilla please</expecting>
    <decision id="scoops_question">
        <ask>Vanilla? Nice choice. How many scoops?</ask>
        <choice id="scoops_ok">
            <expecting>2</expecting>
            <decision id="order_check">
                <ask>2 scoops?</ask>
                <choice id="order_ok">
                    <expecting>yes</expecting>
                    <say>Great! Your order number is 32. Thank you!</say>
                </choice>
                <choice id="order_wrong">
                    <expecting>no</expecting>
                    <say>Okay, so what ice cream do you want - vanilla, chocolate or strawberry?</say>
                </choice>
            </decision>
        </choice>
        <choice id="scoops_too_many">
            <expecting>100</expecting>
            <say>Oh, we can serve no more than 3 scoops of ice cream. So how many scoops do you want?</say>
        </choice>
    </decision>
</choice>
<choice id="order_direct">
    <expecting>I want 2 scoops of vanilla</expecting>
    <say>Great! Your order number is 33. Thank you!</say>
</choice>
<choice id="order_assume">
    <expecting>2</expecting>
    <say>Great! I am assuming you want Vanilla. Your order number is 34. Thank you!</say>
</choice>
</app>`);

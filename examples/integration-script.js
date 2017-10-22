'use strict';

var violet = require('violet-conversations/lib/violet').script();
var violetClientTx = require('violet-conversations/lib/violetClientTx')(violet);

violet.respondTo([
      "Hello"
    ], (response) => {
    response.say(['Hi!']);
});

violet.respondTo({
  name: 'MajorIntent',
  expecting: [
      "What are you doing"
    ],
  resolve: (response) => {
    response.say(`Major thing happened.`);
}});


module.exports = violet;

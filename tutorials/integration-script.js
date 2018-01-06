/* Copyright (c) 2017-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

'use strict';

var violet = require('violet/lib/violet').script();
var violetClientTx = require('violet/lib/violetClientTx')(violet);

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

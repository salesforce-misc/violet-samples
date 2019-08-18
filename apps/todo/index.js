/* Copyright (c) 2017-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

'use strict';

const utils = require('violet/lib/utils');
const violet = require('violet').script({invocationName:'quip bot'});
const listWidgetTemplate = require('violet/lib/violetList')(violet);

const quipSvc = require('./svc.js');
const Promise = require('bluebird');
const soundex = require('soundex');

module.exports = violet;

violet.addPhraseEquivalents([
  ["my to do", "my list", "my to do list"],
]);

violet.addInputTypes({
  "itemNo": "number",
  "categoryNo": "number",
  'itemName': "phrase"
});

// // want to support this script in many forms
// u: Violet, add an item to the Acme Company EBC document
// v: Found the Acme Company EBC document. Which section would you like to update - Financials, EBC Agenda or ToDo?
// u: To Do
// v: Got it. What would you like to add to the checklist in the section ToDo?
// u: Make dinner reservations
// v: Got it. I added the item “make dinner reservations” to the checklist. Anything else?
// u: No thank you

/*
 * Assumptions: One hardcoded document
 */

///////////////////////////////////////
// Voice Utilities
///////////////////////////////////////
var makePretty=(str)=>{
  if (!str) return 'Error in Input';
 str = str.trim();
 return str.charAt(0).toUpperCase() + str.slice(1); // first letter uppercase
};
var voiceMatchScores = (voiceInp, items) => {
  var _getSig = (str) => {
    // use soundex https://en.wikipedia.org/wiki/Soundex
    return str.split(' ').map(w=>{return soundex(w);}).sort();
  }
  var voiceInpSig = _getSig(voiceInp);
  // console.log('voiceInpSig: ', voiceInpSig);
  return items.map(item=>{
    var itemSig = _getSig(item.text);
    // console.log('item:    ', item.text);
    // console.log('itemSig: ', itemSig);
    var matches = 0;
    voiceInpSig.forEach(inpWSig=>{
      var fMatched = itemSig.find(itemWSig=>{return inpWSig==itemWSig;});
      if (fMatched) matches++;
    });
    // console.log('matchScore: ', Math.trunc(100*matches/voiceInpSig.length), matches, voiceInpSig.length);
    return Math.trunc(100*matches/voiceInpSig.length);
  });
};


// ToDo - make the below configurable
var tgtDocId = process.env.QUIP_TGT_DOC_ID;

// Quip Utilities
var appendToCategory = (category, itemName) => {
  console.log('appendToCategory - category', category);
  var lastList = category.children;
  quipSvc.appendItemsWithinSection(tgtDocId, lastList[lastList.length-1].id, [makePretty(itemName)]);
};
var markItemChecked = (docId, itemId, itemHtml) => {
  // waiting on Quip team to implement this correctly
  return quipSvc.modifyListItem(docId, itemId, [`<del>${itemHtml}</del>`]);
};
var flagItemsAsDone = (items) => {
  // waiting on Quip team to implement this correctly
  items.children = items.children.map(i=>{
    if (i.html.startsWith('<del>')) i.done = true;
    return i;
  });
  return items;
};


// define the cateogry list interactions
const categoryList = listWidgetTemplate.register({
  humanName: 'category',
  humanNamePl: 'categories',
  dataType: 'Categories',
  widgetType: 'categoryList',
  itemTextProp: 'text',
  interactionFlow: `<decision>
    <prompt>Would you like to use one of these categories</prompt>
    <choice>
      <expecting>use category [[categoryNo]]</expecting>
      <resolve value="app.addItemToCategory(response)">
        <say>Got it. I added [[itemName]] to the checklist. Anything else?</say>
      </resolve>
    </choice>
    <choice>
      <expecting>go back</expecting>
      <resolve value="app.ack(response)"/>
    </choice>
  </decision>`});


// define the item list interactions
const itemList = listWidgetTemplate.register({
  humanName: 'item',
  humanNamePl: 'items',
  dataType: 'Items',
  widgetType: 'itemList',
  itemTextProp: 'text',
  interactionFlow: `<decision>
    <prompt>Would you like to mark an item as done</prompt>
    <choice>
      <expecting>mark item [[itemNo]] as {done|checked}</expecting>
      <resolve value="app.markItemFromListAsDone(response)">
        <say>Marked [[itemName]] as done</say>
      </resolve>
    </choice>
    <choice>
      <expecting>delete item [[itemNo]]</expecting>
      <resolve value="app.deleteItemFromList(response)">
        <say>Deleting [[itemName]]</say>
      </resolve>
    </choice>
    <choice>
      <expecting>go back</expecting>
      <resolve value="app.ack(response)"/>
    </choice>
  </decision>`});



var appController = {
  ack: (response) => { response.say(['Got it.', 'Great.', 'Awesome']); },

  addItemToList: async (response) => {
    var itemName = response.get('itemName');
    if (!itemName) return 'noItem';

    var categorizedItems = await quipSvc.getItemsP(tgtDocId, /*asList*/false)

    if (categorizedItems.length==0) {
      quipSvc.appendItemsWithinSection(tgtDocId, tgtDocId, [makePretty(itemName)]);
      return 'addedToDoc';
    } else if (categorizedItems.length==1) {
      appendToCategory(categorizedItems[0], itemName);
      return 'addedToSingleList';
    } else { // categorizedItems.length > 1
      console.log('categorizedItems', categorizedItems);
      response.set('Categories', categorizedItems);
      return 'needList';
    }
  },

  whatsNext: async (response) => {
    var items = await quipSvc.getItemsP(tgtDocId, /*asList*/true);
    items = flagItemsAsDone(items);
    var nxtItem = items.children.find(i=>{return (i.done==false);});
    if (!nxtItem) return "itemEmpty";

    response.set('tgtItem', nxtItem);
    response.set('nxtItem', nxtItem.text);
    return "itemFound";
  },

  listAllNeedsToBeDone: async (response) => {
    var items = await quipSvc.getItemsP(tgtDocId, /*asList*/true);
    items = flagItemsAsDone(items);
    items = items.children.filter(i=>{return (i.done==false);});
    response.set('Items', items);
    itemList.respondWithItems(response, items);
  },

  listAllOnToDo: async (response) => {
    var items = await quipSvc.getItemsP(tgtDocId, /*asList*/true);
    items = flagItemsAsDone(items);
    items = items.children;
    response.set('Items', items);
    itemList.respondWithItems(response, items);
  },

  markSelectedItemAsChecked: async (response) => {
    var tgtItem = response.get('tgtItem');
    if (tgtItem.id && tgtItem.html) {
      await markItemChecked(tgtDocId, tgtItem.id, tgtItem.html);
      response.set('checkedItem', tgtItem.text);
      return 'itemChecked';
    }
    return 'itemNotFound';
  },

  markItemAsChecked: async (response) => {
    var items = await quipSvc.getItemsP(tgtDocId, /*asList*/true);

    var matchScores = voiceMatchScores(response.get('itemName'), items.children);
    // console.log('matchScores: ', matchScores);
    var hi=[], lo=[]; // indices of target items
    matchScores.forEach((score, ndx)=>{
      if (score>65) hi.push(ndx);
      if (score<35) lo.push(ndx);
    });
    // console.log(hi, lo, matchScores.length);

    // if high match with 1 item and low match with *all* other items
    if (hi.length==1 && matchScores.length-1==lo.length) {
      var tgtItem = items.children[hi[0]];
      await markItemChecked(tgtDocId, tgtItem.id, tgtItem.html);
      response.set('checkedItem', tgtItem.text);
      return 'itemChecked';
    }

    // if high/mid match with 2-3 items and low match with *all* other items (length-3)
    if (lo.length>=matchScores.length-3) {
      var matchItems = matchScores
            .map((score, ndx)=>{return (score>=35) ? items.children[ndx] : null;})
            .filter(i=>{return i!=null;});

      response.set('Items', matchItems);
      return 'multipleItemsFound';
    }

    // not sure we can do better
    return 'itemNotFound';
  },

  addItemToCategory: (response) => {
    var category = categoryList.getItemFromResults(response, response.get('categoryNo'));
    appendToCategory(category, response.get('itemName'));
  },

  markItemFromListAsDone: async (response) => {
    var item = itemList.getItemFromResults(response, response.get('itemNo'));
    await markItemChecked(tgtDocId, item.id, item.html);
    response.set('itemName', item.text);
  },

  deleteItemFromList: async (response) => {
    var item = itemList.getItemFromResults(response, response.get('itemNo'));
    await quipSvc.deleteListItem(tgtDocId, item.id);
    response.set('itemName', item.text);
  }



};



violet.loadFlowScript('apps/todo/script.cfl', {app: appController, categoryList, itemList});

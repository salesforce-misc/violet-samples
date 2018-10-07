/* Copyright (c) 2017-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */


var violet = require('violet').script();

var violetSFStore = require('violet/lib/violetSFStore');

violet.setPersistentStore(violetSFStore.store);


// mock objects
var response = new Response(violet, {
  getSession: ()=>{}
}, {});

// test prep
violetSFStore.store.propOfInterest = {
  'KnowledgeArticleVersion*': ['Id*', 'Title*', 'Summary*', 'UrlName*', 'LastPublishedDate*']
}

// test methods
var loadAllAddressTest = () => {
  setTimeout(()=>{
    response._persistentStore().search('KnowledgeArticleVersion*', 'security')
      .then((records)=>{
        console.log('search results:', records);
        console.log('found ' + records.length + ' records');
      });
  }, 2*1000);
};



// storeTest();
loadAllAddressTest();

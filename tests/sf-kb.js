
var violet = require('violet-conversations/lib/violet').script();
var violetTime = require('violet-conversations/lib/violetTime')(violet);

var violetSFStore = require('violet-conversations/lib/violetSFStore');

violet.setPersistentStore(violetSFStore.store);


// mock objects
var response = violet._getResponseForDebugging({
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

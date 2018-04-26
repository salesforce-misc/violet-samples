/* Copyright (c) 2017-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */


var yelp = require('yelp-fusion');

var apiKey = process.env.YELP_API_KEY;

var lat = null;
var lon = null;

var client = null;

module.exports.init = (_lat, _lon) => {
  lat = _lat;
  lon = _lon;
  client = yelp.client(apiKey);
  return Promise.resolve();
}

var searchScanner = module.exports.searchScanner = (searchTerm, categories, processBusinessesCB, offset=0, max=100) => {
  var params = {
    latitude: lat,
    longitude: lon,
    radius: 1000, // 1000 meters (want items within 15 minutes walk)
    limit: 50
  }
  if (offset>0) params.offset = offset;
  if (searchTerm) params.term = searchTerm;
  if (categories) params.categories = categories;

  return client.search(params).then(response => {
    console.log('*** Yelp Searched: ' +  JSON.stringify(params));
    console.log('  total results: ' + response.jsonBody.total);
    console.log('  returned results: ' + response.jsonBody.businesses.length);
    processBusinessesCB(response.jsonBody.businesses);

    var totalProcessed = offset+response.jsonBody.businesses.length;

    delete response.jsonBody.businesses;
    console.log('  additional metadata: ' + JSON.stringify(response.jsonBody));

    if (response.jsonBody.total>totalProcessed && totalProcessed<max)
      return searchScanner(searchTerm, categories, processBusinessesCB, totalProcessed, max);
  });
}

// an easy search implementation - assumes to try for 100 results and the return value is a promise which gives the values
module.exports.search = (searchTerm, categories) => {
  var results = [];
  var collector = val => {results.push(val);};
  var resultsCollector = results => {results.forEach(val=>{collector(val);}); };
  return searchScanner(searchTerm, categories, resultsCollector).then(()=>{return results;});
}

// return client.reviews('coriander-indian-bistro-sharon').then(response => {
//   console.log(response.jsonBody.reviews);
// });

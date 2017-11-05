/* Copyright (c) 2017-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

var yelpSvc = new require('./yelp.js');

/* locations */
// Sharon
// var lat =  42.123392;
// var lon = -71.175288;
// lat = 42.351384; lon = -71.055411; // south station, boston, ma
// lat = 42.365284; lon = -71.104366; // central square, cambridge, ma
// lat = 42.373570; lon = -71.118966; // harvard square, cambridge, ma

// San Fran
var lat =   37.786714;
var lon = -122.411129;



var catList = {};

var extractCategories = (businesses) => {
  // console.log(businesses[0].name);
  // console.log(businesses[0]);
  // console.log(businesses.length);
  businesses.forEach(b=>{
    console.log(b.name);
    // console.log(b.categories);
    b.categories.forEach(c=>{
      if (!catList[c.alias]) catList[c.alias]={name:c.title, cnt:0};
      catList[c.alias].cnt++;
    });
    // console.log(distance(lat, lon, b.coordinates.latitude, b.coordinates.longitude));
  })
}


yelpSvc.init(lat, lon).then(()=>{
  return yelpSvc.searchScanner(null, 'restaurants', extractCategories);
}).then(()=>{
  var sortList = Object
        .keys(catList)
        .map(k=>{return catList[k];})
        .sort((c1, c2) => {
          return c2.cnt - c1.cnt;
        })
  console.log('sortList:\n', sortList);
}).catch(e => {
  console.log(e);
});

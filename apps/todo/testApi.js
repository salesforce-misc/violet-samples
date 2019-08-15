/* Copyright (c) 2017-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

var quipSvc = new require('./svc.js');
var utils = new require('./utils.js');
const fs = require('fs');


// dig into starred folders
// quipSvc.getAuthenticatedUser(function(err, user) {
//   console.log(utils.prettyJSON('user: ', user));
//   quipSvc.getFolder(user['starred_folder_id']);
// });

var mainDoc = process.env.QUIP_TGT_DOC_ID;

// dig into particular document with checklist
quipSvc.getThread(mainDoc);

// dig into messages for a particular document
// quipSvc.getClient().getMessages({threadId: mainDoc}, (err, resp)=>{
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(resp)
//   }
// });

// add message for a particular document
// quipSvc.getClient().newMessage({
//   threadId: mainDoc,
//   content: 'https://quip.com/eTIAEAG12St - can we afford to do this?',
//   silent: true
// }, (err, resp)=>{
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(resp)
//   }
// });

// add items to thread after section
// quipSvc.appendItems(mainDoc, ['BBB - 10', 'BBB - 20']);

// edit items
// quipSvc.modifyListItem(mainDoc, 'TddACAurP6C', ['the future is now']);
// quipSvc.modifyListItem(mainDoc, 'TddACAurP6C', ['<del>The test item</del>']);

// delete items
// quipSvc.deleteListItem(mainDoc, 'bBGACAwoVVQ');

// mark a checkbox as completed
// ***need to get this working***
// quipSvc.modifyListItem(mainDoc, 'TddACAurP6C', ['<del>The test item</del>']);

// list items
// quipSvc.getItems(mainDoc, /*asList*/false, (err, items)=>{
//   console.log(JSON.stringify(items, null, 2));
// });

// quipSvc.appendImage(mainDoc, 'image001.png', fs.readFileSync(__dirname + '/image001.png'));

// create doc and write id
// quipSvc.getClient().newDocument({
//   title: 'Amazing Test',
//   format: 'markdown',
//   content: 'From the VR Environment\n\nOne of the things to keep in mind is\n\n that machines are not intelligent'
// }, (err, resp)=>{
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log(`Doc created with id:${resp.thread.id} and url: ${resp.thread.link}`);
// });

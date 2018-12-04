/* Copyright (c) 2017-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

'use strict';

var violet = require('violet').script();
var violetCasesList = require('violet/lib/violetList')(violet, 'Cases', 'case', 'cases');

var violetSFStore = require('violet/lib/violetStoreSF')(violet);
violetSFStore.store.propOfInterest = {
  'Case*': ['Id*', 'CaseNumber*', 'Contact*.Name*', /*'Contact*.Owner*.Name*',*/ 'Subject*', 'Status*', 'Priority*']
}

violet.addInputTypes({
  "caseNo": "NUMBER",
  "caseStatus": {
    "type": "caseStatusType",
    "values": ["New", "Working", "Escalated", "Closed"]
  },
  "casePriority": {
    "type": "casePriorityType",
    "values": ["Low", "Medium", "High"]
  },
  "commentText": "phrase"
});

var getStatusCounts = function(results) {
  // iterate through results and collect states in object 'status'
  var status = {};
  results.forEach((c)=>{
    if (!status[c.Status]) status[c.Status] = 0;
    status[c.Status]++;
  });

  var out = 'You have ' + results.length + ' cases. Of these'
  var states = Object.keys(status);
  states.forEach((s,ndx)=>{
    if (status[s]==1)
      out += ' ' + status[s] + ' is ' + s;
    else
      out += ' ' + status[s] + ' are ' + s;
    if (ndx == states.length-2)
      out += ' and ';
    else if (ndx < states.length-2)
      out += ','
  });
  return out;
};

// implement login - as a function of how we deploy
const ownerAlias = 'VSinh';

var appCtrl = {
  checkMyCases: function *(response) {
    var results = yield response.load('Case*', 'Owner*.Alias*', ownerAlias);
    if (results.length == 0) {
      response.say('Sorry. You have no cases.');
      return;
    }

    response.say(getStatusCounts(results));
  },
  checkOpenCases: function *(response) {
    var results = yield response.load('Case*', 'Owner*.Alias*', ownerAlias, "Status <> 'Closed'");
    response.set('Cases', results);
    violetCasesList.respondWithItems(response, results);
  },
  checkCasesForStatus: function *(response) {
    var results = yield response.load('Case*', 'Owner*.Alias*', ownerAlias, "Status = '" + response.get('caseStatus') + "'");
    response.set('Cases', results);
    if (results.length == 0) {
      response.say('Sorry. You have no cases.');
      return;
    }
    violetCasesList.respondWithItems(response, results);
  },
  checkCasesForPriority: function *(response) {
    var results = yield response.load('Case*', 'Owner*.Alias*', ownerAlias, "Priority = '" + response.get('casePriority') + "'");
    response.set('Cases', results);
    if (results.length == 0) {
      response.say('Sorry. You have no cases.');
      return;
    }
    violetCasesList.respondWithItems(response, results);
  },
  checkCasesForStatusAndPriority: function *(response) {
    var results = yield response.load('Case*', 'Owner*.Alias*', ownerAlias, "(Status = '" + response.get('caseStatus') + "' AND Priority = '" + resposne.get('casePriority') +  "')");
    response.set('Cases', results);
    if (results.length == 0) {
      response.say('Sorry. You have no cases.');
      return;
    }
    violetCasesList.respondWithItems(response, results);
  }
};
var mockData = [
  {CaseNumber: 1, Status: "New", Priority: "Low", Subject: "Defective Equipment"},
  {CaseNumber: 2, Status: "Escalated", Priority: "Low", Subject: "Wrong Size"},
  {CaseNumber: 3, Status: "New", Priority: "Medium", Subject: "Completely Broken"},
  {CaseNumber: 4, Status: "Escalated", Priority: "Medium", Subject: "Too Thin"},
  {CaseNumber: 5, Status: "New", Priority: "High", Subject: "Low Quality"},
  {CaseNumber: 6, Status: "Closed", Priority: "High", Subject: "Works Too Well"}
];
var appCtrlMock = {
  checkMyCases: function *(response) {
    response.say(getStatusCounts(mockData));
  },
  checkOpenCases: function *(response) {
    response.set('Cases', mockData);
    violetCasesList.respondWithItems(response, mockData);
  },
  checkCasesForStatus: function *(response) {
    response.set('Cases', mockData);
    violetCasesList.respondWithItems(response, mockData);
  },
  checkCasesForPriority: function *(response) {
    response.set('Cases', mockData);
    violetCasesList.respondWithItems(response, mockData);
  },
  checkCasesForStatusAndPriority: function *(response) {
    response.set('Cases', mockData);
    violetCasesList.respondWithItems(response, mockData);
  }
};
//appCtrl = appCtrlMock;


violet.respondTo({
  expecting: ['status of my cases'],
  resolve: appCtrl.checkMyCases
});

violetCasesList.getItemText = (ndx, results) => {
  var caseObj = results[ndx];
  return 'Result ' + (ndx+1) + ' is ' + caseObj.Subject + ', and has status ' + caseObj.Status + '. ';
}


violet.defineGoal({
  goal: violetCasesList.interactionGoal(),
  prompt: ['Would you like to hear or set the priority, change status, or add a comment along with the case number'],
  respondTo: [{
    expecting: ['{hear|} priority for case [[caseNo]]'],
    resolve: (response) => {
      var caseObj = violetCasesList.getItemFromResults(response, response.get('caseNo'));
      if (!caseObj) return;
      response.say('Case ' + caseObj.Subject + ' has priority ' + caseObj.Priority);
  }}, {
    expecting: ['Set priority for case [[caseNo]] to [[casePriority]]'],
    resolve: function *(response) {
      var caseObj = violetCasesList.getItemFromResults(response, response.get('caseNo'));
      if (!caseObj) return;
      yield response.update('Case*', 'CaseNumber*', caseObj.CaseNumber, {
          'Priority*': response.get('casePriority')
      });
      response.say('Case ' + caseObj.Subject + ' has priority updated to [[casePriority]]');
  }}, {
    expecting: ['Change status for case [[caseNo]] to [[caseStatus]]'],
    resolve: function *(response) {
      var caseObj = violetCasesList.getItemFromResults(response, response.get('caseNo'));
      if (!caseObj) return;
      yield response.update('Case*', 'CaseNumber*', caseObj.CaseNumber, {
          Status: response.get('caseStatus')
      });
      response.say('Case ' + caseObj.Subject + ' has status updated to [[caseStatus]]');
  }}, {
    expecting: ['Add comment to case [[caseNo]] saying [[commentText]]'],
    resolve: function *(response) {
      var caseObj = violetCasesList.getItemFromResults(response, response.get('caseNo'));
      if (!caseObj) return;
      yield response.store('CaseComment*', {
        'CommentBody*': 'Text String',
        'ParentId*': caseObj.Id
      });
      response.say('Case ' + caseObj.Subject + ' has comment added');
  }}]
});


violet.respondTo({
  expecting: ['what are my {open|} cases'],
  resolve: appCtrl.checkOpenCases
});

violet.respondTo({
  expecting: ['what are my [[caseStatus]] cases', 'what cases of mine have status {set to|} [[caseStatus]]'],
  resolve: appCtrl.checkCasesForStatus
});

violet.respondTo({
  expecting: ['what are my [[casePriority]] priority cases', 'what cases of mine have priority {set to|} [[casePriority]]'],
  resolve: appCtrl.checkCasesForPriority
});

violet.respondTo({
  expecting: ['what cases of mine have status {set to|} [[caseStatus]] and priority {set to|} [[casePriority]]',
              'what cases of mine have priority {set to|} [[casePriority]] and status {set to|} [[caseStatus]]'],
  resolve: appCtrl.checkCasesForStatusAndPriority
});


module.exports = violet;

/* Copyright (c) 2017-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

'use strict';

var violet = require('violet').script();

var listWidgetTemplate = require('violet/lib/violetList')(violet);

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

// implement login - as a function of how we deploy
const ownerAlias = 'VSinh';

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

var caseListWidget = listWidgetTemplate.register({
  humanName: 'case',
  humanNamePl: 'cases',
  dataType: 'Cases',
  widgetType: 'caseListWidget',
  itemTextProp: 'Subject',
  interactionFlow: `<decision>
    <prompt>Would you like to hear or set the priority, change status, or add a comment along with the case number</prompt>
    <choice>
      <expecting>{hear|} priority for case [[caseNo]]</expecting>
      <resolve value="app.hearPriority(response)"/>
    </choice>
    <choice>
      <expecting>Set priority for case [[caseNo]] to [[casePriority]]</expecting>
      <resolve value="app.setPriority(response)"/>
    </choice>
    <choice>
      <expecting>Change status for case [[caseNo]] to [[caseStatus]]</expecting>
      <resolve value="app.changeStatus(response)"/>
    </choice>
    <choice>
      <expecting>Add comment to case [[caseNo]] saying [[commentText]]</expecting>
      <resolve value="app.addComment(response)"/>
    </choice>
  </decision>`});

var app = {
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
    return results;
  },
  checkCasesForStatus: function *(response) {
    var results = yield response.load('Case*', 'Owner*.Alias*', ownerAlias, "Status = '" + response.get('caseStatus') + "'");
    response.set('Cases', results);
    if (results.length == 0) {
      response.say('Sorry. You have no cases.');
      return null;
    }
    return results;
  },
  checkCasesForPriority: function *(response) {
    var results = yield response.load('Case*', 'Owner*.Alias*', ownerAlias, "Priority = '" + response.get('casePriority') + "'");
    response.set('Cases', results);
    if (results.length == 0) {
      response.say('Sorry. You have no cases.');
      return null;
    }
    return results;
  },
  checkCasesForStatusAndPriority: function *(response) {
    var results = yield response.load('Case*', 'Owner*.Alias*', ownerAlias, "(Status = '" + response.get('caseStatus') + "' AND Priority = '" + response.get('casePriority') +  "')");
    response.set('Cases', results);
    if (results.length == 0) {
      response.say('Sorry. You have no cases.');
      return null;
    }
    return results;
  },
  hearPriority: function(response) {
    var caseObj = caseListWidget.getItemFromResults(response, response.get('caseNo'));
    if (!caseObj) return;
    response.say('Case ' + caseObj.Subject + ' has priority ' + caseObj.Priority);
  },
  setPriority: function *(response) {
    var caseObj = caseListWidget.getItemFromResults(response, response.get('caseNo'));
    if (!caseObj) return;
    yield response.update('Case*', 'CaseNumber*', caseObj.CaseNumber, {
        'Priority*': response.get('casePriority')
    });
    response.say('Case ' + caseObj.Subject + ' has priority updated to [[casePriority]]');
  },
  changeStatus: function *(response) {
    var caseObj = caseListWidget.getItemFromResults(response, response.get('caseNo'));
    if (!caseObj) return;
    yield response.update('Case*', 'CaseNumber*', caseObj.CaseNumber, {
        Status: response.get('caseStatus')
    });
    response.say('Case ' + caseObj.Subject + ' has status updated to [[caseStatus]]');
  },
  addComment: function *(response) {
    var caseObj = caseListWidget.getItemFromResults(response, response.get('caseNo'));
    if (!caseObj) return;
    yield response.store('CaseComment*', {
      'CommentBody*': 'Text String',
      'ParentId*': caseObj.Id
    });
    response.say('Case ' + caseObj.Subject + ' has comment added');
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
var appMock = {
  checkMyCases: function *(response) {
    response.say(getStatusCounts(mockData));
  },
  checkOpenCases: function *(response) {
    response.set('Cases', mockData);
    //violetCasesList.respondWithItems(response, mockData);
    return mockData;
  },
  checkCasesForStatus: function *(response) {
    response.set('Cases', mockData);
    //violetCasesList.respondWithItems(response, mockData);
    return mockData;
  },
  checkCasesForPriority: function *(response) {
    response.set('Cases', mockData);
    //violetCasesList.respondWithItems(response, mockData);
    return mockData;
  },
  checkCasesForStatusAndPriority: function *(response) {
    response.set('Cases', mockData);
    //violetCasesList.respondWithItems(response, mockData);
    return mockData;
  },
  hearPriority: function(response) {
    var caseObj = caseListWidget.getItemFromResults(response, response.get('caseNo'));
    if (!caseObj) return;
    response.say('Case ' + caseObj.Subject + ' has priority ' + caseObj.Priority);
  },
  setPriority: function(response) {
    var caseObj = caseListWidget.getItemFromResults(response, response.get('caseNo'));
    if (!caseObj) return;
    caseObj.Priority = response.get('casePriority');
    response.say('Case ' + caseObj.Subject + ' has priority updated to [[casePriority]]');
  },
  changeStatus: function(response) {
    var caseObj = caseListWidget.getItemFromResults(response, response.get('caseNo'));
    if (!caseObj) return;
    caseObj.Status = response.get('caseStatus');
    response.say('Case ' + caseObj.Subject + ' has status updated to [[caseStatus]]');
  },
  addComment: function(response) {
    response.say('Cannot add comment for mock data');
  }
};
app = appMock;


violet.addFlowScript(`<app>
  <choice>
    <expecting>status of my cases</expecting>
    <resolve value="app.checkMyCases(response)"/>
  </choice>
  <choice>
    <expecting>what are my {open|} cases</expecting>
    <resolve value="app.checkOpenCases(response)">
      <caseListWidget>
    </resolve>
  </choice>
  <choice>
    <expecting>what are my [[caseStatus]] cases</expecting>
    <expecting>what cases of mine have status {set to|} [[caseStatus]]</expecting>
    <resolve value="app.checkCasesForStatus(response)">
      <caseListWidget>
    </resolve>
  </choice>
  <choice>
    <expecting>what are my [[casePriority]] priority cases</expecting>
    <expecting>what cases of mine have priority {set to|} [[casePriority]]</expecting>
    <resolve value="app.checkCasesForPriority(response)">
      <caseListWidget>
    </resolve>
  </choice>
  <choice>
    <expecting>what cases of mine have status {set to|} [[caseStatus]] and priority {set to|} [[casePriority]]</expecting>
    <expecting>what cases of mine have priority {set to|} [[casePriority]] and status {set to|} [[caseStatus]]</expecting>
    <resolve value="app.checkCasesForStatusAndPriority(response)">
      <caseListWidget>
    </resolve>
  </choice>
</app>`, {app});

module.exports = violet;

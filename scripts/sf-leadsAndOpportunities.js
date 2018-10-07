/* Copyright (c) 2017-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

'use strict';

var moment = require('moment-timezone');
var pluralize = require('pluralize');

var violet = require('violet').script();

var violetSFStore = require('violet/lib/violetStoreSF')(violet);
violetSFStore.store.propOfInterest = {
  'Lead*': ['Name*', 'Company*'],
  'Opportunity*': ['Name*', 'StageName*', 'Probability*', 'Amount*'],
  'Event*': ['StartDateTime*', 'Subject*', 'Who*.Name*']
}

violet.addInputTypes({
  "leadName": {
      "type": "AMAZON.LITERAL",
      "sampleValues": ["Bill Gates", "Mark Zuckerberg"]
  },
  "leadCompany": {
      "type": "AMAZON.LITERAL",
      "sampleValues": ["Microsoft", "Facebook", "Fresh Foods Packing", "ACME Corp"]
  },
  "opportunityName": {
      "type": "AMAZON.LITERAL",
      "sampleValues": ["United Oil Standby Generators", "Microsoft Add-On Business Seventeen-K", "Facebook New Business Twenty-Two-K"]
  }
});

var app = {
  ack: (response)=>{
    response.say(['Got it.', 'Great.']);
  },
  createLead: (response)=>{
    var names = response.get('leadName').split(' ');
    response.store('Lead*', {
      'FirstName*': names[0],
      'LastName*': names[1],
      'Company*': response.get('leadCompany')
    });
  },
  checkNewLeads: function *(response) {
    var results = yield response.load('Lead*', null, null, 'CreatedDate = TODAY');
    if (results.length == 0) {
      response.say('Sorry, you do not have any new leads for today.');
      return;
    }
    console.log(results);
    var speechOutput = 'You have ' + results.length + ' new ' + pluralize('lead', results.length) + ', ';
    results.forEach((rec, i)=>{
      speechOutput +=  i+1 + ', ' + rec.Name + ' from ' + rec.Company + ', ';
      if (i === results.length-2) speechOutput += ' and ';
    });
    speechOutput += ', Go get them tiger!';
    response.say(speechOutput);
  },
  opportunityStatus: function *(response) {
    var results = yield response.load('Opportunity*', 'Name*', response.get('opportunityName'));
    if (results.length == 0) {
      response.say('Sorry, I could not find an Opportunity named, [[opportunityName]]');
      return;
    }
    var opp = results[0];
    response.say(
      `I found Opportunity [[opportunityName]] for \$${opp.Amount}, the stage
      is ${opp.StageName} and the probability is ${opp.Probability} %`
    );
  },
  calendarCheck: function *(response) {
    var results = yield response.load('Event*', null, null, 'startdatetime = TODAY order by StartDateTime');
    var speechOutput = 'You have  ' + results.length + ' ' + pluralize('event', results.length) + ' for today, ';
    results.forEach(function(rec) {
      speechOutput += 'At ' + moment(rec.StartDateTime).tz('America/Los_Angeles').format('h:m a') + ', ' + rec.Subject;
      if (rec.Who) speechOutput += ', with  ' + rec.Who.Name;
      speechOutput += ', ';
    });
    response.say(speechOutput);
  }
};
violet.addFlowScript(`<app>
  <choice>
    <!-- help with the script -->
    <expecting>help {me|}</expecting>
    <expecting>what {commands|questions} can I {ask|say}</expecting>
    <expecting>what can I {do|ask you}</expecting>
    <expecting>what {do|can} I use you</expecting>
    <expecting>what {do|can} you do</expecting>
    <expecting>get help</expecting>
    <expecting>what can I use this for</expecting>
    <expecting>what can you tell me</expecting>
    <say>
      You can ask to check for any new leads, your calendar for
      today, the status of a specific opportunity or, to create a new lead...
      What can I help you with?
    </say>
  </choice>
  <!-- <say>OK, let's create a new lead.</say> -->
  <!-- create a lead -->
  <dialog id="create" elicit="dialog.nextReqdParam()">
    <expecting>{to|} create a {new|} lead</expecting>
    <item name="leadName" required>
      <ask>What is the person's first and last name?</ask>
      <expecting>persons name is [[leadName]]</expecting>
      <resolve value="app.ack(response)"/>
      <say quick="true">the name is [[leadName]].</say>
    </item>
    <item name="leadCompany" required>
      <ask>What is the company name?</ask>
      <expecting>company name is [[leadCompany]]</expecting>
      <resolve value="app.ack(response)"/>
      <say quick="true">company name is, [[leadCompany]].</say>
    </item>
    <resolve value="app.createLead(response)">
      <say>Bingo! I created a new lead for [[leadName]] with the company name [[leadCompany]]</say>
    </resolve>
  </dialog>
  <choice>
    <!-- check for any new leads -->
    <expecting>{for|} {any|my} new leads</expecting>
    <resolve value="app.checkNewLeads(response)"/>
    <say quick="true">blah</say>
    <say quick="true">blah</say>
  </choice>
  <choice>
    <!-- opportunity status -->
    <expecting>{for|about} opportunity [[opportunityName]]</expecting>
    <resolve value="app.opportunityStatus(response)"/>
  </choice>
  <choice>
    <!-- {for|} my calendar {for today|} -->
    <expecting>{for|} my calendar {for today|}</expecting>
    <resolve value="app.calendarCheck(response)"/>
  </choice>
</app>`, {app});


module.exports = violet;

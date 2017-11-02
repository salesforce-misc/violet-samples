/* Copyright (c) 2017-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

'use strict';

var violet = require('violet-conversations/lib/violet').script();
var violetTime = require('violet-conversations/lib/violetTime')(violet);
var violetStorePG = require('violet-conversations/lib/violetStorePG.js')(violet);

module.exports = violet;

violetStorePG.store.propOfInterest = {
  'sessions': [
    'level',
    'industry',
    'session_theme',
    'role',
    'products',
    'room',
    'venue_name',
    'session_date',
    'session_time',
    'session_start_time',
    'attendance_category',
    'session_duration',
    'enrollment_count',
    'session_format',
    'session_name',
    'session_abstract'
  ]
}


violet.addInputTypes({
  "industry": {
    "type": "industryType",
    "values": ["Agriculture", "Automotive", "Communications", "Consumer Goods", "Education", "Energy", "Financial Services", "Government", "Healthcare", "High Tech", "Hospitality/Travel", "Life Sciences", "Manufacturing", "Media", "Nonprofit", "Professional Services", "Retail", "Transportation", "Logistics"]
  },

  "theme": {
    "type": "themeType",
    "values": ["Admission/Recruiting", "Advancement/Fundraising", "Apps & Architecture", "Channel Sales Management", "Customer Support", "E-commerce", "Email", "Emerging Small Business", "Emerging Trends", "Enterprise", "Equality", "Forecasting", "Futures Lab", "Gamification", "GDPR", "Innovation", "Integration", "Intelligence", "Internet of Things", "IT Help Desk", "Leadership", "Lightning Adoption", "Marketing Automation", "Mindfulness", "Mobile", "Privacy", "Retail", "Sales Enablement",
                "Sales Productivity", "Salesforce Careers", "Salesforce on Salesforce", "Salesforce Philanthropy", "Security", "Selling with Partners", "Small & Medium Business", "Social Marketing", "Student Success/Community Engagement", "Sustainability", "Thought Leadership", "Tips & Tricks", "Trailhead Learning", "User Experience", "User Interface", "Women in Leadership", "Women in Technology"]
  },

  "role": {
    "type": "roleType",
    "values": ["Architect", "Consultant", "Developer", "E-Commerce", "Entrepreneur", "Executive", "Finance & Accounting", "Human Resources", "IT", "Marketing", "Merchandising", "New Customer", "Operations", "Partner", "Consulting", "ISV", "Product Management", "Purchasing & Procurement", "Sales", "Salesforce Administrator", "Service & Support", "Technical Architect"]
  },

  "product": {
    "type": "productType",
    "values": ["Analytics Cloud", "App Cloud", "AppExchange", "Chatter", "Cloud Services", "Commerce Cloud", "Community Cloud", "Data.com", "Desk.com", "Einstein", "Einstein Analytics", "Einstein Discovery", "Financial Services Cloud", "Force.com", "Health Cloud", "Heroku", "IoT Cloud", "Lightning", "Marketing Cloud", "Pardot", "Platform", "Quip", "Sales Cloud", "Salesforce Billing", "Salesforce CPQ", "Salesforce DMP", "Salesforce Inbox", "Salesforce Platform", "Salesforce Quote-to-Cash",
                "Salesforce1 Mobile", "Service Cloud"]
  },

});

// cat = industry, session_theme, role, products
var querySessions = (response, cat, val) => {
  // return response.load({ // <-- bug when loading multiple scripts - plugins do not load
  return violetStorePG.store.load({
    objName: 'sessions',
    filter: `${cat} ilike '%${val}%' AND session_start_time BETWEEN '2017-11-08 08:00:00'::timestamp AND '2017-11-08 22:00:00'::timestamp`,
    queryXtra: 'order by session_start_time limit 3'
  });
};

var returnSessionInfo = (response, questionType, prettyCat, cat, val) => {
  if (!val) return response.say(`Sorry, could not identify ${cat} type`);
  response.say(`Looking up ${val} ${prettyCat}`);
  return querySessions(response, cat, val)
    .then(rec=>{
      if (!rec) return response.say('Unexpected error');
      console.log(`Found ${rec.length} sessions.`)
      if (rec.length == 0) {
        return repsonse.say('Sorry, I could not find any any sessions. Perhaps try asking a Trail Guide');
      }
      if (rec.length > 0) {
        console.log(rec[0]);
        var startTime = new Date(rec[0].session_start_time);
        var starts   = `starts at ${startTime.toLocaleTimeString()}`;
        var location = `is in the ${rec[0].room.trim()} at ${rec[0].venue_name.trim()}`;
        var name     = `is the ${rec[0].session_name.trim()}`;
        switch (questionType) {
          case 'when':
            response.say(`The next ${val} session ${starts}. It ${name} and it ${location}.`)
            return;
          case 'where':
            response.say(`The next ${val} session ${location}. It ${name} and it ${starts}`);
            return;
          default: // case 'what'
            response.say(`The next ${val} session ${name}. It ${starts} and it ${location}`)
            return;
        }
      }
    });
}

var hookCategory = (prettyName, dbColName)=>{
  violet.respondTo(
    [`when is the next [[${prettyName}]] session`],
    (response) => {
      return returnSessionInfo(response, 'when', prettyName, dbColName, response.get(prettyName));
  });
  violet.respondTo(
    [`where is the next [[${prettyName}]] session`],
    (response) => {
      return returnSessionInfo(response, 'where', prettyName, dbColName, response.get(prettyName));
  });
  violet.respondTo(
    [`what is the next [[${prettyName}]] session`],
    (response) => {
      return returnSessionInfo(response, 'what', prettyName, dbColName, response.get(prettyName));
  });
}
hookCategory('industry', 'industry');
hookCategory('theme', 'session_theme');
hookCategory('role', 'role');
hookCategory('product', 'products');

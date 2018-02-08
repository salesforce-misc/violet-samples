/* Copyright (c) 2017-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */


var violet = require('violet').script();
var violetTime = require('violet/lib/violetTime')(violet);

var violetStorePG = require('violet/lib/violetStorePG.js')(violet);


// mock objects
var response = new Response(violet, {
  getSession: ()=>{}
}, {});

// test prep
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

// test methods
var loadAllSessions = () => {
  setTimeout(()=>{
    response.load({objName:'sessions', queryXtra: 'limit 5'})
      .then((records)=>{
        console.log('load results:', records);
        console.log('loaded ' + records.length + ' records');
      });
  }, 2*1000);
};
var loadSessionsByDate = () => {
  setTimeout(()=>{
    response.load({
      objName:'sessions',
      filter: "session_start_time BETWEEN '2017-11-08 08:00:00'::timestamp AND '2017-11-08 22:00:00'::timestamp",
      // filter: "session_start_time BETWEEN '2017-11-08 08:00:00'::timestamp AND now()::timestamp",
      queryXtra: 'limit 5'
    }).then((records)=>{
        console.log('load results:', records);
        console.log('loaded ' + records.length + ' records');
      });
  }, 2*1000);
};
var loadLeadershipSessions = () => {
  setTimeout(()=>{
    response.load({objName:'sessions', filter: "session_theme like '%Leadership%'", queryXtra: 'limit 3'})
      .then((records)=>{
        console.log('load results:', records);
        console.log('loaded ' + records.length + ' records');
      });
  }, 2*1000);
};

// tgtIndustry = Agriculture, Automotive, Communications, Consumer Goods, Education, Energy, Financial Services, Government, Healthcare, Financial Services, High Tech, Hospitality/Travel, Life Sciences, Manufacturing, Media, Nonprofit, Professional Services, Retail, Transportation, Transportation & Logistics, Other
var loadSessionsByIndustry = (tgtIndustry) => {
  setTimeout(()=>{
    response.load({objName:'sessions', filter: `industry like '%${tgtIndustry}%'`, queryXtra: 'limit 3'})
      .then((records)=>{
        console.log('load results:', records);
        console.log('loaded ' + records.length + ' records');
      });
  }, 2*1000);
};
// tgtTheme = Admission/Recruiting, Admission/Recruiting, Advancement/Fundraising, Apps & Architecture, Channel Sales Management, Customer Support, E-commerce, Email, Emerging Small Business, Emerging Trends, Enterprise, Equality, Forecasting, Futures Lab, Gamification, GDPR, Innovation, Integration, Intelligence, Internet of Things, IT Help Desk, Leadership, Lightning Adoption, Marketing Automation, Mindfulness, Mobile, Privacy, Retail, Sales Enablement, Sales Productivity, Salesforce Careers, Salesforce on Salesforce, Salesforce Philanthropy, Security, Selling with Partners, Small & Medium Business, Social Marketing, Student Success/Community Engagement, Sustainability, Thought Leadership, Tips & Tricks, Trailhead Learning, User Experience, User Interface, Women in Leadership, Women in Technology
var loadSessionsByTheme = (tgtTheme) => {
  setTimeout(()=>{
    response.load({objName:'sessions', filter: `session_theme like '%${tgtTheme}%'`, queryXtra: 'limit 3'})
      .then((records)=>{
        console.log('load results:', records);
        console.log('loaded ' + records.length + ' records');
      });
  }, 2*1000);
};

// tgtRole = Architect, Consultant, Developer, E-Commerce, Entrepreneur, Executive, Finance & Accounting, Human Resources, IT, Marketing, Merchandising, New Customer, Operations, Other, Partner, Consulting, Partner, ISV, Product Management, Purchasing & Procurement, Sales, Salesforce Administrator, Service & Support, Technical Architect
var loadSessionsByRole = (tgtRole) => {
  setTimeout(()=>{
    response.load({objName:'sessions', filter: `role like '%${tgtRole}%'`, queryXtra: 'limit 3'})
      .then((records)=>{
        console.log('load results:', records);
        console.log('loaded ' + records.length + ' records');
      });
  }, 2*1000);
};

// tgtProduct = Analytics Cloud, App Cloud, AppExchange, Chatter, Cloud Services, Commerce Cloud, Community Cloud, Data.com, Desk.com, Einstein, Einstein Analytics, Einstein Discovery, Financial Services Cloud, Force.com, Health Cloud, Heroku, IoT Cloud, Lightning, Marketing Cloud, Pardot, Platform, Quip, Sales Cloud, Salesforce Billing, Salesforce CPQ, Salesforce DMP, Salesforce Inbox, Salesforce Platform, Salesforce Quote-to-Cash, Salesforce1 Mobile, Service Cloud
var loadSessionsByProduct = (tgtProduct) => {
  setTimeout(()=>{
    response.load({objName:'sessions', filter: `products like '%${tgtProduct}%'`, queryXtra: 'limit 3'})
      .then((records)=>{
        console.log('load results:', records);
        console.log('loaded ' + records.length + ' records');
      });
  }, 2*1000);
};

// loadAllSessions();
// loadLeadershipSessions();

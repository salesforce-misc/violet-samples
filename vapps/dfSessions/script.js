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
    "values": ["Agriculture", "Automotive", "Communications", "Consumer Goods", "Education", "Energy", "Financial Services", "Government", "Healthcare", "Financial Services", "High Tech", "Hospitality/Travel", "Life Sciences", "Manufacturing", "Media", "Nonprofit", "Professional Services", "Retail", "Transportation", "Logistics"]
  },

  "theme": {
    "type": "themeType",
    "values": ["Admission/Recruiting", "Advancement/Fundraising", "Apps & Architecture", "Channel Sales Management", "Customer Support", "E-commerce", "Email", "Emerging Small Business", "Emerging Trends", "Enterprise", "Equality", "Forecasting", "Futures Lab", "Gamification", "GDPR", "Innovation", "Integration", "Intelligence", "Internet of Things", "IT Help Desk", "Leadership", "Lightning Adoption", "Marketing Automation", "Mindfulness", "Mobile", "Privacy", "Retail", "Sales Enablement",
                "Sales Productivity", "Salesforce Careers", "Salesforce on Salesforce", "Salesforce Philanthropy", "Security", "Selling with Partners", "Small & Medium Business", "Social Marketing", "Student Success/Community Engagement", "Sustainability", "Thought Leadership", "Tips & Tricks", "Trailhead Learning", "User Experience", "User Interface", "Women in Leadership", "Women in Technology"]
  },

  "role": {
    "type": "roleType",
    "values": ["Architect", "Consultant", "Developer", "E-Commerce", "Entrepreneur", "Executive", "Finance & Accounting", "Human Resources", "IT", "Marketing", "Merchandising", "New Customer", "Operations", "Partner", "Consulting", "Partner", "ISV", "Product Management", "Purchasing & Procurement", "Sales", "Salesforce Administrator", "Service & Support", "Technical Architect"]
  },

  "product": {
    "type": "productType",
    "values": ["Analytics Cloud", "App Cloud", "AppExchange", "Chatter", "Cloud Services", "Commerce Cloud", "Community Cloud", "Data.com", "Desk.com", "Einstein", "Einstein Analytics", "Einstein Discovery", "Financial Services Cloud", "Force.com", "Health Cloud", "Heroku", "IoT Cloud", "Lightning", "Marketing Cloud", "Pardot", "Platform", "Quip", "Sales Cloud", "Salesforce Billing", "Salesforce CPQ", "Salesforce DMP", "Salesforce Inbox", "Salesforce Platform", "Salesforce Quote-to-Cash",
                "Salesforce1 Mobile", "Service Cloud"]
  },

});

// cat = industry, session_theme, role, products
var querySessions = (response, cat, val) => {
  return response.load({
    objName: 'sessions',
    filter: `${cat} ilike '%${val}%' AND session_start_time BETWEEN '2017-11-08 08:00:00'::timestamp AND '2017-11-08 22:00:00'::timestamp`,
    queryXtra: 'order by session_start_time limit 3'
  });
};

var returnWhenSession = (response, cat, val) => {
  if (!val) return response.say(`Sorry, could not identify ${cat} type`);
  return querySessions(response, cat, val)
    .then(rec=>{
      if (!rec) return response.say('Unexpected error');
      response.say(`Found ${rec.length} sessions.`)
      if (rec.length > 0) {
        console.log(rec[0]);
        var startTime = new Date(rec[0].session_start_time);
        response.say(`The session starts at ${startTime.toLocaleTimeString()}`)
      }
    });
}

violet.respondTo(['when is the next [[industry]] session'],
  (response) => {
    return returnWhenSession(response, 'industry', response.get('industry'));
});
violet.respondTo(['when is the next [[theme]] session'],
  (response) => {
    return returnWhenSession(response, 'session_theme', response.get('theme'));
});
violet.respondTo(['when is the next [[role]] session'],
  (response) => {
    return returnWhenSession(response, 'role', response.get('role'));
});
violet.respondTo(['when is the next [[products]] session'],
  (response) => {
    return returnWhenSession(response, 'products', response.get('products'));
});

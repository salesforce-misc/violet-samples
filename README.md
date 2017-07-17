## Table Of Contents

* [Setup](#setup)
* [Getting Started with Voice Scripting](#getting-started-with-voice-scripting)
* [Local execution](#local-execution)
* [Deploying a Conversation Script](#deploying-a-conversation-script)
* [Debugging Conversation](#debugging-conversation)
* [Contribution/Supporting](#contributionsupporting)
* [Filing issues](#filing-issues)


# violet-conversations

`violet-conversations` provides support for building sophisticated
conversational apps/bots on Amazon's Alexa. Conversations are built via scripts,
and Violet provides a conversation engine that runs as an Alexa Skill. This
project is configured to create a skill at the `alexa/einstein` end point.

## Setup

If you are using the Salesforce integration (as used by the Diabetes Script),
then you will need to set up the following environment variables (locally and on
any deployed platform): `V_SFDC_CLIENT_ID`, `V_SFDC_CLIENT_SECRET`,
`V_SFDC_USERNAME` and `V_SFDC_PASSWORD`.

## Getting Started with Voice Scripting

See `server.js` for a typical initialization and script loading code. Every
voice script should start will typically start with declaring `violet` for use
throughout:
```javascript
var violet = require('../lib/violet.js')('einstein');
```

See `examples/tutorial.js` for documentation on how to build a skill.

A simple way to respond to a user request:
```javascript
violet.respondTo(['Can you help me', 'What can I do'],
 (response) => {
   response.say(`I can help you with your current account balance, with
                  financial planning, budgeting, investing, or taking out a
                  loan`);
 });
 ```

## Local execution

Can be run locally to ensure no syntax errors and to view intent schemas (for
the interaction model) and supported utterances.

To run locally `npm install` followed by `npm start`
and view the einstein skill configuration information by going to
 http://localhost:8080/alexa/einstein

## Deploying a Conversation Script

Deploy the service (already has `Procfile` for deploying to `heroku`), and use
those settings to create a new skill at Amazon's Skill Configuration Site:
https://developer.amazon.com/edw/home.html#/skills/list. The skill will be
using a `Custom Interaction Model`, will need values from the services skill
configuration page.

For step-by-step instructions - see here: https://salesforce.quip.com/I8YOAC3Q1UGC

## Debugging Conversation

When developing conversational scripts - it helps to debug/test it in three phrases:
1. Make sure the code compiles/runs by typing `npm start`. Fix any errors and keep re-starting the service until misplaced punctuations and declarations have been fixed.
2. Test the script in the included tester view, by running the script and opening it in a browser, for example: http://localhost:8080/alexa/einstein You will likely want to submit IntentRequest's based on the Utterance's at the bottom of the page. Once you submit a request, verify that the response output SSML is per your needs. Additionally, it is helpful to walk through the script a few times to ensure that the application supports the different user scenarios.
3. Once the script works locally, deploy it to the cloud and configure Alexa to talk to the underlying skill using Amazon's Skill Configuration site. At this stage you will likely benefit from testing by iterating rapidly with: invoking the voice-client, examining the conversational-app's logs, and tweaking the utterances in Amazon's Configuration.

## Contribution/Supporting

We appreciate any help. In order of decreasing priority, we would like to see:

* Sophisticated conversational applications built on top of the `violet-conversations` project. As you build it, let us know how it went. What worked well? What was challenging?

* Tests: If you want to make sure that we improve the framework that we don't break a use case that you are depending on - make sure we have an automated test.

## Filing issues

To help us look into any issue please create a document with the following:
* **Record Type** - Defect or Enhancement?
* **Date**
* **Description**
* **Supporting Information**
  - If **defect**, please include steps to reproduce AND include Violet-Conversation app logs here.
  - If **enhancement**, please include use case info here.
* **Owner** - Who is logging the issue?

Please post any such document in the Violet trailblazer chatter group.

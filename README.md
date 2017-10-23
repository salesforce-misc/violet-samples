[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/sfxi/violet-samples)

# violet-samples

`violet-samples` is a list of example voice app/bot scripts (powered-by
  `violet-conversations`). This
project is configured to create a skill at the `alexa/einstein` end point.

## Table Of Contents

* [Getting Started](#getting-started)
  * [Setup](#setup)
  * [Deploying](#deploying)
* [Contribution/Supporting](#contributionsupporting)
* [Filing issues](#filing-issues)


## Getting Started

This project contains the Conversation Engine and a number of Scripts that we have built and can be used as the basis of your Voice Application. To use the Engine and the Scripts, they need to run in the cloud so that Amazon's voice servers can access it. These can also be run locally via a non-voice (web-only) interface.

### Setup

* Install Node v6 or greater - if you need to maintain an older version of node, consider using `nvm`.

* Get the code: If you want the latest fixes, we would recommend to get this via git: `git clone git@github.com:sfxi/violet-samples.git`. You can alternatively get the (latest release)[https://github.com/sfxi/violet-samples/releases/latest].

* Download dependencies: `npm install`

* Environment variables: If you are using the Salesforce integration plugin (as used by the Leads & Opportunities Script) you will need to set up variables (for more information see
the [Persistence](#persistence) plugin section below).

* Run locally: `node <path_to_script>` (the script will print the path to the
url for the web interface).

    You can also run the full server by doing: `npm start` but you will need to
setup the `SCRIPT_NAME` environment variable so that the engine knows which
script to run (the default value is `../scripts/sf-leadsAndOpportunities.js`).

    Local execution is used to ensure that there are no syntax errors, to view
intent schemas (for the interaction model) and supported utterances, as well as
for testing the script logic.


### Deploying

The code already has a `Procfile` so it is easy to deploy to `heroku`). When deploying make sure to configure the environment variables on the deployed server. Heroku lets you do this by typing something similar to (you will need to use the right values for `XXX`):
```
heroku create
git push heroku master
heroku config:set SCRIPT_NAME=XXX V_SFDC_USERNAME=XXX V_SFDC_PASSWORD=XXX V_SFDC_CLIENT_ID=XXX V_SFDC_CLIENT_SECRET=XXX
```

Once deployed you will need to use your servers settings to create a new skill at [Amazon's Skill Configuration Site](https://developer.amazon.com/edw/home.html#/skills/list). The skill will be
using a `Custom Interaction Model`, will need values from the services skill
configuration page.

For step-by-step instructions - see here: https://salesforce.quip.com/I8YOAC3Q1UGC

If you want to share a Voice Application that you have created without publishing, you might want to consider using a shared Amazon Developer account.

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

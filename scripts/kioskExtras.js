'use strict';

var violet = require('violet-conversations/lib/violet.js').script();
var violetClientTx = require('violet-conversations/lib/violetClientTx.js')(violet);

var aboutSelf = `
  Hi, I'm Einstein, a Salesforce smart, voice-enabled assistant. I'm not
  answering questions about relativity today, but I can help you finding a
  restaurant within the Dreamforce campus, or find the next innovation
  session to attend.
`;
var generalIntro = `
  This is the Einstein Station and was built by the Executive Immersion Team.
  We try to push and explore the tech boundaries so that we can have insights
  on emerging technologies.
`;

violet.respondTo({
  expecting: [
    '{how|} can you help me',
    'what can you do'
  ],
  resolve: (response) => {
   response.say(aboutSelf);
}});

violet.respondTo({
  name: 'Intro',
  expecting: [
    "Introduce yourself",
    "Who are you"
    ],
  resolve: (response) => {
    response.say(generalIntro);
    response.say([
      'Hi! Welcome',
      'Hey! Nice to meet you',
    ]);
    response.say(aboutSelf);
    response.say([
      'Let me know how I can help.',
      'Let me know if I can help.',
      'Feel free to ask me questions.'
    ]);
}});

violet.respondTo({
  name: 'WakeUp',
  expecting: [
    "Wake up"
    ],
  resolve: (response) => {
    response.say([
      'Let me know how I can help.',
      'Let me know if I can help.',
      'Feel free to ask me questions.'
    ]);
}});

violet.respondTo({
  name: 'HowWork',
  expecting: [
    "How do you work"
    ],
  resolve: (response) => {
    response.say(`
      I am constantly seeing through my Camera and trying to figure out where
      people are. It is easy for me to detect faces, though I sometimes do not
      notice when you are talking to each other.
      I am also listening through my Mic array and start trying to understand
      more when you call my name.
      Once I wake up, the audio is processed via Amazons Alexa, and the Violet
      Engine helps in the processing.
    `);
}});

'use strict';

var violetSrvr = require('violet-conversations/lib/violetSrvr')('/alexa');
violetSrvr.listAppsAt('/');
var srvrInstance = violetSrvr.createAndListen(process.env.PORT || 8080);

violetSrvr = require('violet-conversations/lib/violetClientTx')(violetSrvr, srvrInstance);

// violetSrvr.loadScript('tutorials/introduction.js', 'einstein');
// violetSrvr.loadScript('scripts/diabetes-stoplight.js', 'hls');
// violetSrvr.loadScript('scripts/sf-cases-customer.js', 'einstein');
// violetSrvr.loadScript('scripts/sf-cases-employee.js', 'einstein');
// violetSrvr.loadScript('scripts/sf-knowledge-base.js', 'einstein');
// violetSrvr.loadScript('apps/restaurants/script.js,apps/dfSessions/script.js,scripts/kioskExtras.js', 'einstein');
violetSrvr.loadScript(process.env.SCRIPT_NAME || 'scripts/sf-leadsAndOpportunities.js', 'einstein');


console.log('Waiting for requests...');

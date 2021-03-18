// on start up
// load settings
// get all open tabs
// add active tab to pool
// start tabs listener

import { Store } from "./store.js";
import { Tracker } from "./tracker.js";

// tabs listener
// tabs.onCreated - add to pool
// tabs.onActivated - change focus to another tab
// tabs.onUpdated (url change) calculate time spent and remove from pool
// tabs.onRemoved - calculate time spent and remove from pool

// inspiration
// https://chrome.google.com/webstore/detail/webtime-tracker/ppaojnbmmaigjmlpjaldnkgnklhicppk

(async function () {
  const store = new Store();
  new Tracker(store);
})();

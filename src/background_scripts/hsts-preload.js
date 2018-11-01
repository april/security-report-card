import * as icon from './icon';

import { addScan, initScan } from './redux/actions'
import store from './redux/store';


export const NAME = 'HSTS Preloaded';
export const SITE = 'https://hstspreload.org';
export const API = `${SITE}/api/v2`;


const COMPLETED_STATES = ['ABORTED', 'FAILED', 'FINISHED'];
const RESCAN_DELTA = 86400000;  // one day
const MAX_ATTEMPTS = 20;
const SLEEP_TIME = 1000;  // one second


// this is the function that goes out to the Observatory and makes the scan
const scan = async (hostname) => {
  const response = await fetch(`${API}/status?domain=${hostname}`, {
    method: 'GET',
  });

  return await response.json();
};


export const get = async (hostname) => {
  const storedScan = store.getState().scans.hstsPreload[hostname];
  let count = 0;
  let resp = {};

  // first, let's check to see if we have recent results - if we do, we simply
  // return the cached results
  if (!storedScan) {
    store.dispatch(initScan('hstsPreload', hostname));
  } else if (storedScan.state === 'FINISHED') {
    return storedScan;
  } else if (storedScan === 'PENDING') {
    console.log(`Warning: Duplicate ${NAME} scan detected - aborting.`);
    return;
  }

  // if the scan is already pending, there's another thread doing it
  if (!storedScan) {
    
  } else if (storedScan.state === 'PENDING') {
    return {};
  }

  resp = await scan(hostname);
  store.dispatch(addScan('hstsPreload', hostname, resp));

  return resp;
};

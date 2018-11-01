import * as icon from './icon';
import { sleep } from './utils';

import { addScan, initScan } from './redux/actions'
import store from './redux/store';


export const API = 'https://http-observatory.security.mozilla.org/api/v1';
export const NAME = 'Mozilla HTTP Observatory';
export const SITE = 'https://observatory.mozilla.org';

const COMPLETED_STATES = ['ABORTED', 'FAILED', 'FINISHED'];
const RESCAN_DELTA = 86400000;  // one day
const MAX_ATTEMPTS = 20;
const SLEEP_TIME = 1000;  // one second


// this is the function that goes out to the Observatory and makes the scan
const scan = async (hostname) => {
  const formData = new FormData();
  formData.append('hidden', 'true');
  formData.append('rescan', 'false');

  const response = await fetch(`${API}/analyze?host=${hostname}`, {
    body: formData,
    method: 'POST',
  });

  return await response.json();
};


export const get = async (hostname, tabId) => {

  const storedScan = store.getState().scans.httpObservatory[hostname];
  let count = 0;
  let resp = {};

  // first, let's check to see if we have recent results - if we do, we simply
  // return the cached results
  if (!storedScan) {
    // pass
  }
  else if (storedScan.state === 'PENDING') {
    console.log(`Warning: Duplicate ${NAME} scan detected - aborting.`);
    return;
  }
  else if (storedScan.state == 'FINISHED' &&
           new Date() - new Date(storedScan.data.start_time) < RESCAN_DELTA) {
    await icon.update(storedScan.data.grade, tabId);  // HTTP Observatory has master control over the badge text
    return storedScan.data;
  }

  // if we've got this far, it's time to dispatch a scan
  store.dispatch(initScan('httpObservatory', hostname));

  // we'll only scan MAX_ATTEMPTS time, sleeping SLEEP_TIME_MS between each scan
  while (count < MAX_ATTEMPTS) {
    count += 1;

    resp = await scan(hostname);

    if (COMPLETED_STATES.includes(resp.state)) {
      if (resp.state == 'FINISHED') {
        store.dispatch(addScan('httpObservatory', hostname, resp));
        await icon.update(resp.grade, tabId);  // only if the scan had successfully finished
      }

      break;
    }

    // if the scan hasn't finished, let's sleep for a little bit and try again
    await sleep(SLEEP_TIME);
  }

  return resp;
};

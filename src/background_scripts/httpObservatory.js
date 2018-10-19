import * as icon from './icon';
import { sleep } from './utils';

export const API = 'https://http-observatory.security.mozilla.org/api/v1';
export const SITE = 'https://observatory.mozilla.org';

const COMPLETED_STATES = ['ABORTED', 'FAILED', 'FINISHED'];
const RESCAN_DELTA = 86400000;  // one day
const MAX_ATTEMPTS = 20;
const SLEEP_TIME = 1000;  // one second

const results = {};


export const open = async (hostname) => {
  console.log('hey we are opening a tab');
  browser.tabs.create({
    url: `${SITE}/analyze/${hostname}`,
  })
};


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
  let count = 0;
  let resp = {};

  // first, let's check to see if we have recent results - if we do, we simply
  // return the cached results
  if (results[hostname] &&
      results[hostname].state == 'FINISHED' &&
      new Date() - new Date(results[hostname].start_time) < RESCAN_DELTA) {
    await icon.update(results[hostname], tabId);
    return results[hostname];
  }

  // we'll only scan MAX_ATTEMPTS time, sleeping SLEEP_TIME_MS between each scan
  while (count < MAX_ATTEMPTS) {
    count += 1;

    resp = await scan(hostname);

    if (COMPLETED_STATES.includes(resp.state)) {
      if (resp.state == 'FINISHED') {
        results[hostname] = resp;
        await icon.update(resp, tabId);  // only if the scan had successfully finished
      }

      break;
    }

    // if the scan hasn't finished, let's sleep for a little bit and try again
    await sleep(SLEEP_TIME);
  }

  return results[hostname];
};

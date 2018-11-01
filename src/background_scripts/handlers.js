import * as httpObservatory from './http-observatory';
import * as hstsPreload from './hsts-preload';
import store from './redux/store';


const initiateScans = (hostname, tabId) => {
  hstsPreload.get(hostname);
  httpObservatory.get(hostname, tabId);
}

// when we get the first response back from the website, initiate the scan
browser.webRequest.onResponseStarted.addListener(
  async (details) => {
    const hostname = new URL(details.url).hostname;

    // check to see if we're in a private tab - if we are, we simply disable
    // the icon and exit
    const tab = await browser.tabs.get(details.tabId);
    if (tab.incognito) {
      browser.browserAction.disable(details.tabId);
      return;
    }

    // update to spinner icon
    await browser.browserAction.setIcon({
      path: 'icons/spinner.svg',
      tabId: details.tabId,
    });

    // initiate all our scans
    initiateScans(hostname, details.tabId);
  },
  {urls: ["http://*/*", "https://*/*"], types: ["main_frame"]}
);


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // kick things back if we're not in a child
  if (sender.envType !== 'addon_child') {
    sendResponse({});
  }

  // todo: lock this down further
  switch (request.action) {
    case 'getStore':
      sendResponse(store.getState());
      break;
    case 'initiateScans':  // popup initiating a scan
      initiateScans(request.hostname, request.tabId);
      sendResponse({});
      break;
  }
});

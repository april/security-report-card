import * as httpObservatory from './httpObservatory';


// when we get the first response back from the website, initiate the scan
browser.webRequest.onResponseStarted.addListener(
  async (details) => {

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

    httpObservatory.get(new URL(details.url).hostname, details.tabId);
  },
  {urls: ["http://*/*", "https://*/*"], types: ["main_frame"]}
);


// here is the handler for clicking the browserAction (aka the icon)
browser.browserAction.onClicked.addListener(async (details) => {
  // get the current tab hostname
  if (details.url !== undefined) {
    const hostname = new URL(details.url).hostname;

    await httpObservatory.open(hostname);
  }
});

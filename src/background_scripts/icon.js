let FF_MAJOR_VERSION;
browser.runtime.getBrowserInfo().then((info) => {
  FF_MAJOR_VERSION = parseInt(info.version.split('.')[0]);
});


// this updates the icon to show the letter grade and score, as well as
// sets the text that you get on hovering to the full Observatory result
// object
export const update = async (grade, tabId) => {
  const colors = {
    'A': {
      background: 'rgb(45, 136, 45)',
      color: 'rgb(255, 255, 255)',
    },
    'B': {
      background: 'rgb(170, 170, 57)',
      color: 'rgb(255, 255, 255)',
    },
    'C': {
      background: 'rgb(170, 112, 57)',
      color: 'rgb(255, 255, 255)',
    },
    'D': {
      background: 'rgb(101, 39, 112)',
      color: 'rgb(255, 255, 255)',
    },
    'F': {
      background: 'rgb(170, 57, 57)',
      color: 'rgb(255, 255, 255)',
    }
  };

  // update the badge and its color, reset the spinner, and add the hover text
  // unfortunately, FF 62 doesn't support setting the text color, so we have to
  // disable it for <63
  let funcs = [
    browser.browserAction.setBadgeBackgroundColor({
      color: colors[grade[0]].background,
      tabId: tabId,
    }),

    browser.browserAction.setBadgeText({
      text: grade,
      tabId: tabId,
    }),

    browser.browserAction.setIcon({
      path: undefined,
      tabId: tabId,
    }),
  ];

  // we can change the badge color if on FF63
  if (FF_MAJOR_VERSION >= 63) {
    funcs.push(
      browser.browserAction.setBadgeTextColor({
        color: colors[grade[0]].color,
        tabId: tabId,
      })
    )
  }

  await Promise.all(funcs);
}

// this updates the icon to show the letter grade and score, as well as
// sets the text that you get on hovering to the full Observatory result
// object
export const update = async (results, tabId) => {
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
  await Promise.all([
    browser.browserAction.setBadgeBackgroundColor({
      color: colors[results.grade[0]].background,
      tabId: tabId,
    }),

    browser.browserAction.setBadgeText({
      text: results.grade,
      tabId: tabId,
    }),

    browser.browserAction.setBadgeTextColor({
      color: colors[results.grade[0]].color,
      tabId: tabId,
    }),

    browser.browserAction.setIcon({
      path: undefined,
      tabId: tabId,
    }),

    browser.browserAction.setTitle({
      title: `The full results are:\n\n${JSON.stringify(results, null, 2)}`,
      tabId: tabId,
    })
  ]);
}

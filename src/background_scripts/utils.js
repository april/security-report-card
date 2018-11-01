export const getCurrentTabId = async () => {
  const tab = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tab[0].id;
};


// sleep for any number of milliseconds
export const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
};

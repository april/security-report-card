// open a tab next to the current one, instead of a new window
export const sameWindowLinkOpener = async (e) => {
  // popups are annoying in how they behave this way
  e.preventDefault();

  browser.tabs.create({
    url: e.target.getAttribute('href'),
  });
}

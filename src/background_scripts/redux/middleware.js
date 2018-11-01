import store from './store';


// when we get a new state, we have to send out a notification in case a popup is open,
// so that it can update its state
export const stateUpdatedNotifier = store => next => action => {
  const result = next(action);

  browser.runtime.sendMessage({
      action: 'updateState',
      state: store.getState(),
  }).then().catch();  // ignore errors sent because popup doesn't exist

  return result;
};

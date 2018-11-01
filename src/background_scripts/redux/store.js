import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import { stateUpdatedNotifier } from './middleware';

export default createStore(
  rootReducer,
  applyMiddleware(stateUpdatedNotifier)
);

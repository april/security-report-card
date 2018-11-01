import { ADD_SCAN, INIT_SCAN } from '../actionTypes';

const initialState = {
  hstsPreload: {},
  httpObservatory: {},
};


// barf grr
export default function(state = initialState, action) {
  let newState;

  switch (action.type) {
    case ADD_SCAN:
      // [ source, hostname, data ] = action.payload;
      newState = { ...state };

      newState[action.payload.source][action.payload.hostname] = {
        state: 'FINISHED',
        data: action.payload.data,
      }

      return newState;
    case INIT_SCAN:
      // [ source, hostname ] = action.payload;
      newState = { ...state };
      newState[action.payload.source][action.payload.hostname] = {
        state: 'PENDING',
        data: {},
      }

      return newState;
    default:
      return state;
  }
}

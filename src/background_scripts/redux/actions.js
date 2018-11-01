import { ADD_SCAN, INIT_SCAN } from './actionTypes';


export const addScan = (source, hostname, data) => ({
  type: ADD_SCAN,
  payload: {
    source,
    hostname,
    data,
  }
});

export const initScan = (source, hostname) => ({
  type: INIT_SCAN,
  payload: {
    source,
    hostname,
  }
});

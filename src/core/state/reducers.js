import * as types from './types';

export default {
  [types.SET_SELECTED_ITEMS]: (state, payload) => {
    return {
      ...state,
      [types.ITEMS_SELECTED]: payload,
    };
  },
  [types.SET_WORKING_PATH]: (state, payload) => {
    return {
      ...state,
      [types.WORKING_PATH]: payload,
    };
  },
};

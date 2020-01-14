import * as types from './types';

export default {
  [types.SET_WORKING_PATH]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        path: payload,
      },
    };
  },
  [types.SET_ENTRIES]: (state, {payload}) => {
    return {
      ...state,
      general: {
        ...state.general,
        entries: payload,
      },
    };
  },
};

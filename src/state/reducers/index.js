const reducers = {};
const createReducer = handlers => (state, action) => {
  if (!handlers.hasOwnProperty(action.type)) {
    return state;
  }

  return handlers[action.type](state, action);
};

export const addReducer = (key, fn) => {
  reducers[key] = fn;
};

export default function() {
  return createReducer(reducers);
};

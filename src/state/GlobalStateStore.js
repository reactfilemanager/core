import {EventBus} from '../helpers/Utils';

const state = {};
const reducers = {};


EventBus.$on('STORE', payload => {
  Store.$dispatch(payload.id, payload.value);
});
EventBus.$on('READ', payload => {
  const store = Store.$get(payload.store);
  if (store[payload.id] !== undefined) {
    payload.callback(store[payload.id]);
  }
  else {
    payload.callback(null);
  }
});

export const Store = {
  $addState(id, initialValue, _reducers) {
    state[id] = initialValue;
    for (const key of Object.keys(_reducers)) {
      reducers[key] = value => state[id] = _reducers[key](state[id], value);
    }
  },
  $dispatch(id, value) {
    if (reducers[id]) {
      reducers[id](value);
    }
  },
  $get(store) {
    return state[store];
  },
};
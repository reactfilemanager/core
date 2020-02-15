import {EventBus} from '../helpers/Utils';

const state = {
  path: '/',
  selectedItems: [],
  sidePanels: {},
  injectedPanels: {},
  modal: null,
};

const reducers = {};

// region: side panel
export const addSidePanel = (id, panel) => {
  state.sidePanels[id] = panel;
};

export const removeSidePanel = id => {
  if (!id) {
    state.sidePanels = {};
  }
  delete state.sidePanels[id];
};

export const getSidePanels = () => {
  return state.sidePanels;
};
// endregion

// region: injected panel
export const injectPanel = (id, panel) => {
  state.injectedPanels[id] = panel;
};

export const removePanel = id => {
  if (!id) {
    state.injectedPanels = {};
  }
  delete state.injectedPanels[id];
};

export const getInjectedPanels = () => {
  return state.injectedPanels;
};
// endregion

// region: modal
export const setModal = modal => {
  state.modal = modal;
};
export const removeModal = () => {
  state.modal = null;
};
export const getModal = () => {
  return state.modal;
};

// region: selected items
export const itemSelected = item => {
  state.selectedItems.push(item);
};
export const itemDeselected = item => {
  state.selectedItems = state.selectedItems.filter(_item => _item.id !== item.id);
};
export const getSelectedItems = () => {
  return state.selectedItems;
};
// endregion

// region: working path
export const setWorkingPath = path => {
  state.path = path;
};
export const getWorkingPath = path => {
  return state.path;
};
// endregion

EventBus.$on('STORE', payload => {
  Store.$dispatch(payload.id, payload.value);
});
EventBus.$on('READ', payload => {
  payload.callback(Store.$get(payload.id));
});

export const Store = {
  $addState(id, initialValue, _reducers) {
    state[id] = initialValue;
    for (const key of Object.keys(_reducers)) {
      reducers[key] = value => state[id] = _reducers[key](state[id], value);
    }
  },
  $dispatch(id, value) {
    if(reducers[id]) {
      reducers[id](value);
    }
  },
  $get(id) {
    return state[id];
  },
};
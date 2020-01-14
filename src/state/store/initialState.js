let state = {};

export const appendState = (key, _state) => {
  state = {...state, [key]: _state};
};

export default () => state;

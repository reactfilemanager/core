import React, {Component} from 'react';
import {useStore} from '../../../state/store';

export default () => {
  const {state, dispatch} = useStore;

  return (
      <div>
        Controls line 1 (defaults)
      </div>
  );
}

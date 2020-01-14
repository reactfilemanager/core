import React from 'react';
import TabContent from './TabContent';

export default function() {
  const [state, dispatch] = window.useStore();

  return (
      <TabContent state={state.general} dispatch={dispatch}/>
  );
}

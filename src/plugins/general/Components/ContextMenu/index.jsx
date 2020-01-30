import React from 'react';
import {connectMenu, ContextMenu, MenuItem} from 'react-contextmenu';

export const CONTEXT_MENU_ID = 'hive-fm-context-menu';

const handleClick = (e) => {
  console.log(e);
};

export default connectMenu(CONTEXT_MENU_ID)(function(props) {
  const {id, trigger} = props;
  console.log(id, trigger, trigger ? trigger.onItemClick : '');
  return (
      <div>
        <ContextMenu id={CONTEXT_MENU_ID}>
          <MenuItem data={{foo: 'bar'}}>
            ContextMenu Item 1
          </MenuItem>
          <MenuItem data={{foo: 'bar'}}>
            ContextMenu Item 2
          </MenuItem>
          <MenuItem divider/>
          <MenuItem data={{foo: 'bar'}}>
            ContextMenu Item 3
          </MenuItem>
        </ContextMenu>
      </div>
  );
});
import React from 'react';
import {connectMenu, ContextMenu, MenuItem, SubMenu} from 'react-contextmenu';
import {getContextMenu, getHandlers} from '../../tools/config';
import icons from '../../../../assets/icons';

export const CONTEXT_MENU_ID = 'hive-fm-context-menu';

export default connectMenu(CONTEXT_MENU_ID)(function(props) {

  const {trigger} = props;
  if (trigger === null) {
    return (<ContextMenu id={CONTEXT_MENU_ID}>
      <MenuItem>Patch for re-render</MenuItem>
    </ContextMenu>);
  }

  const {item} = trigger;
  const menu_items = getContextMenu(item);
  const handlers = getHandlers(item);
  let firstHandler = null;
  const handlersKeys = Object.keys(handlers);
  if (handlersKeys.length > 0) {
    firstHandler = handlers[handlersKeys[0]];
  }

  return (
      <ContextMenu id={CONTEXT_MENU_ID}>
        {firstHandler
            ? <MenuItem onClick={firstHandler.handle}>
              {icons.preview}
              {firstHandler.type === 'preview'
                  ? 'Preview'
                  : 'Open'}
            </MenuItem>
            : null}
        {handlersKeys.length
            ? <SubMenu title="Open With">
              {handlersKeys.map(key => (
                  <MenuItem key={key} onClick={handlers[key].handle}>
                    {handlers[key].menu_item.icon} {handlers[key].menu_item.title}
                  </MenuItem>
              ))}
            </SubMenu>
            : null}
        {
          Object.keys(menu_items).map(key => (
              <MenuItem key={key} onClick={menu_items[key].handle}>
                {menu_items[key].menu_item.icon} {menu_items[key].menu_item.title}
              </MenuItem>
          ))
        }
      </ContextMenu>
  );
});
/** @jsx jsx */
import {jsx, Divider} from 'theme-ui';
import styled from '@emotion/styled';
import React from 'react';
import {connectMenu, ContextMenu, MenuItem, SubMenu} from 'react-contextmenu';
import {getContextMenu, getHandlers} from '../../tools/config';
import icons from '../../../../assets/icons';

export const CONTEXT_MENU_ID = 'hive-fm-context-menu';

export default connectMenu(CONTEXT_MENU_ID)(function(props) {

  const [state, dispatch] = useStore();

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
      <ContextMenu
          id={CONTEXT_MENU_ID}
          style={{
            background: 'white',
            boxShadow: '0 0 4px #ccc',
            borderRadius: '3px',
            width: '180px',
          }}>
        {firstHandler
            ? <>
              <Menu onClick={() => firstHandler.handle(item, state, dispatch)}>
                {icons.preview}
                {firstHandler.type === 'preview' ? ' Preview' : ' Open'}
              </Menu>
              {/* <Divider/> */}
            </>
            : null}
        {handlersKeys.length > 1
            ? <SubMenu title="Open With">
              {handlersKeys.map(key => (
                  <Menu key={key} onClick={() => handlers[key].handle(item, state, dispatch)}>
                    {handlers[key].menu_item.icon} {handlers[key].menu_item.title}
                  </Menu>
              ))}
            </SubMenu>
            : null}
        {
          Object.keys(menu_items).map(key => (
              <Menu
                  key={key}
                  onClick={() => menu_items[key].handle(item, state, dispatch)}
                  sx={{}}
              >
                {menu_items[key].menu_item.icon} {menu_items[key].menu_item.title}
              </Menu>
          ))
        }
      </ContextMenu>
  );
});

const Menu = styled(MenuItem)`
  cursor: pointer;
  padding: 8px 10px;
  font-size: 12px;
  text-transform: uppercase;
  color: #999;
  display: flex;
  &:hover{
    background: #eee;
    color: #000;
  }

  svg{
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
`;
/** @jsx jsx */
import { jsx, Flex, Box } from 'theme-ui'

import Breadcrumb from '../Breadcrumb';
import ItemList from '../ItemList';
import Toolbar from '../Toolbar';
import {getConfig, getDefaultConfig} from '../../tools/config';
import DirectoryTree from '../DirectoryTree';
import icons from '../../../../assets/icons';
import {removeModal, removeSidePanel} from '../../state/actions';
import Dialog from 'rc-dialog';

export default function() {
const [state, dispatch] = window.useStore();
const defaultConfig = getDefaultConfig();
const config = getConfig();
const sidebar_components = state.general.sidebar_components;
const hasSidebarComponent = Object.keys(sidebar_components).length;
const Modal = state.general.modal;
const hasModal = !!Modal;

const closeSidebar = () => {
  dispatch(removeSidePanel());
};

  return (
    <div
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        minHeight: '100vh',
      }}>
      <aside
        sx={{
          flexGrow: 1,
          flexBasis: 'sidebar',
          background: 'gray',
          borderRight: '1px solid #ddd',
          height: 'auto',
        }}>
        
        <DirectoryTree state={state.general} dispatch={dispatch} />
        
      </aside>
      <main
        sx={{
          flexGrow: 99999,
          flexBasis: 0,
          minWidth: 320,
        }}>
        <header sx={{
          background: 'lightGray',
        }}>
          <div sx={{
            borderBottom: '1px solid #ddd',
            borderTop: '1px solid #ddd'
          }}>
            <Toolbar
              state={state.general}
              dispatch={dispatch}
              children={defaultConfig.toolbar}
            />

            {config.toolbar ?
              <Toolbar
                  state={state.general}
                  dispatch={dispatch}
                  children={config.toolbar}
              />
            : null}
          </div>
          
          <div
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              borderBottom: '1px solid #ddd',
              p: 2
            }}>
              <div sx={{
                width: 'breadcrumb',
              }}>
                <Breadcrumb path={state.general.path} dispatch={dispatch} />
              </div>
            {defaultConfig.secondary_toolbar
                ? <Toolbar
                    state={state.general}
                    dispatch={dispatch}
                    children={defaultConfig.secondary_toolbar}/>
                : null}
            {/*<div sx={{*/}
            {/*  width: 'utility',*/}
            {/*}}>*/}
            {/*  Grid/List*/}
            {/*</div>*/}
            {/*<div*/}
            {/*sx={{*/}
            {/*  width: 'search',*/}
            {/*}}>Search...</div>*/}
          </div>

        </header>
        <div>
          <ItemList state={state.general} dispatch={dispatch} />

          {hasSidebarComponent
            ? <Box>
                  <span onClick={closeSidebar}>{icons.close}</span>
              {Object.keys(sidebar_components).map(key => {
                const Component = sidebar_components[key];
                return (
                      <Component key={key} id={key} state={state} dispatch={dispatch}/>
                    );
              })}
            </Box>
                : null}
            <Dialog onClose={() => dispatch(removeModal())} visible={hasModal}>
              {hasModal
                ? <Modal state={state} dispatch={dispatch}/>
                : null}
            </Dialog>
        </div>
      </main>
    </div>

  );
}

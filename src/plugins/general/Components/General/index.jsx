/** @jsx jsx */
import {jsx, Box, Flex} from 'theme-ui';

import Breadcrumb from './Breadcrumb';
import ItemList from './ItemList';
import Toolbar from '../Toolbar';
import {getConfig, getDefaultConfig} from '../../tools/config';
import DirectoryTree from './DirectoryTree';
import icons from '../../../../assets/icons';
import {removeModal, removeSidePanel} from '../../state/actions';
import {SkyLightStateless} from 'react-skylight';
import ContextMenu from '../ContextMenu';

export default function() {
  const [state, dispatch] = window.useStore();
  const defaultConfig = getDefaultConfig();
  const config = getConfig();
  const sidebar_components = state.general.sidebar_components;
  const hasSidebarComponent = Object.keys(sidebar_components).length;
  const Modal = state.general.modal;
  const hasModal = !!Modal;
  const InjectedComponent = state.general.injected_component;
  const hasInjectedComponent = !!InjectedComponent;

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
              maxWidth: 'sidebar'
            }}>

          <DirectoryTree state={state.general} dispatch={dispatch}/>

          <Flex sx={{
            position: 'fixed',
            justifyContent: 'space-between',
            bottom: 0,
            width: 'sidebar',
            background: '#f5f5f5',
            borderTop: '1px solid #ddd',
            borderRight: '1px solid #ddd',
            py: 2,
            px: 3,

            '*':{
              fontSize: 12,
              color: 'gray',
              textTransform: 'uppercase'
            },
            'svg':{
              widht: '12px', height: '12px'
            }
          }}>
            <span>Version</span>
            <span>
              {icons.info} Help
            </span>
          </Flex>

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

            <Flex
              sx={{
                flexWrap: 'wrap',
                alignItems: 'center',
                borderBottom: '1px solid #ddd',
                p: 2,
              }}>
              <Flex sx={{
                width: 'toolbar',
              }}>
                {/* <Breadcrumb path={state.general.path} dispatch={dispatch}/> */}
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
              </Flex>

              <div
                  sx={{
                    width: 'utility',
                  }}>
                {
                  defaultConfig.utility ?
                      <Toolbar
                          state={state.general}
                          dispatch={dispatch}
                          children={defaultConfig.utility}/>
                      : null
                }
              </div>
              <div
                  sx={{
                    width: 'search',
                  }}>
                {
                  defaultConfig.search ?
                      <Toolbar
                          state={state.general}
                          dispatch={dispatch}
                          children={defaultConfig.search}/> : null
                }
              </div>
            </Flex>

          </header>
          <div>
            <ItemList state={state.general} dispatch={dispatch}/>

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
          </div>
        </main>
        <SkyLightStateless
          afterClose={() => dispatch(removeModal())}
          closeOnEsc
          isVisible={hasModal}
          onCloseClicked={() => dispatch(removeModal())}
          dialogStyles={ModalDialogStyle}
        >
          {hasModal
              ? <Modal state={state} dispatch={dispatch}/>
              : null}
        </SkyLightStateless>
        {hasInjectedComponent
            ? <InjectedComponent state={state} dispatch={dispatch}/>
            : null}
        <ContextMenu/>
      </div>

  );
}

const ModalDialogStyle = {
  minHeight: '200px'
}
const ModalTitleStyle = {
  margin: '0',
  display: 'none'
}
/** @jsx jsx */
import {jsx, Flex} from 'theme-ui';
import React from 'react'
import styled from '@emotion/styled';
import ItemList from './Components/ItemList';
import Toolbar from './Components/Toolbar';
import {getConfig, getDefaultConfig, setAccessor} from './tools/config';
import DirectoryTree from './Components/DirectoryTree';
import icons from '../assets/icons';
import {removeModal, removeSidePanel} from './state/actions';
import {SkyLightStateless} from 'react-skylight';
import ContextMenu from './Components/ContextMenu';
import Breadcrumb from './Components/Breadcrumb'
import {SmoothScroll} from '../helpers/Utils';
import {getSelectedItems} from './models/FileInfo';

export default function() {
  const [state, dispatch] = window.useStore();

  setAccessor({
    getSelectedItems() {
      return getSelectedItems(state.core.entries);
    },
  });

  const defaultConfig = getDefaultConfig();
  const config = getConfig();
  const sidebar_components = state.core.sidebar_components;
  const hasSidebarComponent = Object.keys(sidebar_components).length;
  const Modal = state.core.modal;
  const hasModal = !!Modal;
  const InjectedComponent = state.core.injected_component;
  const hasInjectedComponent = !!InjectedComponent;

  const goToTop = () => SmoothScroll.scrollTo('fm-content-holder');

  const closeSidebar = () => {
    dispatch(removeSidePanel());
  };

  return (
    <div>
      <header sx={{
        background: 'lightGray',
        position: 'sticky', top: 0, left: 0, right: 0,
        zIndex: '9',
        width: '100%', height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #ddd',
        py: 2, px: 3
      }}>
        <Flex>
          <Toolbar
              state={state.core}
              dispatch={dispatch}
              children={defaultConfig.toolbar}
          />

          {config.toolbar ?
              <Toolbar
                  state={state.core}
                  dispatch={dispatch}
                  children={config.toolbar}
              />
              : null}
        </Flex>

        <Flex sx={{ alignItems: 'center',}}>
          <div>
            {
            defaultConfig.utility ?
              <Toolbar
                state={state.core}
                dispatch={dispatch}
                children={defaultConfig.utility}/>
              : null
            }
          </div>
          <>
            {
            defaultConfig.search ?
              <Toolbar
                state={state.core}
                dispatch={dispatch}
                children={defaultConfig.search}/> : null
            }
          </>
        </Flex>
      </header>

      <Flex bg="white" sx={{width: '100%'}}>
        <aside
          sx={{
            flexGrow: 1,
            flexBasis: 'sidebar',
            background: 'gray',
            borderRight: '1px solid #ddd',
            height: 'calc(100vh - 85px)',
            width: 'sidebar',
            overflowX: 'hidden',
            overflowY: 'auto',
          }}>

          <DirectoryTree state={state.core} dispatch={dispatch}/>

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

            '*': {
              fontSize: 12,
              color: 'gray',
              textTransform: 'uppercase',
            },
            'svg': {
              widht: '12px', height: '12px',
            },
          }}>
            <Link href="#!" onClick={goToTop}>
              {icons.arrow_up} Back To Top
            </Link>
            <Link href="https://www.themexpert.com" target="_blank">
              {icons.info} ThemeXpert
            </Link>
          </Flex>

        </aside>
        <main
          sx={{
            flexGrow: 99999,
            flexBasis: 0,
            height: 'calc(100vh - 50px)',
            overflowX: 'hidden',
            overflowY: 'auto',
        }}>
          
          <div sx={{ 
            py: 2, px: 3, 
            borderBottom: '1px solid #ddd'
          }}>
            <Breadcrumb path={state.core.path} dispatch={dispatch} />
          </div>

          <ItemList state={state.core} dispatch={dispatch}/>

          {hasSidebarComponent
              ? <div>
                <span onClick={closeSidebar}>{icons.close}</span>
                {Object.keys(sidebar_components).map(key => {
                  const Component = sidebar_components[key];
                  return (
                      <Component key={key} id={key} state={state}
                                  dispatch={dispatch}/>
                  );
                })}
              </div>
              : null}
        </main>
      </Flex>

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
  minHeight: '200px',
};
const Link = styled.a`
  text-decoration: none;
`;
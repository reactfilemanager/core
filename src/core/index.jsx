/** @jsx jsx */
import {jsx, Flex} from 'theme-ui';
import React from 'react';
import styled from '@emotion/styled';
import ItemList from './Components/ItemList';
import Toolbar from './Components/Toolbar';
import {getConfig, getDefaultConfig, setAccessor} from './tools/config';
import DirectoryTree from './Components/DirectoryTree';
import icons from '../assets/icons';
import {SkyLightStateless} from 'react-skylight';
import ContextMenu from './Components/ContextMenu';
import Breadcrumb from './Components/Breadcrumb';
import {SmoothScroll} from '../helpers/Utils';
import {CORE_PLUGIN_KEY} from './plugin';
import {REMOVE_MODAL, REMOVE_SIDE_PANEL} from './state/types';
import {setWorkingPath} from './state/actions';

export default class FileManagerCore extends React.Component {

  componentDidMount() {
    setAccessor({
      getSelectedItems() {
        return [];
      },
    });
    setWorkingPath('');
  }

  goToTop = () => SmoothScroll.scrollTo('fm-content-holder');

  closeSidebar = () => {
    this.props.store.$dispatch(REMOVE_SIDE_PANEL);
  };

  removeModal = () => {
    this.props.store.$dispatch(REMOVE_MODAL);
  };

  render() {
    const state = this.props.store.$get(CORE_PLUGIN_KEY);
    const defaultConfig = getDefaultConfig();
    const config = getConfig();
    const sidebar_components = state.sidebar_components;
    const hasSidebarComponent = Object.keys(sidebar_components).length;
    const Modal = state.modal;
    const hasModal = !!Modal;
    const InjectedComponent = state.injected_component;
    const hasInjectedComponent = !!InjectedComponent;

    return (
        <div>
          <header sx={{
            background: 'lightGray',
            position: 'sticky', top: 0, left: 0, right: 0,
            zIndex: '9999',
            width: '100%', height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #ddd',
            py: 2, px: 3,
          }}>
            <Flex>
              <Toolbar children={defaultConfig.toolbar}
              />

              {config.toolbar ?
                  <Toolbar children={config.toolbar}
                  />
                  : null}
            </Flex>

            <Flex sx={{alignItems: 'center'}}>
              <div>
                {
                  defaultConfig.utility ?
                      <Toolbar children={defaultConfig.utility}/>
                      : null
                }
              </div>
              <>
                {
                  defaultConfig.search ?
                      <Toolbar children={defaultConfig.search}/> : null
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
                  height: '100vh',
                  width: 'sidebar',
                  overflowX: 'hidden',
                  overflowY: 'auto',
                }}>

              <DirectoryTree/>

              {/* <Flex sx={{
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
          </Flex> */}

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
                borderBottom: '1px solid #ddd',
              }}>
                <Breadcrumb/>
              </div>

              <ItemList/>

          {/*    {hasSidebarComponent*/}
          {/*        ? <div>*/}
          {/*          <span onClick={this.closeSidebar}>{icons.close}</span>*/}
          {/*          {Object.keys(sidebar_components).map(key => {*/}
          {/*            const Component = sidebar_components[key];*/}
          {/*            return (*/}
          {/*                <Component key={key} id={key}/>*/}
          {/*            );*/}
          {/*          })}*/}
          {/*        </div>*/}
          {/*        : null}*/}
            </main>
          </Flex>

          {/*<SkyLightStateless*/}
          {/*    afterClose={this.removeModal}*/}
          {/*    closeOnEsc*/}
          {/*    isVisible={hasModal}*/}
          {/*    onCloseClicked={this.removeModal}*/}
          {/*    dialogStyles={ModalDialogStyle}*/}
          {/*>*/}
          {/*  {hasModal*/}
          {/*      ? <Modal/>*/}
          {/*      : null}*/}
          {/*</SkyLightStateless>*/}
          {/*{hasInjectedComponent*/}
          {/*    ? <InjectedComponent/>*/}
          {/*    : null}*/}
          {/*<ContextMenu/>*/}
        </div>

    );
  }
}
const ModalDialogStyle = {
  minHeight: '200px',
};
const Link = styled.a`
  text-decoration: none;
`;
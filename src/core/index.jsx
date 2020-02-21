/** @jsx jsx */
import {jsx, Flex} from 'theme-ui';
import React from 'react';
import styled from '@emotion/styled';
import ItemList from './Components/ItemList';
import Toolbar from './Components/Toolbar';
import {getConfig, getDefaultConfig, setAccessor} from './tools/config';
import DirectoryTree from './Components/DirectoryTree';
import ContextMenu from './Components/ContextMenu';
import Breadcrumb from './Components/Breadcrumb';
import {EventBus, SmoothScroll} from '../helpers/Utils';
import {CORE_PLUGIN_KEY} from './plugin';
import * as types from './state/types';
import {setWorkingPath} from './state/actions';
import Modal from './Components/Containers/Modal';
import InjectedComponent from './Components/Containers/InjectedComponent';
import SidebarComponents from './Components/Containers/SidebarComponents';

export default class FileManagerCore extends React.Component {

  componentDidMount() {
    setAccessor({
      getSelectedItems() {
        return [];
      },
    });
    // FIXME: set default dir
    setWorkingPath('');

  }
  goToTop = () => SmoothScroll.scrollTo('fm-content-holder');

  render() {
    const defaultConfig = getDefaultConfig();
    const config = getConfig();

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

              {/*<DirectoryTree/>*/}

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

               {/*injected sidebar components*/}
              <SidebarComponents/>

            </main>
          </Flex>

          {/*injected modals*/}
          <Modal/>

          {/*injected component*/}
          <InjectedComponent/>

          {/*context menu*/}
          <ContextMenu/>
        </div>

    );
  }
}

const Link = styled.a`
  text-decoration: none;
`;

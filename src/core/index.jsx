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

  render() {
    const defaultConfig = getDefaultConfig();
    const config = getConfig();

    return (
        <div>
          <header>
            <Flex className="header-left">
              <Toolbar children={defaultConfig.toolbar}
              />

              {config.toolbar ?
                  <Toolbar children={config.toolbar}
                  />
                  : null}
            </Flex>

            <Flex className="header-right">
              <div className="header-filter">
                {
                  defaultConfig.utility ?
                      <Toolbar children={defaultConfig.utility}/>
                      : null
                }
                {
                  config.utility ?
                    <Toolbar children={config.utility}/>
                    : null
                }
              </div>
              <div className="header-search">
                {
                  defaultConfig.search ?
                      <Toolbar children={defaultConfig.search}/> : null
                }
                {
                  config.search ?
                    <Toolbar children={config.search}/> : null
                }
              </div>
            </Flex>
          </header>

          <Flex className="filemanagerBody" bg="white">
            <aside className="aside-content">

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
            <main className="main-content">
              <div
                className="fm-breadcrumb-wrapper"
              sx={{
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

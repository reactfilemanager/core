/** @jsx jsx */
import {jsx, Flex, Link} from 'theme-ui';
import React from 'react';
import {bootPlugins, getTabs} from '../pluggable';
import {ToastContainer, Flip} from 'react-toastify';
import {Store} from '../state/GlobalStateStore';

export default class FileManager extends React.Component {

  state = {activeTab: null, tabs: []};

  componentDidMount() {
    bootPlugins();

    this.prepare();
  }

  prepare = () => {
    const tabs = getTabs();
    const activeTab = tabs.length ? tabs[0].key : null;
    this.setState({tabs, activeTab});
  };

  activateTab = (e, activeTab) => {
    e.preventDefault();
    this.setState({activeTab})
  }

  render() {
    const navs = [], contents = [];
    for (const tab of this.state.tabs) {
      navs.push(
          <Link
              id={tab.key + '-tab'}
              key={tab.key}
              href={'#' + tab.key}
              role="tab"
              aria-controls={tab.key}
              aria-selected="true"
              onClick={(e) => this.activateTab(e, tab.key)}
              sx={{
                px: 4,
                py: 2,
                bg: tab.key === this.state.activeTab ? '#f0f0f0' : 'transparent',
                textDecoration: 'none',
                color: '#666',
                fontSize: 13,
                fontWeight: tab.key === this.state.activeTab ? 'bold' : 'null',
                textTransform: 'uppercase',
                lineHeight: '26px'
              }}
          >
            {tab.title}
          </Link>,
      );
      contents.push(
          <div
              key={tab.key}
              sx={{
                overflow: 'hidden',
                display: tab.key === this.state.activeTab ? 'block' : 'none',
              }}
          >
            <tab.component store={Store}/>
          </div>,
      );
    }

    return (
        <div className="reactfilemanager-wrapper">
          {navs.length > 1
              ? <Flex sx={{bg: '#fff'}}>
                  {navs}
              </Flex>
              : null
          }
          <div>
            {contents}
          </div>

          <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover
              transition={Flip}
          />
        </div>
    );
  }
}

/** @jsx jsx */
import {jsx, Text, Box, Flex, Link} from 'theme-ui';
import React from 'react';
import {bootPlugins, getTabs} from '../../pluggable';
import {useStore} from '../../state/store';
import {ToastContainer, Flip} from 'react-toastify';

export default () => {

  const [state, dispatch] = useStore();
  bootPlugins(state, dispatch);

  const tabs = getTabs();
  let navs = [];
  let contents = [];
  let activeFirst = false;
  for (const tab of tabs) {
    navs.push(
      <Link
        id={tab.key + '-tab'}
        href={'#' + tab.key}
        role="tab"
        aria-controls={tab.key}
        aria-selected="true"
        sx={{
          px: 4,
          py: 2,
          bg: '#fafbfb',
          textDecoration: 'none',
          color: 'gray',
          fontSize: 12,
          textTransform: 'uppercase'
        }}
      >
        {tab.title}
      </Link>,
    );
    contents.push(
        <Box 
          key={tab.key}
          id={tab.key}
          role="tabpanel"
          aria-selected={activeFirst ? 'false' : 'true'}
          aria-labelledby={tab.key + '-tab'}
        >
          <tab.component/>
        </Box>,
    );
    // if (!activeFirst) {
    //   setTimeout(() => $('#' + tab.key + '-tab').tab('show'), 100);
    //   activeFirst = true;
    // }
  }

  return (
    <Box>
      <Flex sx={{
      bg : '#f5f5f5'
    }}>
        {navs}
      </Flex>
      <Box>
      {contents}
      </Box>

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
    </Box>
  );
}

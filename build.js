import React from 'react';
import {Button} from 'theme-ui';
import {render} from 'react-dom';
import TxIcons from '@reactfilemanager/plugin-icons';
import FileManager, {Pluggable, setConfig} from './src/file-manager';
import {injectSidePanel} from './src/core/state/actions';

window.Pluggable = Pluggable;

// for development purpose only
const stylesheet = window.document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = 'https://try.getquix.net/libraries/quix/assets/css/qxi.css?ver=2.7.4';
window.document.head.append(stylesheet);
Pluggable.registerPlugin('tx-icons', TxIcons);

// Selection handler on file select mode
const core = Pluggable.plugin('core');

// Icon handler/default generic handler
core.addHandler('icon', item => item.type === 'SVG', svg => console.log('Selected', svg));

// region: button after search
core.addContextMenu(
  'test_pro',
  (item, state) => {
    return item.is_file;
  },
  (item, state, dispatch) => {
    alert('This is a pro feature');
    console.log(item, state);
  },
  {
    icon: '',
    title: <p>Test This as <strong style={{background: 'blue', color: '#fff'}}>PRO</strong></p>,
  },
);
const injectRocky = () => {
  const ComponentRocky = (props) => {
    return (
      <div style={{position: 'absolute', right: '10px', top: '70px', background: '#ccc', color: '#fff'}}>
        Hello World
      </div>
    );

  };
  injectSidePanel('rocky', ComponentRocky);
};
const buttonRocky = (props) => {
  return (
    <Button onClick={injectRocky}>&copy;</Button>
  );

};

core.addToolbarButton('rocky', buttonRocky, null, 'search');

// endregion

setConfig({
  // URL of the server installation
  url: 'http://127.0.0.1:8000/',
  // default path to open (optional)
  path: '/',
  // HTTP request modifiers
  root_url: 'http://127.0.0.1:8000/tmp/storage',
  http: {
    query_params: {
      foo: 'bar',
    },
    post_data: {
      hello: 'world',
    },
    // headers: {
    //   'X-Token': 'API-Token',
    // },
  },
});

const element = document.querySelector('#rfm');

render(<FileManager />, element);

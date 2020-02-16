import React, {Component} from 'react';
import FileManager from './core/FileManager';

import {ThemeProvider} from 'theme-ui';
import theme from './theme';
import {EventBus} from './helpers/Utils';

class App extends Component {

  componentDidMount() {
    window.document.addEventListener('click', this.emitClickEvent, false);
    window.document.addEventListener('contextmenu', this.emitContextMenuEvent, false);
  }

  componentWillUnmount() {
    window.document.removeEventListener('click', this.emitClickEvent, false);
    window.document.removeEventListener('contextmenu', this.emitContextMenuEvent, false);
  }

  emitClickEvent = e => {
    EventBus.$emit('click', e);
  };

  emitContextMenuEvent = e => {
    EventBus.$emit('contextmenu', e);
  };

  render() {
    return (
        <ThemeProvider theme={theme}>
          <FileManager/>
        </ThemeProvider>

    );
  }
}

export default App;

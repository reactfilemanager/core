import React, {Component} from 'react';
import {StoreProvider} from './state/store';
import FileManager from './core/FileManager';
import initialState from './state/store/initialState';
import createReducer from './state/reducers';

import {ThemeProvider} from 'theme-ui';
import theme from './theme';
import {EventBus} from './helpers/Utils';

class App extends Component {

  componentDidMount() {
    window.document.addEventListener('click', this.emitClickEvent, false);
  }

  componentWillUnmount() {
    window.document.removeEventListener('click', this.emitClickEvent, false);
  }

  emitClickEvent = e => {
    EventBus.$emit('click', e);
  };

  render() {
    return (
        <ThemeProvider theme={theme}>
          <StoreProvider initialState={initialState()}
                         reducer={createReducer()}>
            <FileManager/>
          </StoreProvider>
        </ThemeProvider>

    );
  }
}

export default App;

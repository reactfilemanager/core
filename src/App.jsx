import React, {Component} from 'react';
import {StoreProvider} from './state/store';
import FileManager from './core/FileManager';
import initialState from './state/store/initialState';
import createReducer from './state/reducers';

import { ThemeProvider } from 'theme-ui'
import theme from './theme'

class App extends Component {

  render() {
    return (
        <ThemeProvider theme={theme}>
           <StoreProvider initialState={initialState()} reducer={createReducer()}>
            <FileManager/>
          </StoreProvider>
        </ThemeProvider>
       
    );
  }
}

export default App;

import React, {Component} from 'react';
import {StoreProvider} from './state/store';
import FileManager from './core/FileManager';
import initialState from './state/store/initialState';
import reducers from './state/reducers';

class App extends Component {
  render() {
    return (
        <StoreProvider initialState={initialState} reducer={reducers}>
          <FileManager/>
        </StoreProvider>
    );
  }
}

export default App;
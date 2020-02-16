import React, {Component} from 'react';
import {Button, Spinner} from 'theme-ui';
import {setShouldReload} from '../../../state/actions';
import icons from '../../../../assets/icons';

class Refresh extends Component {

  state = {reloading: false};

  handleClick = e => {
    setShouldReload(true);
  };

  render() {
    const reloading = this.state.reloading;
    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'Reload',
    };
    if (reloading) {
      attrs.title = 'Reloading';
    }

    return (
        <Button
            variant="secondary" onClick={this.handleClick} disabled={reloading} {...attrs}
            sx={{
              'svg': {
                marginRight: 0,
              },
            }}>
          {reloading ?
              <Spinner sx={{width: '20px', height: '20px'}}/> :
              <>{icons.refresh}</>}
        </Button>
    );
  }
}

export default Refresh;
import React, {Component} from 'react';
import {Button} from 'theme-ui';
import {setShouldReload} from '../../../state/actions';
import icons from '../../../../assets/icons';
import {EventBus} from '../../../../helpers/Utils';
import {RELOADING} from '../../../state/types';

class Refresh extends Component {

  state = {reloading: false};

  componentDidMount() {
    EventBus.$on(RELOADING, this.setReloading);
  }

  componentWillUnmount() {
    EventBus.$off(RELOADING, this.setReloading);
  }

  setReloading = reloading => {
    if (reloading !== this.state.reloading) {
      this.setState({reloading});
    }
  };

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
              <svg viewBox="0 0 32 32" width="48" height="48" strokeWidth="4" fill="none" stroke="currentcolor" role="img" className="css-qhckx3"><title>Loading...</title><circle cx="16" cy="16" r="12" opacity="0.125"></circle><circle cx="16" cy="16" r="12" strokeDasharray="75.39822368615503" strokeDashoffset="56.548667764616276" className="svg-spin"></circle></svg>
            : <>{icons.refresh}</>}
        </Button>
    );
  }
}

export default Refresh;

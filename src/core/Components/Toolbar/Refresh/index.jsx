import React, {Component} from 'react';
import { Button, Spinner } from 'theme-ui'
import {setShouldReload} from '../../../state/actions';
import icons from '../../../../assets/icons';

class Refresh extends Component {
  handleClick = e => {
    this.props.dispatch(setShouldReload(true));
  };

  render() {
    const reloading = this.props.state.reloading;
    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'Reload',
    };
    if (reloading) {
      attrs.title = 'Reloading';
    }

    return (
        <Button variant="secondary" onClick={this.handleClick} disabled={reloading} {...attrs}>
           {reloading ? 
            <Spinner sx={{ width: '20px', height: '20px'}}/> : 
            <>{icons.refresh}</> }
        </Button>
    );
  }
}

export default Refresh;
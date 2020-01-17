import React, {Component} from 'react';
import {setShouldReload} from '../../../state/actions';

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
        <button className="btn btn-primary" onClick={this.handleClick} disabled={reloading} {...attrs}>
          <i className={'fa fa-sync-alt' + (reloading ? ' fa-spin' : '')} aria-hidden="true"/>
        </button>
    );
  }
}

export default Refresh;
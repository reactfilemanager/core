import React, {Component} from 'react';
import {setViewmode} from '../../../state/actions';
import icons from '../../../../../assets/icons';

class ViewMode extends Component {
  handleClick = e => {
    const viewmode = e.currentTarget.getAttribute('data-viewmode');
    this.props.dispatch(setViewmode(viewmode));
  };

  render() {
    const viewmode = this.props.state.viewmode;
    return (
        <div className="btn-group">
          <button className={viewmode === 'grid' ? 'btn btn-outline-primary' : 'btn btn-outline-secondary'}
                  data-viewmode="grid" onClick={this.handleClick}>
            {icons.grid}
          </button>
          <button className={viewmode === 'list' ? 'btn btn-outline-primary' : 'btn btn-outline-secondary'}
                  data-viewmode="list" onClick={this.handleClick}>
            {icons.list}
          </button>
        </div>
    );
  }
}

export default ViewMode;
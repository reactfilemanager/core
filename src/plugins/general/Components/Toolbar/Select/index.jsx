import React, {Component} from 'react';
import Move from './Move';
import Paste from './Paste';
import {setClipboard} from '../../../state/actions';

class Copy extends Component {

  componentDidMount() {
    this.props.dispatch(setClipboard([]));
  }

  handleCopy = () => {
    const clipboard = this.getSelected();
    if (!clipboard.length) {
      return;
    }

    this.props.dispatch(setClipboard(clipboard));
  };

  getSelected = () => {
    return [
      ...this.props.state.entries.dirs,
      ...this.props.state.entries.files,
    ]
        .filter(item => item.selected);
  };

  render() {
    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'Select for Copy/Move',
    };
    const clipboard = this.props.state.clipboard || [];
    const count = clipboard.length;
    if (count) {
      attrs.title = `Selected ${count} items`;
    }
    return (
        <div className="btn-group">
          <button className="btn btn-primary" ref="copy" key="copy" onClick={this.handleCopy} {...attrs}>
            <i className={count ? 'fa fa-check-double' : 'fa fa-check-square'}/>
          </button>
          <Paste key="paste" state={this.props.state} dispatch={this.props.dispatch}/>
          <Move key="move" state={this.props.state} dispatch={this.props.dispatch}/>
        </div>
    );
  }
}

export default Copy;
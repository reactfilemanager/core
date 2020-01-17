import React, {Component} from 'react';
import Move from './Move';
import Paste from './Paste';

class Copy extends Component {

  state = {clipboard: []};

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleCopy = () => {
    const clipboard = this.getSelected();
    if (!clipboard.length) {
      return;
    }

    this.setState({clipboard});
  };

  getSelected = () => {
    let items = [];
    this.props.state.entries.dirs.forEach(dir => {
      if (dir.selected) {
        items.push(dir);
      }
    });

    this.props.state.entries.files.forEach(file => {
      if (file.selected) {
        items.push(file);
      }
    });

    return items;
  };

  handleReset = () => {
    this.setState({clipboard: []});
  };

  render() {
    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'Select for Copy/Move',
    };
    const count = this.state.clipboard.length;
    if (count) {
      attrs.title = `Selected ${count} items`;
    }
    return (
        <div className="btn-group">
          <button className="btn btn-primary" ref="copy" key="copy" onClick={this.handleCopy} {...attrs}>
            <i className={count ? 'fa fa-check-double' : 'fa fa-check-square'}/>
          </button>
          <Paste key="paste" state={this.props.state} dispatch={this.props.dispatch} clipboard={this.state.clipboard}/>
          <Move key="move" state={this.props.state} dispatch={this.props.dispatch} clipboard={this.state.clipboard}
                reset={this.handleReset}/>
        </div>
    );
  }
}

export default Copy;
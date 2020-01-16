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
    return [
      <button className="btn btn-primary" ref="copy" key="copy" onClick={this.handleCopy}>Select</button>,
      <Paste key="paste" state={this.props.state} dispatch={this.props.dispatch} clipboard={this.state.clipboard}/>,
      <Move key="move" state={this.props.state} dispatch={this.props.dispatch} clipboard={this.state.clipboard}
            reset={this.handleReset}/>,
    ];
  }
}

export default Copy;
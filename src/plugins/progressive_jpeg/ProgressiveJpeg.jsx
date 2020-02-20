import React, {Component} from 'react';
import {makeProgressive} from './index';
import {EventBus} from '../../helpers/Utils';

class ProgressiveJpeg extends Component {

  state = {working: false, done: false};

  makeProgressive = () => {
    makeProgressive(this.props.item.path)
      .then(response => {
        this.setState({done: true});
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        this.setState({working: false});
      });
  };

  render() {
    if (this.state.working) {
      return 'Working...';
    }

    if (this.state.done) {
      return 'Made progressive.';
    }

    return (
      <button onClick={this.makeProgressive}>Make Progressive</button>
    );
  }
}

export default ProgressiveJpeg;

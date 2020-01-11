import React, {Component} from 'react';

class Holder extends Component {
  render() {
    return (
        <div className={"holder " + this.props.className || ''}>
          {this.props.children}
        </div>
    );
  }
}

export default Holder;

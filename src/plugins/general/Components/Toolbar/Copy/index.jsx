import React, {Component} from 'react';

class Copy extends Component {
  render() {
    return [
      <button className="btn btn-primary" key="copy">Copy</button>,
      <button className="btn btn-primary" key="paste">Paste</button>,
    ];
  }
}

export default Copy;
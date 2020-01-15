import React, {Component} from 'react';

class MakeNew extends Component {
  render() {
    return [
      <button className="btn btn-primary" key="new_file">New File</button>,
      <button className="btn btn-primary" key="new_folder">New Folder</button>,
    ];
  }
}

export default MakeNew;
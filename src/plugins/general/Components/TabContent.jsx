import React, {Component} from 'react';
import {setEntries, setWorkingPath} from '../state/actions';
import {getApi} from '../api/GeneralAPI';

class TabContent extends Component {
  componentDidMount() {
    this.setWorkingPath('/');
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.state.path !== this.props.state.path) {
      this.readPath();
    }
  }

  setWorkingPath(path) {
    this.props.dispatch(setWorkingPath(path));
  }

  readPath() {
    getApi()
        .list(this.props.state.path)
        .then(response => {
          this.props.dispatch(setEntries(response));
        })
        .catch(error => {
          console.log(error);
        });
  }

  handleDoubleClick(item) {
    if (item.is_dir) {
      this.moveToDirectory(item.path);
    }
  }

  moveToDirectory(dir) {
    this.setWorkingPath(dir);
  }

  getFileBlock(item) {
    return (<div className="col-md-2" key={item.name} onDoubleClick={() => this.handleDoubleClick(item)}>
          <div className="card">
            <img src={thumb(item.path)} className="card-img-top" alt="..."/>
            <div className="card-body">
              <p className="card-text">{item.name}</p>
            </div>
          </div>
        </div>
    );
  }

  render() {
    const dirs = this.props.state.entries.dirs;
    const files = this.props.state.entries.files;

    return (
        <div className="row">
          {dirs.map(dir => this.getFileBlock(dir))}
          {files.map(file => this.getFileBlock(file))}
        </div>
    );
  }
}

export default TabContent;
import React, {Component} from 'react';
import {setEntries, toggleSelect} from '../../state/actions';
import moment from 'moment';

class Item extends Component {

  moveTo = (item) => {
    if (item.is_dir) {
      const path = item.path.replace(/\/$/, '') + '/';
      this.props.moveTo(path);
    }
  };

  handleDoubleClick = e => {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.item.is_dir) {
      this.moveTo(this.props.item);
    }
  };

  handleClickName = e => {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.item.is_dir) {
      this.moveTo(this.props.item);
    }
  };

  handleClick = e => {
    e.preventDefault();
    e.stopPropagation();

    let shouldMark = false;
    const lastSelectedItem = this.findLastSelected();
    if (e.shiftKey && lastSelectedItem) {
      const self = this;

      function mark(item) {
        let skip = false;
        if (!shouldMark && (item === lastSelectedItem || item === self.props.item)) {
          // marking start
          shouldMark = true;
          skip = true;
        }

        if (shouldMark) {
          item.selected = true;
          item.selection_time = moment();
        }
        else {
          item.selected = false;
          item.selection_time = null;
        }

        if (!skip && shouldMark && (item === lastSelectedItem || item === self.props.item)) {
          // marking end
          shouldMark = false;
        }
        return item;
      }

      const dirs = this.props.state.entries.dirs.map(dir => mark(dir));
      const files = this.props.state.entries.files.map(file => mark(file));

      this.props.dispatch(setEntries({dirs, files}));
    }
    else {
      const dirs = this.props.state.entries.dirs.map(dir => this.markItemSelected(dir, e.ctrlKey, e.shiftKey));
      const files = this.props.state.entries.files.map(file => this.markItemSelected(file, e.ctrlKey, e.shiftKey));
      this.props.dispatch(setEntries({dirs, files}));
    }
  };

  getSelectedItems = () => {
    return [...this.props.state.entries.dirs, ...this.props.state.entries.files].filter(item => item.selected);
  };

  findLastSelected = () => {
    const items = this.getSelectedItems().sort((a, b) => a.selection_time < b.selection_time ? 1 : -1);
    if (items.length) {
      return items.shift();
    }
    return null;
  };

  markItemSelected = (item, ctrlKey) => {
    item.selection_time = null;
    if (!ctrlKey) {
      item.selected = false;
    }

    if (this.props.item === item) {
      item.selected = !item.selected;
      item.selection_time = moment();
    }
    return item;
  };

  render() {
    const item = this.props.item;

    return (
        <div className={'col-md-2' + (item.selected ? ' selected' : '')}
             key={`${item.name}_${item.size}_${item.extension}`}
             onDoubleClick={this.handleDoubleClick}
             onClick={this.handleClick}
        >
          <div className="card">
            <img src={thumb(item.path)} className="card-img-top" alt="..."/>
            <div className="card-body">
              <p className="card-text">
                {
                  item.is_dir
                      ? <a href="#" onClick={this.handleClickName}
                      >
                        {item.name}
                      </a>
                      : item.name
                }
              </p>
              {item.components}
            </div>
          </div>
        </div>
    );
  }
}

export default Item;
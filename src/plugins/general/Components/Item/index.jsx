import React, {Component} from 'react';
import {toggleSelect} from '../../state/actions';

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

    //toggle select
    this.props.dispatch(toggleSelect(this.props.item));
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
import React, {Component} from 'react';

class Item extends Component {

  moveTo = (item) => {
    if (item.is_dir) {
      const path = item.path.replace(/\/$/, '') + '/';
      this.props.moveTo(path);
    }
  };

  handleClick = (item) => {
    //select
    console.log('SingleClick', item);
  };

  render() {
    return (
        <div className="col-md-2" key={this.props.item.name}
             onClick={() => this.handleClick(this.props.item)}
        >
          <div className="card">
            <img src={thumb(this.props.item.path)} className="card-img-top" alt="..."/>
            <div className="card-body">
              <p className="card-text">
                {
                  this.props.item.is_dir
                      ? <a href="#" onClick={() => this.moveTo(this.props.item)}
                      >
                        {this.props.item.name}
                      </a>
                      : this.props.item.name
                }
              </p>
            </div>
          </div>
        </div>
    );
  }
}

export default Item;
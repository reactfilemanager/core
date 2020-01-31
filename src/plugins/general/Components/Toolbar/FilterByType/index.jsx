import React, {Component} from 'react';
import {addFilter, setTypeFilter} from '../../../state/actions';

export const FILE_TYPES = {
  video: ['mp4', 'mkv', 'flv', 'webm', 'fla', 'vob', '3gp'],
  audio: ['ogg', 'acc', 'mp3', 'm4a'],
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'ico', 'svg'],
  docs: ['txt', 'html', 'css', 'js', 'php', 'log', 'inc', 'doc', 'docx', 'rtf', 'pdf'],
};

class FilterByType extends Component {

  componentDidMount() {
    this.props.dispatch(addFilter({filter_by_type: this.filter}));
  }

  filter = entries => {
    if (this.props.state.type !== null) {
      entries.files = entries.files.filter(entry => {
        return FILE_TYPES[this.props.state.type].indexOf(entry.extension) > -1;
      });
    }
    return entries;
  };

  get filterTypes() {
    return {
      null: {title: 'All', icon: 'fa fa-asterisk'},
      video: {title: 'Video', icon: 'fa fa-video'},
      audio: {title: 'Audio', icon: 'fa fa-file-audio'},
      image: {title: 'Image', icon: 'fa fa-image'},
      docs: {title: 'Document', icon: 'fa fa-file'},
    };
  }

  getFilters = () => {
    return Object.keys(this.filterTypes).map(key => {
      if (key === 'null') {
        key = null;
      }
      return (
          <button className={this.props.state.type === key ? 'btn btn-primary' : 'btn btn-outline-secondary'}
                  key={key}
                  title={this.filterTypes[key].title}
                  onClick={() => this.handleClick(key)}
          >
            {this.filterTypes[key].title}
          </button>
      );
    });
  };

  handleClick = key => {
    if (key === 'null') {
      key = null;
    }
    if (this.props.state.type === key) {
      return;
    }
    this.props.dispatch(setTypeFilter(key));
  };

  render() {
    return (
        <div className="btn-group">
          {this.getFilters()}
        </div>
    );
  }
}

export default FilterByType;
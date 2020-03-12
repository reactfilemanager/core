/** @jsx jsx */
import {jsx, Flex, Button} from 'theme-ui';
import React, {Component} from 'react';
import {addFilter, forceRender, removeFilter, setTypeFilter} from '../../../state/actions';
import icons from '../../../../assets/icons';

export const FILE_TYPES = {
  video: ['mp4', 'mkv', 'flv', 'webm', 'fla', 'vob', '3gp'],
  audio: ['ogg', 'acc', 'mp3', 'm4a', 'wav'],
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'ico', 'svg'],
  docs: ['txt', 'html', 'css', 'js', 'php', 'log', 'inc', 'doc', 'docx', 'rtf', 'pdf'],
};

class FilterByType extends Component {

  state = {type: null};

  componentDidMount() {
    //wait for the item list to render first
    setTimeout(() => addFilter({filter_by_type: this.filter}), 300);
  }

  componentWillUnmount() {
    removeFilter('filter_by_type');
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    forceRender();
  }

  filter = entries => {
    if (this.state.type !== null) {
      entries.files = entries.files.filter(entry => {
        return FILE_TYPES[this.state.type].indexOf(entry.extension) > -1;
      });
    }
    return entries;
  };

  get filterTypes() {
    return {
      null: {title: 'All', icon: 'All'},
      image: {title: 'Image', icon: icons.image},
      docs: {title: 'Document', icon: icons.file_text},
      video: {title: 'Video', icon: icons.video},
      audio: {title: 'Audio', icon: icons.play},
    };
  }

  getFilters = () => {
    return Object.keys(this.filterTypes).map(key => {
      if (key === 'null') {
        key = null;
      }
      return (
          <Button 
            variant="utility"
            className={this.state.type === key ? 'active' : ''}
            key={key}
            title={this.filterTypes[key].title}
            onClick={() => this.handleClick(key)}
          >
            {this.filterTypes[key].icon}
          </Button>
      );
    });
  };

  handleClick = type => {
    if (type === 'null') {
      type = null;
    }
    if (this.state.type === type) {
      return;
    }
    this.setState({type});

    // document.getElementById('files-heading').scrollIntoView({behavior: 'smooth'});
  };

  render() {
    return (
        <Flex 
          sx={{
            float: 'left',
            // flex: '56%',
            // maxWidth: '56%'
          }}
          className="typeFilter"
        >
          {this.getFilters()}
        </Flex>
    );
  }
}

export default FilterByType;
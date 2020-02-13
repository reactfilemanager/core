/** @jsx jsx */
import {jsx, Flex, Button} from 'theme-ui';
import React, {Component} from 'react';
import {addFilter, setTypeFilter} from '../../../state/actions';
import icons from '../../../../../assets/icons';

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
            className={this.props.state.type === key ? 'active' : ''}
            key={key}
            title={this.filterTypes[key].title}
            onClick={() => this.handleClick(key)}
          >
            {this.filterTypes[key].icon}
          </Button>
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
        <Flex 
          sx={{
            float: 'left',
            // flex: '56%',
            // maxWidth: '56%'
          }}
        >
          {this.getFilters()}
        </Flex>
    );
  }
}

export default FilterByType;
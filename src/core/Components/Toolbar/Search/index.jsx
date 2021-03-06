/** @jsx jsx */
import {jsx, Divider, Button, Input} from 'theme-ui';
import React, {Component} from 'react';
import debounce from 'lodash.debounce';
import {addFilter, forceRender, setSort, setSortBy} from '../../../state/actions';
import {EventBus, fuzzySearch} from '../../../../helpers/Utils';
import icons from '../../../../assets/icons';
import {SET_FILTER} from '../../../state/types';

export const FILE_TYPES = {
  video: ['mp4', 'mkv', 'flv', 'webm', 'fla', 'vob', '3gp'],
  audio: ['ogg', 'acc', 'mp3', 'm4a', 'wav'],
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'ico', 'svg'],
  docs: ['txt', 'html', 'css', 'js', 'php', 'log', 'inc', 'doc', 'docx', 'rtf', 'pdf'],
};

class Search extends Component {

  state = {isOpen: false, sort: 'asc', sortBy: 'name', query: '', type: null};

  componentDidMount() {
    // wait for the items list to render
    setTimeout(() => addFilter({
      search: this.searchFilter,
      type_filter: this.typeFilter,
    }), 300);
    EventBus.$on(['click', 'contextmenu'], this.closeDropdown);
    EventBus.$on(SET_FILTER, this.setFilter);
  }

  componentWillUnmount() {
    EventBus.$off(['click', 'contextmenu'], this.closeDropdown);
    EventBus.$off(SET_FILTER, this.setFilter);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.sort !== prevState.sort
      || this.state.sortBy !== prevState.sortBy
      || this.state.query !== prevState.query
      || this.state.type !== prevState.type) {
      forceRender();
    }
  }

  setFilter = filters => {
    this.setState({...filters});
  };

  closeDropdown = e => {
    if (!this.refs.dropdown || this.refs.dropdown.isIn(e.path) || this.refs.btn.isIn(e.path)) {
      return;
    }

    this.setState({isOpen: false});
  };

  sort = sort => {
    this.setState({sort});
    this.toggleDropdown();
  };
  isEnabled = key => this.state.sortBy === key;
  sortBy = sortBy => {
    this.setState({sortBy});
    this.toggleDropdown();
  };
  isSort = key => this.state.sort === key;

  isType = type => this.state.type === type;
  setType = (type, noToggle = false) => {
    this.setState({type});
    if (!noToggle) {
      this.toggleDropdown();
    }
  };

  searchFilter = entries => {
    if (!entries) {
      return entries;
    }
    if (this.state.query) {
      entries.files = entries.files.filter(file => {
        return fuzzySearch(this.state.query, file.name);
      });

      entries.dirs = entries.dirs.filter(dir => {
        return fuzzySearch(this.state.query, dir.name);
      });
    }

    entries = {
      dirs: this.performSort(entries.dirs),
      files: this.performSort(entries.files),
    };

    return entries;
  };

  typeFilter = entries => {
    if (!entries) {
      return entries;
    }
    if (this.state.type !== null) {
      entries.files = entries.files.filter(entry => {
        return FILE_TYPES[this.state.type].indexOf(entry.extension) > -1;
      });
    }

    return entries;
  };

  performSort = (items) => {
    return items.sort((item, _item) => this.compare(item, _item));
  };

  compare = (item, _item) => {
    let result = 0;

    switch (this.state.sortBy) {
      case 'name':
        const name1 = item.name.toLowerCase();
        const name2 = _item.name.toLowerCase();

        if (name1 > name2) {
          result = 1;
        }
        else if (name1 < name2) {
          result = -1;
        }
        break;
      case 'size':
        if (item.size > _item.size) {
          result = 1;
        }
        else if (item.size < _item.size) {
          result = -1;
        }
        break;
      case 'type':
        if (item.extension > _item.extension) {
          result = 1;
        }
        else if (item.extension > _item.extension) {
          result = -1;
        }
        break;
      case 'last_modified':
        if (item.last_modified > _item.last_modified) {
          result = 1;
        }
        else if (item.last_modified < _item.last_modified) {
          result = -1;
        }
        break;
    }

    if (this.state.sort === 'desc') {
      return result * -1;
    }
    return result;
  };

  get sortByItems() {
    return {
      name: 'Name',
      size: 'Size',
      type: 'Type',
      last_modified: 'Last Modified',
    };
  }

  get sortItems() {
    return {
      asc: 'Ascending',
      desc: 'Descending',
    };
  }

  get filterByTypeItems() {
    return {
      image: 'Image',
      video: 'Video',
      audio: 'Audio',
      docs: 'Document',
    };
  }

  getSortDropdownItems = (items, check, callback) => {
    return Object.keys(items).map(key => {
      return (
        <a sx={{
          display: 'block',
          color: 'gray',
          textDecoration: 'none',
          pl: 4,
          py: 1,
          position: 'relative',
          fontSize: 13,
          '&:hover': {
            bg: 'primaryLight',
          },
          '> span': {
            position: 'absolute',
            top: '4px',
            left: '6px',
          },
          'svg': {
            width: 18,
            height: 18,
          },
          'svg *': {
            stroke: 'primary',
          },
        }}
           key={key}
           href="#"
           onClick={() => callback(key)}
        >{check(key) ? icons.check : null} {items[key]}</a>
      );
    });
  };

  handleQueryChange = debounce(() => {
    const query = this.refs.searchInput.value;
    this.setState({query});
  }, 200);

  toggleDropdown = () => {
    this.setState({isOpen: !this.state.isOpen});
  };

  render() {
    return (
      <div className="search-wrapper" sx={{position: 'relative', marginLeft: 1}}>

        {this.state.type &&
        <span className="tag">{this.filterByTypeItems[this.state.type]}
          <span className="remove" onClick={() => this.setType(null, false)} data-role="remove">x</span></span>}

        <input
          className="search"
          placeholder="Search..."
          ref="searchInput"
          onChange={this.handleQueryChange} />

        <Button
          sx={{
            position: 'absolute',
            right: '8px',
            top: '8px',
            bg: '#eee',
            p: 1,
            borderRadius: '50px',
            'svg': {
              width: 14,
              height: 14,
            },
            transition: 'transform 300ms',
            transform: this.state.isOpen
              ? 'rotateZ(180deg)'
              : 'rotateZ(0deg)',
          }}
          variant="utility"
          type="button"
          aria-expanded="false"
          onClick={this.toggleDropdown}
          ref="btn">
          {icons.triangle_down}
        </Button>
        {this.state.isOpen
          ? <div ref="dropdown" sx={{
            position: 'absolute',
            top: '40px',
            right: '0px',
            background: 'white',
            py: 3,
            boxShadow: '0 0 4px #ccc',
            width: '100%',
            borderRadius: '3px',
            zIndex: 99,
          }}>

            {this.getSortDropdownItems(this.filterByTypeItems, this.isType, this.setType)}

            <Divider />

            {this.getSortDropdownItems(this.sortByItems, this.isEnabled, this.sortBy)}

            <Divider />

            {this.getSortDropdownItems(this.sortItems, this.isSort, this.sort)}
          </div>
          : null}
      </div>
    );
  }
}

export default Search;

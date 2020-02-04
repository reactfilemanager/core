/** @jsx jsx */
import { jsx, Divider, Button, Input } from 'theme-ui'
import React, {Component} from 'react';
import debounce from 'lodash.debounce';
import {addFilter, setQuery, setSort, setSortBy} from '../../../state/actions';
import {fuzzySearch} from '../../../../../helpers/Utils';
import icons from '../../../../../assets/icons';

class Search extends Component {

  componentDidMount() {
    this.props.dispatch(addFilter({search: this.filter}));
  }

  sort = sort => this.props.dispatch(setSort(sort));
  isEnabled = key => this.props.state.search.sortBy === key;
  sortBy = sortBy => this.props.dispatch(setSortBy(sortBy));
  isSort = key => this.props.state.search.sort === key;

  filter = entries => {
    if (!entries) {
      return entries;
    }
    if (this.props.state.search.query) {
      entries.files = entries.files.filter(file => {
        return fuzzySearch(this.props.state.search.query, file.name);
      });

      entries.dirs = entries.dirs.filter(dir => {
        return fuzzySearch(this.props.state.search.query, dir.name);
      });
    }

    entries = {
      dirs: this.performSort(entries.dirs),
      files: this.performSort(entries.files),
    };

    return entries;
  };

  performSort = (items) => {
    return items.sort((item, _item) => this.compare(item, _item));
  };

  compare = (item, _item) => {
    let result = 0;

    switch (this.props.state.search.sortBy) {
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

    if (this.props.state.search.sort === 'desc') {
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
            '&:hover':{
              bg:'muted'
            },
            '> span':{
              position: 'absolute',
              top: '4px',
              left: '6px'
            },
            'svg':{
              width: 18,
              height: 18
            },
            'svg *':{
              stroke: 'primary'
            }
          }}
             key={key}
             href="#"
             onClick={() => callback(key)}
          >{check(key) ? icons.check : null} {items[key]}</a>
      );
    });
  };

  handleQueryChange = debounce(() => {
    this.props.dispatch(setQuery(this.refs.searchInput.value));
  }, 200);

  render() {
    return (
        <div sx={{ position: 'relative' }}>
          <Input 
            type="text"
            placeholder="Search..."
            ref="searchInput"
            className="form-control"
            onChange={this.handleQueryChange}/>
          
            <Button  
              sx={{
                position: 'absolute',
                right: '10px',
                top: '6px',
                right: '5px',
                bg: 'muted',
                p: 1,
                borderRadius: '50px',
                'svg':{
                  width: 14,
                  height: 14,
                }
              }}
              variant="utility"
              type="button"
              aria-expanded="false">
                {icons.triangle_down}
            </Button>
            
            <div sx={{
              position: 'absolute',
              top: '36px',
              right: '0px',
              background: 'white',
              py: 3,
              boxShadow: '0 0 4px #ccc',
              width: '100%',
              borderRadius: '3px'
            }}>

              {this.getSortDropdownItems(this.sortByItems, this.isEnabled, this.sortBy)}

              <Divider/>

              {this.getSortDropdownItems(this.sortItems, this.isSort, this.sort)}
            </div>
        </div>
    );
  }
}

export default Search;
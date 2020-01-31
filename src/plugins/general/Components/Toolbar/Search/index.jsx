import React, {Component} from 'react';
import {debounce} from 'lodash';
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
          <a className="dropdown-item"
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
        <div className="input-group">
          <input type="text"
                 placeholder="Search..."
                 ref="searchInput"
                 className="form-control"
                 onChange={this.handleQueryChange}/>
          <div className="input-group-append">
            <button className="btn btn-outline-light dropdown-toggle btn-sort" type="button" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">{icons.triangle_down}</button>
            <div className="dropdown-menu">

              {this.getSortDropdownItems(this.sortByItems, this.isEnabled, this.sortBy)}

              <div role="separator" className="dropdown-divider"/>

              {this.getSortDropdownItems(this.sortItems, this.isSort, this.sort)}
            </div>
          </div>
        </div>
    );
  }
}

export default Search;
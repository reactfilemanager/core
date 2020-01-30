import React, {Component} from 'react';
import {debounce} from 'lodash';
import {addFilter, setQuery} from '../../../state/actions';
import {fuzzySearch} from '../../../../../helpers/Utils';

class Search extends Component {

  componentDidMount() {
    this.props.dispatch(addFilter({search: this.filter}));
  }

  filter = entries => {
    if (!entries) {
      return entries;
    }
    if (!this.props.state.query) {
      return entries;
    }
    entries.files = entries.files.filter(file => {
      return fuzzySearch(this.props.state.query, file.name);
    });

    entries.dirs = entries.dirs.filter(dir => {
      return fuzzySearch(this.props.state.query, dir.name);
    });

    return entries;
  };

  handleQueryChange = debounce(() => {
    this.props.dispatch(setQuery(this.refs.searchInput.value));
  }, 200);

  render() {
    return (
        <input type="text"
               placeholder="Search..."
               ref="searchInput"
               className="form-control"
               onChange={this.handleQueryChange}/>
    );
  }
}

export default Search;
/** @jsx jsx */
import {jsx, NavLink, Flex} from 'theme-ui';
import React, {Component} from 'react';
import {setWorkingPath} from '../../state/actions';
import icons from '../../../assets/icons';
import {EventBus} from '../../../helpers/Utils';
import {SET_WORKING_PATH} from '../../state/types';
class Breadcrumb extends Component {

  state = {path: ''};

  componentDidMount() {
    EventBus.$on(SET_WORKING_PATH, this.setWorkingPath);
  }

  componentWillUnmount() {
    EventBus.$off(SET_WORKING_PATH, this.setWorkingPath);
  }

  setWorkingPath = path => {
    if(this.state.path !== path) {
      this.setState({path});
    }
  };

  moveTo = (e, path) => {
    e.preventDefault();
    e.stopPropagation();

    if(this.state.path === path) return;

    this.setState({path});
    setWorkingPath(path);
  };

  getBreadCrumbs = () => {
    let Breadcrumbs = [];
    if (this.state.path !== null) {
      const cleanPath = this.state.path;
      const _path = cleanPath.split('/');
      const sPath = this.state.path === '' ? '/' : this.state.path;
      let path = '';

      Breadcrumbs = _path.map(dir => {
        path += `/${dir}`;
        path = path.replace(/\/\//, '/');

        const isActive = sPath === path;

        const nPath = path;
        if (dir === '') {

          return <NavLink
                  href="#!"
                  key={nPath}
                  onClick={e => this.moveTo(e, '')}
                  sx={{
                    'svg': {
                      width: '16px',
                      height: '16px'
                    }
                  }}>
                    {icons.home} <span className="rootName">My Drive</span>
                </NavLink>
        }

        return (
          <React.Fragment key={nPath}>
            <span sx={{ px: 2, color: 'gray'}} >
              <svg className="a-s-fa-Ha-pa" width="20px" height="20px" viewBox="0 0 20 20" focusable="false" fill="#000000"><polygon points="8,5 13,10 8,15"></polygon></svg>
            </span>
            <NavLink
              href='#!'
              className={isActive ? 'active' : ''}
              aria-current={isActive ? 'page' : undefined}
              onClick={e => this.moveTo(e, nPath)}

              sx={{
                fontSize: 14,
                fontWeight: 'body'
            }}>
              {dir}
            </NavLink>
          </React.Fragment>
        );
      });
    }
    return Breadcrumbs;
  };

  render() {
    const Breadcrumbs = this.getBreadCrumbs();

    return (
        <Flex as='nav' aria-label="breadcrumb" sx={{ lineHeight: '16px' }}>
          {Breadcrumbs}
        </Flex>

    );
  }
}

export default Breadcrumb;

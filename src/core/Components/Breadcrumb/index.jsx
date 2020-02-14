/** @jsx jsx */
import {jsx, NavLink, Flex} from 'theme-ui';
import React, {Component} from 'react';
import {setWorkingPath} from '../../state/actions';
import icons from '../../../assets/icons';
class Breadcrumb extends Component {

  moveTo = (e, path) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.dispatch(setWorkingPath(path));
  };

  getBreadCrumbs = () => {
    let Breadcrumbs = [];
    if (this.props.path !== null) {
      const cleanPath = this.props.path;
      const _path = cleanPath.split('/');
      const sPath = this.props.path === '' ? '/' : this.props.path;
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
                  onClick={e => this.moveTo(e, '/')}
                  sx={{
                    'svg': {
                      width: '16px',
                      height: '16px'
                    }
                  }}>
                    {icons.home}
                </NavLink>
        }

        return (
          <>
            <span sx={{ px: 2, color: 'gray'}}> > </span>
            <NavLink 
              href='#!' 
              className={isActive ? 'active' : ''}
              aria-current={isActive ? 'page' : undefined} 
              key={nPath}
              onClick={e => this.moveTo(e, nPath)} 
              
              sx={{
                fontSize: 14,
                fontWeight: 'body'
            }}>
              {dir}
            </NavLink>
          </>
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

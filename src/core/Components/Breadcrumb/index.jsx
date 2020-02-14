import React, {Component} from 'react';
import { NavLink, Flex } from 'theme-ui'
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
                  onClick={e => this.moveTo(e, '/')}>
                    {icons.home}
                </NavLink>
        }

        return (
          <NavLink 
            href='#!' 
            className={isActive ? 'active' : ''}
            aria-current={isActive ? 'page' : undefined} 
            key={nPath}
            onClick={e => this.moveTo(e, nPath)} 
            
            sx={{
              px: 2,
              fontSize: 14,
              fontWeight: 'body'
            }}>
            {dir}
          </NavLink>
        );
      });
    }
    return Breadcrumbs;
  };

  render() {
    const Breadcrumbs = this.getBreadCrumbs();

    return (
        <Flex as='nav' aria-label="breadcrumb" className="breadcrumb">
          {Breadcrumbs}
        </Flex>
      
    );
  }
}

export default Breadcrumb;

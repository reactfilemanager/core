import React, {Component} from 'react';
import {setWorkingPath} from '../../state/actions';

class Breadcrumb extends Component {

  moveTo = (e, path) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.dispatch(setWorkingPath(path));
  };

  getBreadCrumbs = () => {
    let Breadcrumbs = [];
    if (this.props.path) {
      // remove first and last "/"
      const cleanPath = this.props.path.replace(/^\//, '').replace(/\/$/, '');
      const _path = cleanPath.split('/');

      if (_path.length === 1 && _path[0] === '') {
        // we're at root
        Breadcrumbs.push(<li className="breadcrumb-item" key="home"><i className="fa fa-home"/></li>);
      }
      else {
        let path = '/'; // root

        Breadcrumbs = _path.map(dir => {
          path += `${dir}/`;
          const isActive = this.props.path === path;
          const nPath = path;
          return (
              <li className={'breadcrumb-item' + (isActive ? ' active' : '')}
                  aria-current={isActive ? 'page' : undefined}
                  key={nPath}
              >
                {isActive
                    ? dir
                    : <a href="#" onClick={e => this.moveTo(e, nPath)}>{dir}</a>}
              </li>
          );
        });

        // inject home to the top
        Breadcrumbs.unshift(
            <li className="breadcrumb-item" key="home">
              <a href="#" onClick={e => this.moveTo(e, '/')}>
                <i className="fa fa-home"/>
              </a>
            </li>,
        );
      }
    }
    return Breadcrumbs;
  };

  render() {
    const Breadcrumbs = this.getBreadCrumbs();

    return (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            {Breadcrumbs}
          </ol>
        </nav>
    );
  }
}

export default Breadcrumb;

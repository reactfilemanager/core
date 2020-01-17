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
          return isActive
              ? <li className="breadcrumb-item" key="home"><i className="fa fa-home"/></li>
              : <li className="breadcrumb-item" key="home">
                <a href="#" onClick={e => this.moveTo(e, '/')}>
                  <i className="fa fa-home"/>
                </a>
              </li>;
        }

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

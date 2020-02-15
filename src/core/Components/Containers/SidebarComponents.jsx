/** @jsx jsx */
import {jsx} from 'theme-ui';
import React, {Component} from 'react';
import icons from '../../../assets/icons';
import {EventBus} from '../../../helpers/Utils';
import * as types from '../../state/types';

class SidebarComponents extends Component {
  state = {sidebar_components: {}};

  componentDidMount() {
    EventBus.$on(types.INJECT_SIDE_PANEL, this.injectSidePanel);
    EventBus.$on(types.REMOVE_SIDE_PANEL, this.removeSidePanel);
  }

  componentWillUnmount() {
    EventBus.$off(types.INJECT_SIDE_PANEL, this.injectSidePanel);
    EventBus.$off(types.REMOVE_SIDE_PANEL, this.removeSidePanel);
  }

  injectSidePanel = ({id, panel}) => {
    this.setState({
      sidebar_components: {
        ...this.state.sidebar_components,
        [id]: panel,
      },
    });
  };

  removeSidePanel = id => {
    const sidebar_components = this.state.sidebar_components;
    delete sidebar_components[id];
    this.setState({sidebar_components});
  };

  closeSidebar = () => {
    this.setState({sidebar_components: {}});
  };

  render() {

    const sidebar_components = this.state.sidebar_components;
    const hasSidebarComponents = Object.keys(sidebar_components).length > 0;

    if (!hasSidebarComponents) {
      return null;
    }

    return (<div>
      <span onClick={this.closeSidebar}>{icons.close}</span>
      {Object.keys(sidebar_components).map(key => {
        const Component = sidebar_components[key];
        return (
            <Component key={key} id={key}/>
        );
      })}
    </div>);
  }
}

export default SidebarComponents;
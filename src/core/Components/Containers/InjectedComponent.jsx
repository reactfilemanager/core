/** @jsx jsx */
import {jsx} from 'theme-ui';
import React, {Component} from 'react';
import {EventBus} from '../../../helpers/Utils';
import * as types from '../../state/types';

class InjectedComponent extends Component {
  state = {injected_component: null};

  componentDidMount() {
    EventBus.$on(types.INJECT_COMPONENT, this.injectComponent);
    EventBus.$on(types.REMOVE_INJECTED_COMPONENT, this.removeInjectedComponent);
  }

  componentWillUnmount() {
    EventBus.$off(types.INJECT_COMPONENT, this.injectComponent);
    EventBus.$off(types.REMOVE_INJECTED_COMPONENT, this.removeInjectedComponent);
  }

  injectComponent = injected_component => {
    this.setState({injected_component});
  };

  removeInjectedComponent = id => {
    this.setState({injected_component: null});
  };

  render() {
    const InjectedComponent = this.state.injected_component;
    if (!InjectedComponent) {
      return null;
    }

    return <InjectedComponent/>;
  }
}

export default InjectedComponent;
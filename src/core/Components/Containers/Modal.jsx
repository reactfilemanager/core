/** @jsx jsx */
import {jsx} from 'theme-ui';
import React, {Component} from 'react';
import {SkyLightStateless} from 'react-skylight';
import {EventBus} from '../../../helpers/Utils';
import * as types from '../../state/types';

class Modal extends Component {

  state = {modal: null};

  componentDidMount() {
    EventBus.$on(types.INJECT_MODAL, this.injectModal);
    EventBus.$on(types.REMOVE_MODAL, this.removeModal);
  }

  componentWillUnmount() {
    EventBus.$off(types.INJECT_MODAL, this.injectModal);
    EventBus.$off(types.REMOVE_MODAL, this.removeModal);
  }

  injectModal = modal => {
    this.setState({modal});
  };

  removeModal = () => {
    this.setState({modal: null});
  };

  render() {

    const ModalComponent = this.state.modal;
    const hasModal = !!ModalComponent;

    return (
        <SkyLightStateless
            afterClose={this.removeModal}
            closeOnEsc
            isVisible={hasModal}
            onCloseClicked={this.removeModal}
            dialogStyles={ModalDialogStyle}
        >
          {hasModal
              ? <ModalComponent/>
              : null}
        </SkyLightStateless>
    );
  }
}

const ModalDialogStyle = {
  minHeight: '200px',
};

export default Modal;
import React, {Component} from 'react';
import {Button, Text, Input, Flex} from 'theme-ui';
import {getApi} from '../../../tools/config';
import {getWorkingPath, removeModal, update} from '../../../state/actions';
import {Spinner } from 'theme-ui';
import {toast} from 'react-toastify';
import icons from '../../../../assets/icons'

class Rename extends Component {

  state = {working: false};

  getSelected = () => {
    return this.props.item;
  };

  handleSave = () => {
    const name = this.refs.name.value.trim();
    if (name === '') {
      toast.warning('Empty name entered');
      return;
    }

    this.setState({working: true});
    const item = this.getSelected();
    getWorkingPath()
    .then(path => {
      getApi()
      .rename(path, item.name, name)
      .then(response => {
        toast.success(response.message);
        // update name
        item.name = name;
        // update path
        const path = item.path.split('/');
        path.pop();
        item.path = [...path, item.name].join('/');

        update(item);
        removeModal();
      })
      .catch(error => {
        toast.error(error.message);
        this.setState({working: false});
      });
    });
  };

  handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();

      this.handleSave();
    }
  };

  render() {
    const selected = this.getSelected();
    return (
      <Flex sx={{
        flexDirection: 'column', alignItems: 'center',
        p: 4,
        'svg' : { width: '50px', height: '50px' }
      }}>
        {icons.rename}
        
        <Text sx={{ fontSize: 22, py: 2,}}>Rename {selected.is_dir ? 'Folder' : 'File'}</Text>
        
        <Input 
          sx={{ lineHeight: 2 }}
          placeholder="New Folder"
          ref="name"
          defaultValue={selected.name}
          onKeyDown={this.handleKeyDown}
          autoFocus
        />
        
        <Button
          sx={{ py: 2, px: 5, marginTop: 3 }}
          onClick={this.handleSave}
          disabled={this.state.working}
        >
          Rename
        </Button>
      </Flex>
    );
  }
}

export default Rename;
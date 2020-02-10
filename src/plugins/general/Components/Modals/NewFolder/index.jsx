import React, {Component} from 'react';
import {Button, Text, Input, Flex} from 'theme-ui';
import {Spinner} from 'theme-ui';
import {getApi} from '../../../tools/config';
import {removeModal, setShouldReload} from '../../../state/actions';
import {toast} from 'react-toastify';
import icons from '../../../../../assets/icons'

class NewFolder extends Component {

  state = {working: false};

  handleSave = () => {
    const name = this.refs.name.value.trim();
    if (name === '') {
      toast.info('Empty name entered');
      return;
    }

    this.setState({working: true});
    getApi()
        .new_dir(this.props.state.general.path, name)
        .then(response => {
          toast.success(response.message);
          // reload
          this.props.dispatch(setShouldReload(true));
          this.props.dispatch(removeModal());
        })
        .catch(error => {
          toast.error(error.message);
          this.setState({working: false});
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
    return (
      <Flex sx={{
        flexDirection: 'column', alignItems: 'center',
        p: 4,
        'svg' : { width: '50px', height: '50px' }
      }}>
        {icons.folder_add}
        
        <Text sx={{ fontSize: 22, py: 2,}}>Create New Folder</Text>
        
        <Input 
          sx={{ lineHeight: 2 }}
          placeholder="New Folder"
          autoFocus
          ref="name"
          onKeyDown={this.handleKeyDown}
        />
        <Button
        sx={{ py: 2, px: 5, marginTop: 3 }}
          onClick={this.handleSave}
          disabled={this.state.working}
        >
        { this.state.working ? <Spinner/> : 'New Folder' }
        </Button>
      </Flex>
    );
  }
}

export default NewFolder;
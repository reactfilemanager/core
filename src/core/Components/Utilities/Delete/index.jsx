/** @jsx jsx */
import {jsx, Button, Text, Flex, Image, Spinner} from 'theme-ui';
import React, {Component} from 'react';
import {getApi} from '../../../tools/config';
import {injectModal, remove, removeModal, resetDirectoryTree} from '../../../state/actions';
import {toast} from 'react-toastify';
import icons from '../../../../assets/icons';

export const DeleteButton = props => {
  const handleDeleteClick = () => {
    const modal = (props) => {
      return <Delete {...props}/>;
    };

    props.dispatch(injectModal(modal));
  };

  const shouldShow = [
    ...props.state.entries.dirs,
    ...props.state.entries.files,
  ].filter(item => item.selected).length > 0;

  if (!shouldShow) {
    return null;
  }
  return (
      <Button
          variant="secondary"
          onClick={handleDeleteClick}
      >
        {icons.trash} Delete
      </Button>
  );
};

class Delete extends Component {
  state = {working: false};

  getSelected = () => {
    return [
      ...this.props.state.core.entries.dirs,
      ...this.props.state.core.entries.files,
    ].filter(item => item.selected);
  };

  handleDelete = () => {
    let items = this.getSelected();
    this.setState({working: true});
    for (const item of items) {
      getApi().delete('/', item.path).then(response => {
        toast.success('Deleted successfully');
        this.props.dispatch(remove(item));
        if (item.is_dir) {
          this.props.dispatch(resetDirectoryTree(true));
        }
        this.props.dispatch(removeModal());
      }).catch(error => {
        toast.error(error.message);
        this.setState({working: false});
      });
    }
  };

  render() {
    const selected = this.getSelected();

    return (
        <Flex sx={{
          flexDirection: 'column', alignItems: 'center',
          p: 4,
          '> span > svg': {width: '50px', height: '50px'},
        }}>
          {icons.trash}

          <Text sx={{fontSize: 22, py: 2}}>Delete these entries</Text>

          <div className="fm-modal-overflow-content" sx={{my: 2, width: '100%'}}>
            <ul sx={{
              listStyleType: 'none',
              p: 0,
              m: 0,
              border: '1px solid #ddd',
              'li': {
                py: 2,
                px: 3,
              },
              'li:not(:last-child)': {
                borderBottom: '1px solid #ddd',
              },
              'li:hover': {
                bg: 'primaryLight',
              },
            }}>
              {selected.map(item => <li className="list-group-item" key={`${item.name}`}>
                <Image src={thumb(item.path)} sx={{width: 20, mr: 2}}/> {item.name}
              </li>)}
            </ul>
          </div>

          <div sx={{
            bg: 'primaryLight',
            borderColor: 'primary',
            borderWidth: '0 0 0 3px',
            borderStyle: 'solid',
            borderRadius: 4,
            py: 2,
            px: 3,
          }}>
            <strong>Are you absolutely sure?</strong> This action cannot be undone!
          </div>
          <Button sx={{
            py: 2, px: 5, marginTop: 3,
            'svg': {width: '20px', height: '20px'},
          }}
                  onClick={this.handleDelete}
                  disabled={this.state.working}
          >
            {this.state.working ? <Spinner title="Deleting"/> : 'Delete'}
          </Button>
        </Flex>
    );
  }
}

export default Delete;
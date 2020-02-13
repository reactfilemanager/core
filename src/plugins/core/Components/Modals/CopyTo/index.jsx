import React, {Component} from 'react';
import {Button, Flex, Box, Spinner, Text} from 'theme-ui';
import icons from '../../../../../assets/icons';
import SelectableDirectoryTree
  from '../../General/DirectoryTree/SelectableDirectoryTree';
import {getApi} from '../../../tools/config';
import {getSelectedItems} from '../../../models/FileInfo';
import {toast} from 'react-toastify';
import {removeModal, setShouldReload} from '../../../state/actions';

class CopyTo extends Component {

  state = {path: '', working: false};

  componentDidMount() {
    this.setState({path: this.props.state.core.path || '/'});
  }

  onSelect = e => {
    let path = '/';
    if (e.length !== 0) {
      path = e[0];
    }
    this.setState({path});
  };

  handleCopy = () => {
    this.setState({working: true});
    const promises = [];
    getSelectedItems(this.props.state.core.entries).forEach(item => {
      promises.push(this.props.move
          ? getApi().move('/', item.path, this.state.path)
          : getApi().copy('/', item.path, this.state.path),
      );
    });

    Promise.all(promises).then(response => {
      toast.success(`${this.btnText} successful`);
      this.props.dispatch(setShouldReload(true));
      this.props.dispatch(removeModal());
    }).catch(error => {
      toast.error(`${this.btnText} failed`);
      this.setState({working: false});
    });
  };

  get title() {
    return this.props.move ? 'Move To' : 'Copy To';
  }

  get btnText() {
    return this.props.move ? 'Move' : 'Copy';
  }

  get icon() {
    return this.props.move ? icons.move : icons.copy;
  }

  render() {
    return (
        <Flex sx={{
          flexDirection: 'column', alignItems: 'center',
          p: 4,
          '> span > svg': {width: '50px', height: '50px'},
        }}>
          {this.icon}

          <Text sx={{fontSize: 22, py: 2}}>{this.title}</Text>

          {/* <input
              sx={{lineHeight: 2}}
              value={this.state.path}
              readOnly
          /> */}

          <div className="fm-modal-overflow-content" bg={'muted'}
               style={{borderRadius: '3px', paddingBottom: '3px'}}>
            <SelectableDirectoryTree onSelect={this.onSelect}
                                     state={this.props.state.core}
                                     path={this.state.path}
                                     dispatch={this.props.dispatch}/>
          </div>

          <Button
              sx={{py: 2, px: 5, marginTop: 3}}
              onClick={this.handleCopy}
              disabled={this.state.working}
          >
            {this.state.working ? <Spinner/> : this.btnText}
          </Button>
        </Flex>
    );
  }
}

export default CopyTo;
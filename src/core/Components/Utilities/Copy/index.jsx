import React, {Component} from 'react';
import {Button, Flex, Spinner, Text} from 'theme-ui';
import icons from '../../../../assets/icons';
import SelectableDirectoryTree from '../../DirectoryTree/SelectableDirectoryTree';
import {getApi} from '../../../tools/config';
import {toast} from 'react-toastify';
import {getWorkingPath, injectModal, removeModal, setShouldReload} from '../../../state/actions';

export const CopyButton = (move = false) => {
  return class extends React.Component {
    state = {shouldShow: false};
    handleCopyToClick = () => {
      const modal = (props) => {
        return <Copy {...props} move={move}/>;
      };

      injectModal(modal);
    };

    render() {
      if (!this.state.shouldShow) {
        return null;
      }

      return (
          <Button
              variant="secondary"
              onClick={this.handleCopyToClick}
          >
            {move
                ? <> {icons.move} Move</>
                : <>{icons.copy} Copy</>}
          </Button>
      );
    };
  };
};

class Copy extends Component {

  state = {path: '', working: false};

  componentDidMount() {
    getWorkingPath(path => {
      console.log('Working Path', path);
    });
  }

  onSelect = e => {
    let path = '/';
    if (e.length !== 0) {
      path = e[0];
    }
    this.setState({path});
  };

  getSelectedItems = () => {
    return []; // TODO: getSelectedItems
  };

  handleCopy = () => {
    this.setState({working: true});
    const promises = [];
    this.getSelectedItems().forEach(item => {
      promises.push(this.props.move
          ? getApi().move('/', item.path, this.state.path)
          : getApi().copy('/', item.path, this.state.path),
      );
    });

    Promise.all(promises).then(response => {
      toast.success(`${this.btnText} successful`);
      setShouldReload(true);
      removeModal();
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
                                     state={this.props.state.core}/>
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

export default Copy;
/** @jsx jsx */
import {jsx, Flex, Progress, Box, Text} from 'theme-ui';

import React, {Component} from 'react';
import {getApi} from '../../../tools/config';
import FileInfo from '../../../models/FileInfo';
import icons from '../../../../../assets/icons';
import {setShouldReload} from '../../../state/actions';

class Upload extends Component {
  state = {working: false, uploads: [], enable_drop: false};

  componentDidMount() {
    this.attachDragDropEvents();
  }

  componentWillUnmount() {
    this.detachDragDropEvents();
  }

  attachDragDropEvents = () => {
    this.refs.dropArea.addEventListener('dragenter', this.onDragEnter, false);
    this.refs.dropArea.addEventListener('dragleave', this.onDragLeave, false);
    this.refs.dropArea.addEventListener('dragover', this.onDragOver, false);
    this.refs.dropArea.addEventListener('dragdrop', this.onDrop, false);
    this.refs.dropArea.addEventListener('drop', this.onDrop, false);
  };

  detachDragDropEvents = () => {
    this.refs.dropArea.removeEventListener('dragenter', this.onDragEnter);
    this.refs.dropArea.removeEventListener('dragleave', this.onDragLeave);
    this.refs.dropArea.removeEventListener('dragover', this.onDragOver);
    this.refs.dropArea.removeEventListener('dragdrop', this.onDrop);
    this.refs.dropArea.removeEventListener('drop', this.onDrop);
  };

  onDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({enable_drop: true});
  };

  onDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  onDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({enable_drop: false});
  };

  onDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({enable_drop: false});
    this.prepareAndUpload(e.dataTransfer.files);
  };

  openFileInput = () => {
    this.refs.fileInput.click();
  };

  handleSelect = () => {
    this.prepareAndUpload(this.refs.fileInput.files);
  };

  prepareAndUpload = files => {
    let uploads = this.state.uploads;
    for (const _file of files) {
      const file = this.mapFile(_file);
      file._file = _file;
      file.cancelSource = getApi().getCancelSource();
      this.upload(file);
      uploads = [...uploads, file];
    }

    this.setState({uploads});
  };

  upload = (file) => {
    getApi().
        upload(this.props.state.general.path, file._file, file.option, this.handleProgress(file)).
        then(response => {
          this.setUploadStatus(file, response.message, true, response);
        }).
        catch(error => {
          console.log(error);
          this.setUploadStatus(file, error.message, false, error);
        });
  };

  retry = (file) => {
    file.cancelSource = getApi().getCancelSource();
    this.upload(file);
    const uploads = this.state.uploads.map(_file => {
      if (_file === file) {
        _file.upload_complete = false;
        _file.upload_success = false;
        _file.upload_error = false;
        _file.option_required = false;
        _file.attempt += 1;
        _file.progress = 0;
        _file.message = null;
      }
      return _file;
    });

    this.setState({uploads});
  };

  keepBoth = file => {
    file.option = 'keep-both';
    this.retry(file);
  };

  replaceExisting = file => {
    file.option = 'replace';
    this.retry(file);
  };

  removeFromUploads = file => {
    let wait = 0;
    if (!file.upload_complete) {
      file.cancelSource.cancel('Cancelled by User');
      wait = 2;
    }
    setTimeout(() => {
      const uploads = this.state.uploads.filter(_file => _file !== file);
      this.setState({uploads});
    }, wait * 1000);
  };

  setUploadStatus = (file, message, success, response) => {
    const uploads = this.state.uploads.map(_file => {
      if (_file === file) {
        _file.upload_complete = true;
        // _file.upload_complete = false;
        _file.upload_success = success === true;
        _file.upload_error = success === false;
        _file.option_required = response.status === 412;
        _file.message = message || 'Server error occurred';
      }
      return _file;
    });
    this.setState({uploads});

    this.reloadOnComplete();
  };

  handleProgress = file => {
    return e => {
      file.progress = (e.loaded / e.total) * 100;
      const uploads = this.state.uploads.map(_file => {
        if (_file === file) {
          return file;
        }
        return _file;
      });

      this.setState({uploads});
    };
  };

  mapFile = fileInfo => {
    const file = new FileInfo(
        fileInfo.name,
        this.props.state.general.path,
        false,
        true,
        false,
        true,
        true,
        false,
        '',
        fileInfo.size,
        fileInfo.name.split('.').pop(),
    );

    file.upload_complete = false;
    file.upload_success = false;
    file.upload_error = false;
    file.option_required = false;
    file.option = undefined;
    file.progress = 0;
    file.message = null;
    file.attempt = 1;

    return file;
  };

  getUploadProgress = file => {
    return (
        <li key={`${file.name}_${file.size}`}>
          <Flex>
        <span sx={{
          p: 2,
          display: 'flex',
          flex: '1',
          borderRadius: 1,
          '&:hover': {
            bg: '#f4f4fe',
          },
          'svg': {marginRight: 2},
        }}>
          {
            file.upload_complete ? file.upload_success ? icons.check : icons.warning : null
          }
          {file.name}
        </span>
            <span sx={{p: 2, width: '15%'}}>
          {
            file.upload_complete ? file.upload_success
                ? file.size.toHumanFileSize()
                : 'Failed' : <Progress max={1} value={file.progress}/>
          }
              {file.upload_complete && file.upload_error ? <div
                  sx={{fontSize: 12, color: 'gray', marginTop: 2}}>{file.message}</div> : null}
        </span>

            {
              file.upload_success
                  ?
                  <span sx={{p: 2, width: '5%'}}
                        onClick={() => this.removeFromUploads(file)}>
                  {icons.close}
                </span> : ''
            }

            {
              file.upload_complete && file.upload_error ?
                  file.option_required ?
                      <>
                        <span onClick={() => this.replaceExisting(file)}>Replace</span>
                        <span onClick={() => this.keepBoth(file)}>Keep Both</span>
                      </>
                      : <span
                          sx={{
                            p: 2,
                            width: '10%',
                            fontWeight: 'bold',
                            fontSize: 14,
                            color: 'primary',
                            cursor: 'pointer',
                          }} onClick={() => this.retry(file)}>Retry</span> : ''
            }
          </Flex>
        </li>
    );
  };

  getUploads = () => {
    return this.state.uploads.map(file => this.getUploadProgress(file));
  };

  get uploading() {
    return this.state.uploads.find(file => !file.upload_complete) !== undefined;
  }

  reloadOnComplete = () => {
    if (!this.uploading) {
      this.props.dispatch(setShouldReload(true));
    }
  };

  render() {
    return (
        <div>
          <Text>File Uploader</Text>
          <Flex sx={{
            my: 3,
            p: 4,
            borderWidth: '2px',
            borderStyle: 'dashed',
            borderColor: this.state.enable_drop ? 'primary' : '#ddd',
            borderRadius: 4,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }} ref="dropArea">
            <strong
                onClick={this.openFileInput}
                sx={{
                  color: 'primary',
                  cursor: 'pointer',
                  display: 'flex',
                  marginRight: 2,
                }}>{icons.link} Add file</strong> or drop file here
          </Flex>

          <ul sx={{
            listStyleType: 'none',
            p: 0,
            maxHeight: '200px',
            overflow: 'scroll',
          }}>
            {this.getUploads()}
          </ul>

          <input type="file" ref="fileInput" onChange={this.handleSelect}
                 multiple hidden/>
        </div>
    );
  }
}

export default Upload;
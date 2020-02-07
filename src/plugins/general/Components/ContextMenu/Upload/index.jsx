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
        upload(this.props.state.general.path, file._file,
            this.handleProgress(file)).
        then(response => {
          this.setUploadStatus(file, response.message, true);
        }).
        catch(error => {
          console.log(error);
          this.setUploadStatus(file, error.message, false);
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
        _file.attempt += 1;
        _file.progress = 0;
        _file.message = null;
      }
      return _file;
    });

    this.setState({uploads});
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

  setUploadStatus = (file, message, success) => {
    const uploads = this.state.uploads.map(_file => {
      if (_file === file) {
        _file.upload_complete = true;
        // _file.upload_complete = false;
        _file.upload_success = success === true;
        _file.upload_error = success === false;
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
    file.progress = 0;
    file.message = null;
    file.attempt = 1;

    return file;
  };

  getUploadProgress = file => {
    return (
        <ul key={`${file.name}_${file.size}`} sx={{
          listStyleType: 'none',
          p: 0,
        }}>
          <li>
            <Flex sx={{p: 2}}>
              <span sx={{p: 2, widht: '70%'}}>{file.name}</span>
              <span sx={{p: 2, width: '10%'}}>
              {
                file.upload_complete ? file.upload_success
                    ? file.size.toHumanFileSize()
                    : 'Failed' : <Progress max={1} value={file.progress}/>
              }
            </span>

              {
                file.upload_success ? <span sx={{p: 2, width: '5%'}}
                                            onClick={() => this.removeFromUploads(
                                                file)}>{icons.close}</span> : ''
              }

              {
                file.upload_complete && file.upload_error ? <span
                    sx={{p: 2, width: '10%'}}
                    onClick={() => this.retry(file)}>Retry</span> : ''
              }
            </Flex>
            <Box>{file.upload_error}</Box>
          </li>
        </ul>
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
        <Box>
          <Text>File Uploader</Text>
          <Box sx={{
            my: 3,
            p: 4,
            border: this.state.enable_drop
                ? '3px dashed #ccc'
                : '1px solid #ddd',
            borderRadius: '3px',
            textAlign: 'center',
          }} ref="dropArea">
            <span onClick={this.openFileInput}>{icons.link} Add file</span>
          </Box>

          {this.getUploads()}

          <input type="file" ref="fileInput" onChange={this.handleSelect}
                 multiple hidden/>

        </Box>
    );
  }
}

export default Upload;
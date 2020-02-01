import React, {Component} from 'react';
import Popover from 'react-popover';
import FileInfo from '../../../../models/FileInfo';
import {getApi} from '../../../../tools/config';
import ReactLoading from 'react-loading';
import icons from '../../../../../../assets/icons';

class Upload extends Component {
  state = {working: false, isOpen: false, uploads: []};

  handleClick = () => {
    this.setState({isOpen: true});
    if (this.state.uploads.length === 0) {
      this.openFileInput();
    }
  };

  openFileInput = () => {
    this.refs.fileInput.click();
  };

  handleOutsideClick = () => {
    this.setState({isOpen: false});
  };

  handleSelect = () => {
    let uploads = this.state.uploads;
    for (const _file of this.refs.fileInput.files) {
      const file = this.mapFile(_file);
      file._file = _file;
      file.cancelSource = getApi().getCancelSource();
      this.upload(file);
      uploads = [...uploads, file];
    }

    this.setState({uploads});
  };

  upload = (file) => {
    getApi()
        .upload(this.props.state.path, file._file, this.handleProgress(file))
        .then(response => {
          this.setUploadStatus(file, response.message, true);
        })
        .catch(error => {
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
    }, wait*1000);
  };

  setUploadStatus = (file, message, success) => {
    const uploads = this.state.uploads.map(_file => {
      if (_file === file) {
        _file.upload_complete = true;
        _file.upload_success = success === true;
        _file.upload_error = success === false;
        _file.message = message || 'Server error occurred';
      }
      return _file;
    });
    this.setState({uploads});
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
        this.props.state.path,
        false,
        true,
        false,
        true,
        true,
        false,
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
    let progressClassName = 'progress-bar';
    let nameClassName = 'font-weight-bold';

    if (file.upload_success) {
      progressClassName += ' bg-success';
      nameClassName += ' text-success';
    }
    else if (file.upload_error) {
      progressClassName += ' bg-danger';
      nameClassName += ' text-danger';
    }
    else {
      progressClassName += ' bg-info progress-bar-striped progress-bar-animated';
      nameClassName += ' text-info';
    }

    return (
        <div className="card mb-1" key={`${file.name}_${file.size}`}>
          <div className="card-body">

            <span className="top-right-absolute pointer" onClick={() => this.removeFromUploads(file)}>
              <i className="fa fa-times-circle"/>
            </span>

            <p className={nameClassName}>
              {
                file.upload_complete
                    ? file.upload_success
                    ? <i className="fa fa-check"/>
                    : <i className="fa fa-times"/>
                    :
                    <i className="fa fa-spin fa-circle-notch"/>
              }
              &nbsp; {file.name}
            </p>
            {
              file.message
                  ? (
                      <p className={nameClassName}>
                        <small>{file.message}</small>
                        {
                          file.upload_error
                              ? <button className="ml-1 btn btn-sm btn-default"
                                        onClick={() => this.retry(file)}
                                        title="Retry">
                                <i className="fa fa-sync"/>
                              </button>
                              : null
                        }
                      </p>
                  )
                  : null
            }
            <div className="progress">
              <div className={progressClassName}
                   role="progressbar"
                   aria-valuenow={file.progress}
                   aria-valuemin="0"
                   aria-valuemax="100"
                   style={{width: `${file.progress}%`}}
              />
            </div>
          </div>
        </div>
    );
  };

  getUploads = () => {
    return this.state.uploads.map(file => this.getUploadProgress(file));
  };

  get uploading() {
    return this.state.uploads.find(file => !file.upload_complete);
  }

  render() {
    const Body =
        <div className="p-1 min-w-300px">
          <div className="form-group mx-sm-3 mb-2">
            <h3>Uploading files</h3>

            <div className="row">
              <div className="col-md-12">
                {this.getUploads()}
              </div>
            </div>

            <button className="btn btn-primary" onClick={this.openFileInput}>
              {icons.cloud_upload} Upload
            </button>
          </div>
        </div>;

    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'Upload',
    };

    return (
        <Popover
            body={Body}
            isOpen={this.state.isOpen}
            onOuterAction={this.handleOutsideClick}
        >
          <button className="btn btn-primary"
                  onClick={this.handleClick}
                  disabled={this.state.isOpen}
                  {...attrs}
          >
            <input type="file" className="hidden" ref="fileInput" onChange={this.handleSelect} multiple/>
            {
              this.uploading
                  ? <ReactLoading type="spin" height={23} width={12} color="#fff"/>
                  : icons.cloud_upload
            }
          </button>
        </Popover>
    );
  }
}

export default Upload;
/** @jsx jsx */
import {jsx} from 'theme-ui';
import React, {Component} from 'react';
import {pathResolver} from '../index';
import icons from '../../../assets/icons';

require('./style.scss');

class VideoPlayer extends Component {

  get filepath() {
    if (typeof pathResolver.resolve !== 'function') {
      return null;
    }

    return pathResolver.resolve(this.props.item);
  }

  close = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.dispatch({type: 'REMOVE_INJECTED_COMPONENT'});
  };

  render() {
    return (
        <div>
          <div className="video-player">
            <span onClick={this.close}>{icons.close}</span>
            <video width="400" controls autoPlay>
              <source src={this.filepath} type="video/mp4"/>
                  Your browser does not support HTML5 video.
            </video>
          </div>
        </div>
    );
  }
}

export default VideoPlayer;
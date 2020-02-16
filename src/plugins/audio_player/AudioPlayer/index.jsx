/** @jsx jsx */
import {jsx} from 'theme-ui';
import React, {Component} from 'react';
import {pathResolver} from '../index';
import icons from '../../../assets/icons';
import {EventBus} from '../../../helpers/Utils';

require('./style.scss');

class AudioPlayer extends Component {

  componentDidMount() {
    this.togglePlay();
  }

  togglePlay = () => {
    if (this.refs.audio.paused === false) {
      this.refs.audio.pause();
      this.refs.play.classList.remove('pause');
    }
    else {
      this.refs.audio.play();
      this.refs.play.classList.add('pause');
    }
  };

  calculatePercentPlayed = () => {
    let percentage = (this.refs.audio.currentTime / this.refs.audio.duration).toFixed(2) * 100;
    this.refs.percentage.style.width = `${percentage}%`;
  };

  calculateCurrentValue = (currentTime) => {
    const currentMinute = parseInt(currentTime / 60) % 60;
    const currentSecondsLong = currentTime % 60;
    const currentSeconds = currentSecondsLong.toFixed();
    return `${currentMinute < 10 ? `0${currentMinute}` : currentMinute}:${
        currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds
    }`;
  };

  initProgressBar = () => {
    this.refs.currentTime.innerHTML = this.calculateCurrentValue(this.refs.audio.currentTime);

    this.refs.audio.onended = () => {
      this.refs.play.classList.remove('pause');
      this.refs.percentage.style.width = 0;
      this.refs.currentTime.innerHTML = '00:00';
    };

    this.calculatePercentPlayed();
  };

  seek = (e) => {
    const percent = e.nativeEvent.offsetX / e.target.offsetWidth;
    this.refs.audio.currentTime = percent * this.refs.audio.duration;
  };

  get filepath() {
    if (typeof pathResolver.resolve !== 'function') {
      return null;
    }

    return pathResolver.resolve(this.props.item);
  }

  close = e => {
    e.preventDefault();
    e.stopPropagation();

    EventBus.$emit('REMOVE_INJECTED_COMPONENT');
  };

  render() {
    return (
        <div>
          <div className="audio-player">
            <span onClick={this.close}>{icons.close}</span>
            <audio id="audio" ref="audio" onTimeUpdate={this.initProgressBar}>
              <source src={this.filepath}/>
            </audio>
            <div className="player-controls">
              <div id="radioIcon" ref="radioIcon"/>
              <button id="playAudio" ref="play" onClick={this.togglePlay}/>
              <div id="seekObjContainer" ref="seekObjContainer">
                <div id="seekObj" ref="seekObj" onClick={this.seek}>
                  <div id="percentage" ref="percentage"/>
                </div>
              </div>
              <p><small id="currentTime" ref="currentTime">00:00</small></p>
            </div>
          </div>
        </div>
    );
  }
}

export default AudioPlayer;
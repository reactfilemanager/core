/** @jsx jsx */
import {jsx, Box, Spinner} from 'theme-ui';
import React, {Component} from 'react';
import {viewport} from '../../../../helpers/Utils';

class ImagePreview extends Component {

  state = {width: 50, height: 50, loading: true, closing: false};

  componentDidMount() {
    const image = new Image();
    image.onload = e => {
      const size = this.calculateSize(
          {width: image.width, height: image.height});
      this.setState({...size, loading: false});
    };
    image.src = preview(this.props.item.path);
    this.attachEvent();
  }

  componentWillUnmount() {
    this.detachEvent();
  }

  attachEvent = () => {
    window.document.addEventListener('keydown', this.handleEscPress, false);
  };

  detachEvent = () => {
    window.document.removeEventListener('keydown', this.handleEscPress, false);
  };

  handleEscPress = e => {
    let isEscape = false;
    if ('key' in e) {
      isEscape = (e.key === 'Escape' || e.key === 'Esc');
    }
    else {
      isEscape = (e.keyCode === 27);
    }

    if (isEscape) {
      this.close();
    }
  };

  calculateSize = image => {
    const max = viewport();
    max.width -= 50;
    max.height -= 50;
    const size = {...image};
    const ratio = image.width / image.height;

    if (image.height < max.height && image.width < max.width) {
      return image;
    }

    if (image.width > max.width) {
      size.width = max.width;
      size.height = size.width / ratio;
    }

    if (image.height > max.height) {
      size.height = max.height;
      size.width = size.height * ratio;
    }

    if (size.height > max.height || size.width > max.width) {
      return this.calculateSize(size);
    }

    return size;
  };

  close = () => {
    this.setState({closing: true});
    setTimeout(() => {
      this.props.dispatch({type: 'REMOVE_INJECTED_COMPONENT'});
    }, 250);
  };

  render() {
    const size = {
      width: this.state.closing ? 0 : this.state.width,
      height: this.state.closing ? 0 : this.state.height,
    };

    return (
        <Box className="show"
             ref="imagePreview"
             sx={{
               zIndex: 999,
               position: 'fixed',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
             }}>
          <Box className="overlay"
               sx={{
                 width: '100%',
                 height: '100%',
                 background: 'rgba(0,0,0,.33)',
                 position: 'absolute',
                 top: 0,
                 left: 0,
               }}
               onClick={this.close}/>
          <Box className="img-show"
               sx={{
                 width: `${size.width}px`,
                 height: `${size.height}px`,
                 background: '#fff',
                 position: 'absolute',
                 top: '50%',
                 left: '50%',
                 transform: 'translate(-50%,-50%)',
                 transition: 'all 0.25s ease',
               }}>
            {this.state.loading
                ? <Spinner/>
                : <>
                  {this.state.closing ? null :
                      <span sx={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        zIndex: 99,
                        cursor: 'pointer',
                        color: '#fff',
                        background: '#222',
                        border: '2px solid #ccc',
                        borderRadius: '150px',
                        padding: '6px',
                        lineHeight: '0.7',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: '#fff',
                          color: '#222',
                        },
                      }} onClick={this.close}>X</span>
                  }
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundImage: `url("${preview(this.props.item.path)}")`,
                    backgroundSize: 'cover',
                  }}/>
                </>
            }
          </Box>
        </Box>
    );
  }
}

export default ImagePreview;
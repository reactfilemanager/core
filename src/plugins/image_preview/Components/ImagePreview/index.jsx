/** @jsx jsx */
import {jsx, Box, Spinner} from 'theme-ui';
import React, {Component} from 'react';
import throttle from 'lodash.throttle';
import icons from '../../../../assets/icons';
import {getImageDimensionAsync, viewport} from '../../../../helpers/Utils';
import {toast} from 'react-toastify';

class ImagePreview extends Component {

  state = {
    width: 50,
    height: 50,
    position: null,
    ratio: 0,
    loading: true,
    closing: false,
    dragging: false,
  };

  componentDidMount() {
    getImageDimensionAsync(preview(this.props.item.path)).then(dim => {
      const size = this.calculateSize({width: dim.width, height: dim.height});
      this.setState({...size, loading: false, ratio: size.width / size.height});
    }).catch(error => {
      this.setState({loading: false});
      this.close();
      toast('Error occurred while loading the image');
    }).finally(() => {
      this.setState({loading: false});
    });
    this.attachEvent();
  }

  componentWillUnmount() {
    this.detachEvent();
  }

  attachEvent = () => {
    window.document.addEventListener('keydown', this.handleEscPress, false);
    window.document.addEventListener('mousemove', this.move, false);
    window.document.addEventListener('mouseup', this.stopMove, false);
    window.document.addEventListener('wheel', this.handleScroll,
        {passive: false});
  };

  detachEvent = () => {
    window.document.removeEventListener('keydown', this.handleEscPress, false);
    window.document.removeEventListener('mousemove', this.move, false);
    window.document.removeEventListener('mouseup', this.stopMove, false);
    window.document.removeEventListener('wheel', this.handleScroll, false);
  };

  handleScroll = e => {
    e.preventDefault();
    e.stopPropagation();

    const inc = e.deltaY / this.state.ratio;
    const width = this.state.width - e.deltaY;
    const height = this.state.height - inc;
    if (width < 100) {
      return;
    }
    this.setState({width, height});
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

  startMove = e => {
    this.clickPosition = {pageX: e.pageX, pageY: e.pageY};
    this.imagePosition = {
      pageX: this.refs.imageView.offsetLeft,
      pageY: this.refs.imageView.offsetTop,
    };

    this.setState({
      top: this.imagePosition.pageY,
      left: this.imagePosition.pageX,
      dragging: true,
    });
  };

  move = throttle(e => {
    if (!this.state.dragging) {
      return;
    }
    const movement = {
      pageX: e.pageX - this.clickPosition.pageX,
      pageY: e.pageY - this.clickPosition.pageY,
    };

    const position = {
      top: this.imagePosition.pageY + movement.pageY,
      left: this.imagePosition.pageX + movement.pageX,
    };

    this.setState({position});
  }, 100);

  stopMove = e => {
    this.setState({dragging: false});
  };

  render() {
    const size = {
      width: this.state.closing ? 0 : this.state.width,
      height: this.state.closing ? 0 : this.state.height,
    };

    const imgShowAttrs = this.state.position
        ? {
          top: `${this.state.position.top}px`,
          left: `${this.state.position.left}px`,
        }
        : {
          top: '50%',
          left: '50%',
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
          {this.state.closing ? null :
              <span sx={{
                position: 'absolute',
                top: '-55px',
                right: '-55px',
                background: 'rgba(34, 34, 34, 0.1)',
                padding: '60px 60px 40px 40px',
                zIndex: 99,
                cursor: 'pointer',
                borderRadius: '150px',
                lineHeight: '0.7',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(221,208,211,0.2)',
                },
              }} onClick={this.close}>{icons.close}</span>
          }
          <Box className="img-show"
               ref="imageView"
               sx={{
                 width: `${size.width}px`,
                 height: `${size.height}px`,
                 background: '#fff',
                 position: 'absolute',
                 ...imgShowAttrs,
                 transform: 'translate(-50%,-50%)',
                 transition: 'all 0.25s ease',
                 cursor: this.state.dragging ? 'move' : '',
               }}
               onMouseDown={this.startMove}>
            {this.state.loading
                ? <Spinner/>
                : <Box sx={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  backgroundImage: `url("${preview(this.props.item.path)}")`,
                  backgroundSize: 'cover',
                }}/>
            }
          </Box>
        </Box>
    );
  }
}

export default ImagePreview;
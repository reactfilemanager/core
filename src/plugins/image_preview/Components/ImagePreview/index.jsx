/** @jsx jsx */
import {jsx, Box} from 'theme-ui';
import React, {Component} from 'react';
import {viewport} from '../../../../helpers/Utils';

class ImagePreview extends Component {

  state = {width: 600, height: 400};

  componentDidMount() {
    const image = new Image();
    image.onload = e => {
      const size = this.calculateSize({width: image.width, height: image.height});
      this.setState({...size});
    };
    image.src = preview(this.props.item.path);
  }

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
    this.props.dispatch({type: 'REMOVE_INJECTED_COMPONENT'});
  };

  render() {
    return (
        <Box className="show"
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
                 background: 'rgba(0,0,0,.66)',
                 position: 'absolute',
                 top: 0,
                 left: 0,
               }}/>
          <Box className="img-show"
               sx={{
                 width: `${this.state.width}px`,
                 height: `${this.state.height}px`,
                 background: '#fff',
                 position: 'absolute',
                 top: '50%',
                 left: '50%',
                 transform: 'translate(-50%,-50%)',
                 overflow: 'hidden',
               }}>
            <span sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 99,
              cursor: 'pointer',
              color: '#fff',
              background: '#222',
              border: '1px solid #ccc',
              borderRadius: '150px',
              padding: '6px',
              lineHeight: '0.7',
            }} onClick={this.close}>X</span>
            <Box sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundImage: `url("${preview(this.props.item.path)}")`,
              backgroundSize: 'cover',
            }}/>
          </Box>
        </Box>
    );
  }
}

export default ImagePreview;
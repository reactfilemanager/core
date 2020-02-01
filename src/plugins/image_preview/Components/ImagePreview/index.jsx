import React, {Component} from 'react';

class ImagePreview extends Component {
  render() {
    return (
        <div>
          <img src={preview(this.props.item.path)} width={500} alt=""/>
        </div>
    );
  }
}

export default ImagePreview;
/** @jsx jsx*/
import {jsx, Spinner} from 'theme-ui';
import React, {Component} from 'react';
import icons from '../../../../../assets/icons';
import {FILE_TYPES} from '../../Toolbar/FilterByType';

class InfoPanel extends Component {

  get isImage() {
    return FILE_TYPES.image.indexOf(this.props.item.extension) >= 0;
  }

  render() {
    const item = this.props.item;
    return (
        <table>
          <tbody>
          <tr>
            <td colSpan={2}><h3> {icons.info} Details</h3></td>
          </tr>
          <tr>
            <td>Name</td>
            <td>{item.name}</td>
          </tr>
          <tr>
            <td>Size</td>
            <td>{item.size.toHumanFileSize()}</td>
          </tr>
          <tr>
            <td>Permission</td>
            <td>{item.perms}</td>
          </tr>
          <tr>
            <td>Last Modified</td>
            <td>{item.last_modified.toHumanFormat()}</td>
          </tr>
          {this.isImage ?
              <>
                <tr>
                  <td>Dimension</td>
                  <td>
                    {`${item.image_info.width}x${item.image_info.width}`}
                  </td>
                </tr>
                <tr>
                  <td>Bits</td>
                  <td>
                    {item.image_info.bits}
                  </td>
                </tr>
                <tr>
                  <td>Color Channels</td>
                  <td>
                    {item.image_info.channels}
                  </td>
                </tr>
                <tr>
                  <td>Mime Type</td>
                  <td>
                    {item.image_info.mime}
                  </td>
                </tr>
              </>
              : null}
          </tbody>
        </table>
    );
  }
}

export default InfoPanel;
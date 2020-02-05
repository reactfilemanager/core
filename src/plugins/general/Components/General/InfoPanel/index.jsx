import React, {Component} from 'react';
import icons from '../../../../../assets/icons';

class InfoPanel extends Component {
  render() {
    return (
        <table>
          <tbody>
          <tr>
            <td colSpan={2}><h3> {icons.info} Details</h3></td>
          </tr>
          <tr>
            <td>Name</td>
            <td>{this.props.item.name}</td>
          </tr>
          <tr>
            <td>Size</td>
            <td>{this.props.item.size.toHumanFileSize()}</td>
          </tr>
          <tr>
            <td>Permission</td>
            <td>{this.props.item.perms}</td>
          </tr>
          </tbody>
        </table>
    );
  }
}

export default InfoPanel;
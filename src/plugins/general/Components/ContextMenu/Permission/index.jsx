import React, {Component} from 'react';
import {getApi} from '../../../tools/config';
import toastr from 'toastr';
import {setShouldReload} from '../../../state/actions';
import {Spinner} from 'theme-ui';

class Permission extends Component {

  state = {
    working: false,
    users: [
      {title: 'Owner', read: false, write: false, execute: false},
      {title: 'Group', read: false, write: false, execute: false},
      {title: 'Everyone', read: false, write: false, execute: false},
    ],
    mod: 'xxx',
  };

  componentDidMount() {
    this.prepare();
  }

  prepare = () => {
    const item = this.props.item;
    const perms = item.perms.split('');
    perms.shift();

    const _perms = {
      Owner: perms.splice(0, 3),
      Group: perms.splice(0, 3),
      Everyone: perms.splice(0, 3),
    };

    const users = this.state.users.map(user => {
      const perms = _perms[user.title];

      user.read = perms[0] === 'r';
      user.write = perms[1] === 'w';
      user.execute = perms[2] === 'x';

      return user;
    });
    const mod = this.calculateMod(users);
    this.setState({isOpen: true, users, mod});
  };

  handleCheck = (_user, val, e) => {
    const users = this.state.users.map(user => {
      if (user.title !== _user.title) {
        return user;
      }
      if (val === 4) {
        user.read = e.target.checked;
      }
      if (val === 2) {
        user.write = e.target.checked;
      }
      if (val === 1) {
        user.execute = e.target.checked;
      }
      return user;
    });
    const mod = this.calculateMod(users);
    this.setState({users, mod});
  };

  calculateMod = (users) => {
    const mod = [];
    for (const user of users) {
      let val = 0;
      if (user.read) {
        val += 4;
      }
      if (user.write) {
        val += 2;
      }
      if (user.execute) {
        val += 1;
      }
      mod.push(val);
    }
    return mod.join('');
  };

  getSelectables = () => {
    return this.state.users.map(user => {
      return (
          <tr key={user.title}>
            <td>{user.title}</td>
            <td><input type="checkbox" checked={user.read} onChange={e => this.handleCheck(user, 4, e)}/></td>
            <td><input type="checkbox" checked={user.write} onChange={e => this.handleCheck(user, 2, e)}/></td>
            <td><input type="checkbox" checked={user.execute} onChange={e => this.handleCheck(user, 1, e)}/></td>
          </tr>
      );
    });
  };

  handleSave = () => {
    const mod = this.calculateMod(this.state.users);

    this.setState({working: true, mod});
    const item = this.props.item;
    getApi()
        .chmod(this.props.state.general.path, item.name, mod)
        .then(response => {
          toastr.success(response.message);
          this.props.dispatch(setShouldReload(true));
        })
        .catch(error => {
          toastr.error(error.message);
        })
        .finally(() => {
          this.setState({working: false, isOpen: false});
        });
  };

  handleModChange = e => {
    const value = e.target.value.split('');
    if (value.length > 3) {
      return;
    }
    if (value.length < 3) {
      this.setState({mod: value.join('')});
      return;
    }
    const users = this.state.users;
    for (const i of [0, 1, 2]) {
      if (!value[i]) {
        continue;
      }
      let val = value[i];
      if (val >= 4) {
        users[i].read = true;
        val -= 4;
      }
      else {
        users[i].read = false;
      }
      if (val >= 2) {
        users[i].write = true;
        val -= 2;
      }
      else {
        users[i].write = false;
      }
      if (val >= 1) {
        users[i].execute = true;
        val -= 1;
      }
      else {
        users[i].execute = false;
      }
    }
    this.setState({users, mod: value.join('')});
  };

  render() {
    return (
        <div className="form-inline p-1">
          <div className="form-group mx-sm-3 mb-2">
            <h3>Change Permission</h3>
            <table className="table">
              <tbody>
              <tr>
                <td/>
                <td>Read</td>
                <td>Write</td>
                <td>Execute</td>
              </tr>
              {this.getSelectables()}
              <tr>
                <td>
                  <button className="btn btn-primary mb-2"
                          onClick={this.handleSave}
                          disabled={this.state.working}
                  >
                    {
                      this.state.working ?
                          <Spinner/>
                          : 'Update'
                    }
                  </button>
                </td>
                <td colSpan={2}/>
                <td><input type="text" value={this.state.mod} onChange={this.handleModChange} className="form-control"/>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
    );
  }
}

export default Permission;
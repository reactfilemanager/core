import React, {Component} from 'react';

class Toolbar extends Component {
  render() {
    const {children} = this.props;

    const Children = Object.keys(children).map(key => {
      const Child = children[key];
      return <Child key={key}/>;
    });

    return (
        <>
          {Children}
        </>
    );
  }
}

export default Toolbar;
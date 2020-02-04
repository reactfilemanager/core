import React, {Component} from 'react';

class Toolbar extends Component {
  render() {
    const {children} = this.props;

    const Children = Object.keys(children).map(key => {
      const Child = children[key];
      return <Child key={key}
                    state={this.props.state}
                    dispatch={this.props.dispatch}
      />;
    });

    return (
        <>
          {Children}
        </>
    );
  }
}

export default Toolbar;
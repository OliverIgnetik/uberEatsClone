import React, { Component } from 'react';

const AsyncComponent = importComponent => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null,
      };
    }

    componentDidMount() {
      importComponent().then(cmp => {
        this.setState({ component: cmp.default });
      });
    }

    render() {
      const Cmp = this.state.component;
      return Cmp && <Cmp {...this.props} />;
    }
  };
};

export default AsyncComponent;

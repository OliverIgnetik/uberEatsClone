import React, { Component } from 'react';
import Hocaux from '../../hoc/HOCAUX';
import Burger from '../../components/Burger/Burger';

class BurgerBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: {
        salad: 1,
        bacon: 2,
        cheese: 2,
        meat: 2,
      },
    };
  }
  render() {
    return (
      <Hocaux>
        <Burger ingredients={this.state.ingredients} />
        <div>Build Controls</div>
      </Hocaux>
    );
  }
}

export default BurgerBuilder;

import React, { Component } from 'react';
import Hocaux from '../../hoc/HOCAUX';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axiosOrders from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: null,
      totalPrice: 6,
      purchasable: false,
      purchasing: false,
      loading: false,
      error: false,
    };
    // bindings
    this.purchaseCancelHandler = this.purchaseCancelHandler.bind(this);
    this.purchaseContinueHandler = this.purchaseContinueHandler.bind(this);
  }

  addIngredientHandler = type => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    this.setState((oldState, _) => ({
      ingredients: updatedIngredients,
      totalPrice: oldState.totalPrice + INGREDIENT_PRICES[type],
    }));
    this.updatePurchaseState(updatedIngredients);
  };

  removeIngredientHandler = type => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) return;
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    this.setState((oldState, _) => ({
      ingredients: updatedIngredients,
      totalPrice: oldState.totalPrice - INGREDIENT_PRICES[type],
    }));
    this.updatePurchaseState(updatedIngredients);
  };

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => sum + el, 0);
    this.setState({ purchasable: sum > 0 });
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler() {
    this.setState({ purchasing: false });
  }

  // public fields syntax alternative to binding
  purchaseContinueHandler() {
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'olli',
        address: {
          street: 'test street',
          zipCode: '123123',
          country: 'Australia',
        },
        email: 'olli@ozemail.com.au',
      },
      deliveryMethod: 'fastest',
    };
    // firebase convention /name.json
    axiosOrders
      .post('/orders.json', order)
      .then(res => {
        setTimeout(
          this.setState({
            loading: false,
            purchasing: false,
          }),
          1000,
        );
      })
      .catch(err => this.setState({ loading: false, purchasing: false }));
  }

  componentDidMount() {
    // this will grab the information from the most recent order
    axiosOrders
      .get('/orders.json')
      .then(response => {
        const ingredients = Object.values(response.data).reverse()[0]
          .ingredients;
        console.log(ingredients);
        this.setState({ ingredients: ingredients });
      })
      .catch(error => {
        this.setState({ error: true });
      });
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients,
    };
    for (const key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.state.error ? (
      <p>ingredients can't be loaded</p>
    ) : (
      <Spinner />
    );

    if (this.state.ingredients) {
      burger = (
        <Hocaux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            price={this.state.totalPrice}
            ordered={this.purchaseHandler}
          />
        </Hocaux>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          purchaseCanceled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.state.totalPrice}
        />
      );
    }
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Hocaux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Hocaux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axiosOrders);

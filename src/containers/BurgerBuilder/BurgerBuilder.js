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
      // if there is no catch block, then block runs and you will get undefined cases
      .catch(error => {
        this.setState({ error: true });
        return error;
      });
  }

  // adding and removing ingredients
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
    // pass updated ingredients to update purchase state
    this.updatePurchaseState(updatedIngredients);
  };

  // update the purchase state with new ingredients
  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => sum + el, 0);
    this.setState({ purchasable: sum > 0 });
  }

  // Show the modal for ordering
  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler() {
    this.setState({ purchasing: false });
  }

  // public fields syntax is an alternative to binding
  purchaseContinueHandler() {
    const queryParams = [];
    for (const key in this.state.ingredients) {
      queryParams.push(
        encodeURIComponent(key) +
          '=' +
          encodeURIComponent(this.state.ingredients[key]),
      );
    }
    queryParams.push('price=' + this.state.totalPrice);
    const queryString = '?' + queryParams.join('&');
    this.props.history.push({ pathname: '/checkout', search: queryString });
  }

  render() {
    // render method conditional checks
    const disabledInfo = {
      ...this.state.ingredients,
    };
    for (const key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    // initialize the orderSummary as null
    let orderSummary = null;
    // if there is an error set a spinner
    let burger = this.state.error ? (
      <p>ingredients can't be loaded</p>
    ) : (
      <Spinner />
    );

    // if there are some ingredients
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
    // if the state is in loading, set the order summary to the spinner
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    // JSX to render
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

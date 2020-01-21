import React, { Component } from 'react';
import Hocaux from '../../hoc/HOCAUX';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axiosOrders from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // UI state properties
      purchasing: false,
    };
    // bindings
    this.purchaseCancelHandler = this.purchaseCancelHandler.bind(this);
    this.purchaseContinueHandler = this.purchaseContinueHandler.bind(this);
  }

  componentDidMount() {
    this.props.onInitIngredients();
  }

  // update the purchase state with new ingredients
  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => sum + el, 0);
    return sum > 0;
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
    this.props.history.push({ pathname: '/checkout' });
  }

  render() {
    // render method conditional checks
    const disabledInfo = {
      ...this.props.ings,
    };
    for (const key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    // initialize the orderSummary as null
    let orderSummary = null;
    // if there is an error set a spinner
    let burger = this.props.error ? (
      <p>ingredients can't be loaded</p>
    ) : (
      <Spinner />
    );

    // if there are some ingredients
    if (this.props.ings) {
      burger = (
        <Hocaux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}
            price={this.props.totalPrice}
            ordered={this.purchaseHandler}
          />
        </Hocaux>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          purchaseCanceled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.props.totalPrice}
        />
      );
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

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    totalPrice: state.totalPrice,
    error: state.error,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingName => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: ingName => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withErrorHandler(BurgerBuilder, axiosOrders));

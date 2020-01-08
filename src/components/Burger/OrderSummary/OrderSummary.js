import React from 'react';
import Hocaux from '../../../hoc/HOCAUX';
import Button from '../../UI/Button/Button';

const orderSummary = props => {
  const ingredientSummary = Object.keys(props.ingredients).map(
    (igKey, index) => {
      return (
        <li key={index}>
          <span style={{ textTransform: 'capitalize' }}>{igKey}</span>:
          {props.ingredients[igKey]}
        </li>
      );
    },
  );

  return (
    <Hocaux>
      <h3>Your Order</h3>
      <p>A delicious burger with the following ingredients:</p>
      <ul>{ingredientSummary}</ul>
      <p>
        Total Price : <strong>$ {props.price.toFixed(2)}</strong>
      </p>
      <p>Continue to Checkout?</p>
      <Button clicked={props.purchaseCanceled} btnType='Danger'>
        CANCEL
      </Button>
      <Button clicked={props.purchaseContinued} btnType='Success'>
        CONTINUE
      </Button>
    </Hocaux>
  );
};

export default orderSummary;

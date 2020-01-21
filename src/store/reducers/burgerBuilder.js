import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  ingredients: null,
  totalPrice: 6,
  error: false,
  building: false,
};

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] + 1,
        },
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        building: true,
      };

    case actionTypes.REMOVE_INGREDIENT:
      return removeIngredient(state, action);

    case actionTypes.SET_INGREDIENTS:
      return updateObject(state, {
        ingredients: action.ingredients,
        error: false,
        totalPrice: 6,
        building: false,
      });

    // return {
    //   ...state,
    //   ingredients: action.ingredients,
    //   error: false,
    //   totalPrice: 6,
    // };

    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return {
        ...state,
        error: true,
      };

    default:
      return state;
  }
};

const removeIngredient = (state, action) => {
  return updateObject(state, {
    ingredients: updateObject(state.ingredients, {
      [action.ingredientName]: state.ingredients[action.ingredientName] - 1,
    }),
    totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
    building: true,
  });
};

export default reducer;

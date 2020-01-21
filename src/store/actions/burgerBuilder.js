import * as actionTypes from './actionTypes';
// import axiosOrders from '../../axios-orders';

export const addIngredient = name => {
  //   console.log('[burgerBuilder.js] inside action creator');
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: name,
  };
};

export const removeIngredient = name => {
  //   console.log('[burgerBuilder.js] inside action creator');
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: name,
  };
};

export const setIngredients = ingredients => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients,
  };
};

export const fetchIngredientsFailed = () => {
  // console.log('[burgerBuilder.js] action creator : fetch failed');
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED,
  };
};

export const initIngredients = () => {
  return dispatch => {
    dispatch(setIngredients({ salad: 0, bacon: 0, meat: 0, cheese: 0 }));
  };
  // return dispatch => {
  // this will grab the information from the most recent order
  //   axiosOrders
  //     .get('/orders.json?auth=' + token)
  //     .then(response => {
  //       const ingredients = Object.values(response.data).reverse()[0]
  //         .ingredients;
  //       dispatch(setIngredients(ingredients));
  //       return response;
  //     })
  //     // if there is no catch block, then block runs and you will get undefined cases
  //     // the catch block can still run if then returns nothing
  //     .catch(error => {
  //       dispatch(fetchIngredientsFailed());
  //       return error;
  //     });
  // };
};

import axios from 'axios';
import * as actionTypes from './actionTypes';

// firebase API
const baseFirebaseURL = 'https://identitytoolkit.googleapis.com/v1';
const API_KEY = 'AIzaSyBl6sS0LG04ZZdUIOGGUtKbtk3ayGDnDGw';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId,
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = time => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, time * 1000);
  };
};

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };

    let url = `${baseFirebaseURL}/accounts:signUp?key=${API_KEY}`;
    if (!isSignUp) {
      url = `${baseFirebaseURL}/accounts:signInWithPassword?key=${API_KEY}`;
    }
    axios
      .post(url, authData)
      .then(res => {
        const expDate = new Date(
          new Date().getTime() + res.data.expiresIn * 1000,
        );
        // persistent state in local storage
        localStorage.setItem('token', res.data.idToken);
        localStorage.setItem('expirationDate', expDate);
        localStorage.setItem('userId', res.data.localId);
        // redux sync interactions
        dispatch(authSuccess(res.data.idToken, res.data.localId));
        dispatch(checkAuthTimeout(res.data.expiresIn));
      })
      .catch(err => {
        //   axios stores it very strange
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate > new Date()) {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000,
          ),
        );
      } else {
        dispatch(logout());
      }
    }
  };
};

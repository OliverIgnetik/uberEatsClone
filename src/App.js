import React, { Component } from 'react';

import * as actions from './store/actions';
import { connect } from 'react-redux';
import Auth from './containers/Auth/Auth';
import Orders from './containers/Orders/Orders';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Checkout from './containers/Checkout/Checkout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Layout from './components/Layout/Layout';
import classes from './App.module.css';
import Logout from './containers/Auth/Logout/Logout';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    let routes = (
      <Switch>
        <Route path='/auth' component={Auth} />
        <Route path='/' component={BurgerBuilder} />
        <Redirect to='/' />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path='/checkout' component={Checkout} />
          <Route path='/orders' component={Orders} />
          <Route path='/logout' component={Logout} />
          <Route path='/' component={BurgerBuilder} />
          <Redirect to='/' />
        </Switch>
      );
    }
    return (
      <div className={classes.App}>
        <Layout>{routes}</Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

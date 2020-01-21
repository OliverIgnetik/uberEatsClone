import React, { Component } from 'react';
import AsyncComponent from './hoc/AsyncComponent';
import * as actions from './store/actions';
import { connect } from 'react-redux';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
// styling for app
import classes from './App.module.css';
// sync components
import Layout from './components/Layout/Layout';
import Logout from './containers/Auth/Logout/Logout';
// lazy loading
const Checkout = AsyncComponent(() => import('./containers/Checkout/Checkout'));
const Auth = AsyncComponent(() => import('./containers/Auth/Auth'));
const BurgerBuilder = AsyncComponent(() =>
  import('./containers/BurgerBuilder/BurgerBuilder'),
);
const Orders = AsyncComponent(() => import('./containers/Orders/Orders'));

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
          <Route path='/auth' component={Auth} />
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

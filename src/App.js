import React, { Component } from 'react';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Layout from './components/Layout/Layout';
import classes from './App.module.css';

class App extends Component {
  render() {
    return (
      <div className={classes.App}>
        <Layout>
          <BurgerBuilder />
        </Layout>
      </div>
    );
  }
}

export default App;

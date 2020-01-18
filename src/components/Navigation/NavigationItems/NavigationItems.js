import React from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = props => {
  return (
    <ul className={classes.NavigationItems}>
      {/* need exact route for root */}
      <NavigationItem exact link='/'>
        Burger Builder
      </NavigationItem>
      <NavigationItem link='/orders'>Orders</NavigationItem>
    </ul>
  );
};

export default navigationItems;

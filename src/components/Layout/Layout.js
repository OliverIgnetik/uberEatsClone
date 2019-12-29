import React from 'react';
import Hocaux from '../../hoc/HOCAUX';
import classes from './Layout.module.css';

const layout = props => {
  return (
    <Hocaux>
      <div>Toolbar, SideDrawer, Backdrop</div>
      <main className={classes.Content}>{props.children}</main>
    </Hocaux>
  );
};

export default layout;

import React from 'react';
import Backdrop from './Backdrop.module.css';

const backdrop = props => {
  return (
    props.show && (
      <div className={Backdrop.Backdrop} onClick={props.clicked}></div>
    )
  );
};

export default backdrop;

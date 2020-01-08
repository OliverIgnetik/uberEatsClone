import React from 'react';
import classes from './Modal.module.css';
import Hocaux from '../../../hoc/HOCAUX';
import Backdrop from '../Backdrop/Backdrop';
import propTypes from 'prop-types';

class Modal extends React.Component {
  // only render the order summary in the virtual DOM if
  // the modal is shown or the order summary changes
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.show !== this.props.show ||
      nextProps.children !== this.props.children
    );
  }
  render() {
    return (
      <Hocaux>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          className={classes.Modal}
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? '1' : '0',
          }}>
          {this.props.children}
        </div>
      </Hocaux>
    );
  }
}

// prop type validation
Modal.propTypes = {
  modalClosed: propTypes.func,
  show: propTypes.bool,
};

export default Modal;

import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Hocaux from '../HOCAUX';

const withErrorHandler = (WrappedComponent, axiosOrders) => {
  return class extends Component {
    state = {
      error: null,
    };
    // can alternatively move this code inside the constructor
    UNSAFE_componentWillMount() {
      this.requestInterceptor = axiosOrders.interceptors.request.use(req => {
        this.setState({ error: null });
        return req;
      });
      this.responseInterceptor = axiosOrders.interceptors.response.use(
        res => res,
        error => {
          this.setState({ error: error });
        },
      );
    }

    componentWillUnmount() {
      // this allows for reuse of this HOC
      axiosOrders.interceptors.request.eject(this.requestInterceptor);
      axiosOrders.interceptors.response.eject(this.responseInterceptor);
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null });
    };
    render() {
      return (
        <Hocaux>
          <Modal
            show={this.state.error}
            modalClosed={this.errorConfirmedHandler}>
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Hocaux>
      );
    }
  };
};

export default withErrorHandler;

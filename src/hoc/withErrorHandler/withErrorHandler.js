import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Hocaux from '../HOCAUX';

const withErrorHandler = (WrappedComponent, axiosOrders) => {
  // anonymous class
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
      };

      // need to initialize the interceptors in the constructor before the children are mounted and reach out to the web
      this.requestInterceptor = axiosOrders.interceptors.request.use(req => {
        // console.log('====================================');
        // console.log('[withErrorHandler.js] request intercepted');
        // console.log('====================================');
        this.setState({ error: null });
        return req;
      });
      this.responseInterceptor = axiosOrders.interceptors.response.use(
        res => {
          // console.log('====================================');
          // console.log('[withErrorHandler.js] response intercepted');
          // console.log('====================================');
          return res;
        },
        error => {
          console.log('====================================');
          console.log('[withErrorHandler.js] error registered');
          console.log('====================================');
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

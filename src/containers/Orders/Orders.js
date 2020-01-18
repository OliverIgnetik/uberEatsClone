import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import axiosOrders from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
    };
  }

  componentDidMount() {
    axiosOrders
      .get('/orders.json')
      .then(res => {
        console.log(res);
        const fetchedOrders = [];
        for (let key in res.data) {
          fetchedOrders.push({ ...res.data[key], id: key });
        }
        this.setState({ loading: false, orders: fetchedOrders });
      })
      .catch(err => {
        this.setState({ loading: false });
        return err;
      });
  }

  render() {
    return (
      <div>
        {this.state.orders.map(order => (
          <Order
            key={order.id}
            ingredients={order.ingredients}
            price={order.price}
          />
        ))}
      </div>
    );
  }
}

export default withErrorHandler(Orders, axiosOrders);

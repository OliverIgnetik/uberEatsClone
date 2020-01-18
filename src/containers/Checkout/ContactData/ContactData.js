import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axiosOrders from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      address: {
        street: '',
        postalCode: '',
      },
      loading: false,
    };
  }

  orderHandler = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      customer: {
        name: 'olli',
        address: {
          street: 'test street',
          zipCode: '123123',
          country: 'Australia',
        },
        email: 'olli@ozemail.com.au',
      },
      deliveryMethod: 'fastest',
    };
    // firebase convention /name.json
    axiosOrders
      .post('/orders.json', order)
      .then(res => {
        setTimeout(() => {
          this.setState({
            loading: false,
          });
          this.props.history.push('/');
        }, 1000);
      })
      .catch(err => {
        this.setState({ loading: false });
        this.props.history.push('/');
      });
  };

  render() {
    let form = (
      <form>
        <input
          className={classes.Input}
          type='text'
          name='name'
          placeholder='Your name'
        />
        <input
          className={classes.Input}
          type='email'
          name='email'
          placeholder='Your email'
        />
        <input
          className={classes.Input}
          type='text'
          name='street'
          placeholder='Street'
        />
        <input
          className={classes.Input}
          type='text'
          name='postal'
          placeholder='Postal Code'
        />
        <Button btnType='Success' clicked={this.orderHandler}>
          ORDER
        </Button>
      </form>
    );

    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;

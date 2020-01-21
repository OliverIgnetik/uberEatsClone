import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controls: {
        email: {
          elementType: 'input',
          elementConfig: {
            type: 'email',
            placeholder: 'Your E-mail',
          },
          validation: {
            required: true,
            isEmail: true,
          },
          valid: false,
          value: '',
          touched: false,
        },
        password: {
          elementType: 'input',
          elementConfig: {
            type: 'password',
            placeholder: 'Your password',
          },
          validation: {
            required: true,
            minLength: 6,
          },
          valid: false,
          value: '',
          touched: false,
        },
      },
      isSignUp: true,
    };
  }

  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath();
    }
  }

  checkValidity = (value, rules) => {
    // make sure all the validations pass
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      isValid = re.test(String(value).toLowerCase()) && isValid;
    }

    return isValid;
  };

  inputChangedHandler = (event, controlName) => {
    // deep clone needs multiple spread operators to avoid pointers
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(
          event.target.value,
          this.state.controls[controlName].validation,
        ),
        touched: true,
      },
    };
    this.setState({ controls: updatedControls });
  };

  submitHandler = event => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignUp,
    );
  };

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return { ...prevState, isSignUp: !prevState.isSignUp };
    });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    let form = formElementsArray.map(el => (
      <Input
        key={el.id}
        touched={el.config.touched}
        shouldValidate={el.config.validation}
        invalid={!el.config.valid}
        elementType={el.config.elementType}
        elementConfig={el.config.elementConfig}
        value={el.config.value}
        changed={event => this.inputChangedHandler(event, el.id)}
      />
    ));

    if (this.props.loading) {
      form = <Spinner />;
    }

    let errorMessage = null;
    if (this.props.error) {
      const text = this.props.error.message.replace('_', ' ');
      errorMessage = <p style={{ color: 'red' }}>{text}</p>;
    }

    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />;
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType='Success'>SUBMIT</Button>
        </form>
        <Button clicked={this.switchAuthModeHandler} btnType='Danger'>
          SWITCH TO {this.state.isSignUp ? 'SIGNIN' : 'SIGNUP'}
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignUp) =>
      dispatch(actions.auth(email, password, isSignUp)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
  };
};

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);

import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  // State is formData, which is an object with all of the field values
  // setFormData is the function we will use to update state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Destructure formData
  const { email, password } = formData;

  // Calling separate onChange function, passing in e as the parameter so that we dont have to manually call setFormData for each onChange function
  // ...formData is shorthand for copying everything into formData, then we will change the name to the value of the input
  // By using [e.target.name], we are targeting the name value of each input so that we can use this onChange for every input and it works correctly
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('SUCCESS');
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign Into Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
            minLength='6'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/login'>Sign Up</Link>
      </p>
    </Fragment>
  );
};

export default Login;

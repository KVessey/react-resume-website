import React from 'react';
import { Link, Redirect } from 'react-router-dom'; // We use Link instead of a href to redirect to pages in ReactJS
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />; // If a user is logged in, do not allow them to navigate back to the dashboard
  }

  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Kyle Vessey</h1>
          <p className='lead'>
            Resume portfolio website showcasing MERN stack technical skills.
          </p>
          {/* <p>
            This website was built with MongoDB, Express.js, React.js, and
            Node.js.
          </p> */}
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              Sign Up
            </Link>
            <Link to='/login' className='btn btn-light'>
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);

import axios from 'axios';

const setAuthToken = (token) => {
  // If there is a token in local storage, set the global header to the token which is passed in
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // Else if what we pass in is not a token, then delete from global headers
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;

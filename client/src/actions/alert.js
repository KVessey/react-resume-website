import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuidv4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  // After a certain amount of time, dispatch the removeAlert to remove the pop up message
  // After 5 seconds, it will dispatch
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};

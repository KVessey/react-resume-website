import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function (state = initialState, action) {
  // Destructure action type and payload
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      // Return existing array and add the new payload
      return [...state, payload];
    case REMOVE_ALERT:
      // Remove specific alert by id
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}

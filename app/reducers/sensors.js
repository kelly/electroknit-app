import { SENSORS_UPDATED } from '../actions/actions';

const initialState = {
  stitch: 0,
  headDirection: 0,
  currentRow: 0
};

export default function sensor(state = initialState, action) {
  switch (action.type) {
  case SENSORS_UPDATED:
    return action.data;
  default:
    return state;
  }
}
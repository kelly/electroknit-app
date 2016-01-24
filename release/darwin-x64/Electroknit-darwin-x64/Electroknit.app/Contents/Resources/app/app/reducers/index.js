import { combineReducers } from 'redux';
import board from './board';
import sensors from './sensors';
import pattern from './pattern';

const rootReducer = combineReducers({
  board,
  sensors,
  pattern
});

export default rootReducer;

import { PATTERN_UPDATED, PATTERN_OPEN, PATTERN_DITHER_TOGGLE, PATTERN_DITHER_THRESHOLD, PATTERN_WIDTH, PATTERN_RENDERED, PATTERN_OFFSET} from '../actions/actions';
import { ipcRenderer } from 'electron';

const initialState = {
  pattern: [],
  dither: false,
};

export default function pattern(state = initialState, action) {
  switch (action.type) {

  case PATTERN_UPDATED:
    return action.pattern;

  case PATTERN_RENDERED:
    return state;

  case PATTERN_OFFSET:
    ipcRenderer.send('pattern:sync', {
      topOffset: action.point.y,
      rightOffset: action.point.x
    });

    state.rightOffset = action.point.x;
    state.topOffset   = action.point.y
    return state;

  case PATTERN_DITHER_TOGGLE:
    ipcRenderer.send('pattern:generate', {
      dither: !state.dither});
    return state;

  case PATTERN_DITHER_THRESHOLD:
    ipcRenderer.send('pattern:generate', {
      ditherThreshold: action.threshold});
    return state;

  case PATTERN_WIDTH:
    if (isNaN(action.width)) return state;

    ipcRenderer.send('pattern:generate', {
      width: action.width});
    return state;

  case PATTERN_OPEN:
    ipcRenderer.send('pattern:open')
    return state;

  default:
  	return state;
 	}
}
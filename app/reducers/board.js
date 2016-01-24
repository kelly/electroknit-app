import { BOARD_ON, BOARD_OFF, BOARD_DETECTED, BOARD_READY, BOARD_START, BOARD_DETECT, BOARD_CONNECT, BOARD_DISCONNECTED } from '../actions/actions';
import { ipcRenderer } from 'electron';

const initialState = {
  isReady: false,
  ports: [],
  isRunning: false,
  connection: ''
}

export default function status(state = initialState, action) {  
  switch (action.type) {
    
  case BOARD_ON:
    return {
      isRunning: state.isRunning,
      isReady: state.isReady,
      ports: state.ports,
      connection: action.connection
    }

  case BOARD_DISCONNECTED:
     return {
      isRunning: false,
      isReady: false,
      ports: state.ports,
      connection: null
    }
     
  case BOARD_OFF:
    ipcRenderer.send('machine:stop');
    return {
      isRunning: false,
      isReady: state.isReady,
      ports: state.ports,
      connection: state.connection
    }

  case BOARD_CONNECT:
    ipcRenderer.send('machine:connect', action.port);
    return state;


  case BOARD_DETECT:
    ipcRenderer.send('machine:detect');
    return state;

  
  case BOARD_DETECTED:
    return {
      isRunning: state.isRunning,
      isReady: state.isReady,
      ports: action.ports,
      connection: state.connection
    }

  case BOARD_READY:
    return {
      isRunning: state.isRunning,
      isReady: true,
      ports: state.ports,
      connection: state.connection
    }

  case BOARD_START:
    ipcRenderer.send('machine:begin');
    return {
      isRunning: true,
      isReady: state.isReady,
      ports: state.ports,
      connection: state.connection
    }
    
  default:
    return state
  }
}
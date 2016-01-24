export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';
export const BOARD_START = 'BOARD_START';
export const BOARD_ON = 'BOARD_ON';
export const BOARD_DETECT = 'BOARD_DETECT';
export const BOARD_OFF = 'BOARD_OFF';
export const BOARD_READY = 'BOARD_READY';
export const BOARD_DISCONNECTED = 'BOARD_DISCONNECTED';
export const BOARD_CONNECT = 'BOARD_CONNECT';
export const BOARD_DETECTED = 'BOARD_DETECTED';
export const BOARD_CONNECTION = 'BOARD_CONNECTING';
export const SENSORS_UPDATED = 'SENSORS_UPDATED';
export const PATTERN_UPDATED = 'PATTERN_UPDATED';
export const PATTERN_OPEN = 'PATTERN_LOAD';
export const PATTERN_DITHER_TOGGLE = 'PATTERN_DITHER_TOGGLE';
export const PATTERN_DITHER_THRESHOLD= 'PATTERN_DITHER_THRESHOLD';
export const PATTERN_WIDTH = 'PATTERN_WIDTH';
export const PATTERN_RENDERED = 'PATTERN_RENDERED';
export const PATTERN_OFFSET = 'PATTERN_OFFSET';

export function patternChange(pattern) {
  return {
    type: PATTERN_UPDATED,
    pattern
  }
}

export function patternOffset(point) {
  return {
    type: PATTERN_OFFSET,
    point
  }
}

export function patternOpen() {
  return {
    type: PATTERN_OPEN
  }
}

export function patternRendered() {
  return {
    type: PATTERN_RENDERED
  }
}

export function patternDitherChange() {
  return {
    type: PATTERN_DITHER_TOGGLE
  }
}

export function patternDitherThresholdChange(threshold) {
  return {
    type: PATTERN_DITHER_THRESHOLD,
    threshold
  }
}

export function patternWidthChange(width) {
  return {
    type: PATTERN_WIDTH,
    width
  }
}

export function sensorsUpdated(data) {
  return {
    type: SENSORS_UPDATED,
    data
  };
}

export function boardOn(connection) {
  return {
    type: BOARD_ON,
    connection
  };
}

export function boardStart() {
  return {
    type: BOARD_START
  };
}

export function boardDisconnected() {
  return {
    type: BOARD_DISCONNECTED
  };
}

export function boardOff() {
  return {
    type: BOARD_OFF
  };
}

export function boardReady() {
  return {
    type: BOARD_READY
  }
}

export function boardDetected(ports) {
  return {
    type: BOARD_DETECTED,
    ports
  };
}

export function boardDetect() {
  return {
    type: BOARD_DETECT
  };  
}

export function boardConnect(port) {
  return {
    type: BOARD_CONNECT,
    port
  };  
}

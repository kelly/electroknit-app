import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import styles from '../stylesheets/modules/buttons.scss'

export default class StartButton extends Component {
  static propTypes = {
    board: PropTypes.object,
    boardStart: PropTypes.func.isRequired,
    boardOff: PropTypes.func
  };

  render() {
    const { board, boardStart, boardOff } = this.props;

    const startStatus = classNames({
      'start-button' : true,
      'start-button-ready': board.isReady
    });

    const startIcon = classNames({
      'fa icon' : true,
      'fa-play' : !board.isRunning,
      'fa-pause': board.isRunning
    })

    return (
      <button disabled={!board.isReady} className={startStatus} onClick={board.isRunning ? boardOff : boardStart}><span className={startIcon}></span></button>
    );
  }
}
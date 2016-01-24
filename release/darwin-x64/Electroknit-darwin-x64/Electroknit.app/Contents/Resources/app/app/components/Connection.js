import React, { Component, PropTypes } from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import styles from '../stylesheets/modules/dropdown.scss'
import { ipcRenderer } from 'electron';

export default class Connection extends Component {
  static propTypes = {
    board: PropTypes.object.isRequired,
    boardConnect: PropTypes.func.isRequired,
    boardDetect: PropTypes.func.isRequired
  };

  clickedConnect(evt) {
    evt.preventDefault();

    const port = evt.target.text;
    const { boardConnect } = this.props;
    boardConnect(port);

    this.refs.dropdown.hide();
  }

  render() {
    const { board, boardDetect } = this.props;
    const boardStatus = classNames({
      'board-status' : true,
      'board-connected': board.connection
    });
    return (
      <Dropdown ref="dropdown" onShow={boardDetect} className={styles.dropdown}>
        <DropdownTrigger>
          <span className={boardStatus}></span>
          <span className="title">{board.connection ? board.connection : 'Select Device'}</span>
          <span className="fa fa-caret-down icon"></span>
        </DropdownTrigger>
        <DropdownContent>
          <ul>
            {board.ports.map((port) => {
              return <li key={port} value={port}><a href="#" value={port} onClick={::this.clickedConnect}>{port}</a></li>
            })}
          </ul>
        </DropdownContent>
      </Dropdown>
    );
  }
}
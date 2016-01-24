import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from '../stylesheets/modules/home.scss';
import Connection from './Connection';
import Sensors from './Sensors';
import Pattern from '../containers/Pattern';
import StartButton from './StartButton';
import * as Actions from '../actions/actions';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import $ from 'jQuery';
import ReactDOM from 'react-dom';

class Home extends Component {
  static propTypes = {
    board: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props;

    ipcRenderer.on('machine:ready', function(evt, connection) {
      dispatch(Actions.boardOn(connection));
    });

    ipcRenderer.on('machine:close', function() {
      dispatch(Actions.boardDisconnected());
    });

    ipcRenderer.on('machine:detected', function(evt, ports) {
      dispatch(Actions.boardDetected(ports));
    });


    window.addEventListener("resize", this.resize.bind(this));
    this.resize(); // set initial
  }

  resize() {
    // hacky
    const size = { 
      width: $(window).width(), 
      height: $(window).height()
    }
    const $node = $(ReactDOM.findDOMNode(this.refs.workboard));
    size.height -= $node.offset().top;

    $node.css('height', size.height);
  }

  render() {
    const { board, pattern, dispatch } = this.props;
    let boundActionCreators = bindActionCreators(Actions, dispatch);
    return (
      <div>
        <div className={styles.container}>
          <div className="header">
            <Connection board={board} className="port-button" {...boundActionCreators} />
            <h1 className="header-title">ELECTROKNIT</h1>
            <StartButton board={board} className="start-button" {...boundActionCreators} />
          </div>
          <div className="workboard-container" ref="workboard">
            <Pattern ref="pattern" board={board} />
            <Sensors ref="sensors" />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    board: state.board
  }
}
export default connect(mapStateToProps)(Home)
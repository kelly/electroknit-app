import React, { Component, PropTypes } from 'react';
import PatternMenu from '../components/PatternMenu';
import PatternCanvas from '../components/PatternCanvas';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import * as Actions from '../actions/actions';
import { bindActionCreators } from 'redux'
import styles from '../stylesheets/modules/pattern.scss';

class Pattern extends Component {
  static propTypes = {
    pattern: PropTypes.object,
    board: PropTypes.object
  }

  componentDidMount() {
    const { dispatch, board } = this.props;
    
    ipcRenderer.on('update:pattern', (evt, pattern) => {
      dispatch(Actions.patternChange(pattern));
      if (board.connection) {
        dispatch(Actions.boardReady());
      }
    });
   
  }

  componentDidUpdate() {
    const { dispatch, board, pattern } = this.props;

    if (board.connection && !board.isReady && pattern.pattern.length > 0) {
      dispatch(Actions.boardReady());
    }
  }

  render() {
    const { pattern, dispatch } = this.props;

    let boundActionCreators = bindActionCreators(Actions, dispatch)
    return (
      <div className="pattern-container">
        <PatternMenu pattern={pattern} {...boundActionCreators} />
        <PatternCanvas pattern={pattern} {...boundActionCreators} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pattern: state.pattern
  }
}

export default connect(mapStateToProps)(Pattern);

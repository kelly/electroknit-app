import React, { Component, PropTypes } from 'react';
import * as Actions from '../actions/actions';
import Toggle from 'react-toggle';
import ReactSlider from 'react-slider';

import toggleStyles from '../stylesheets/modules/toggle.scss';
import sliderStyles from '../stylesheets/modules/slider.scss';
import formStyles from '../stylesheets/modules/forms.scss';

export default class PatternMenu extends Component {
  static propTypes = {
    pattern: PropTypes.object,
    patternOpen: PropTypes.func.isRequired,
    patternDitherChange: PropTypes.func.isRequired,
    patternDitherThresholdChange: PropTypes.func.isRequired,
    patternWidthChange: PropTypes.func.isRequired
  };

  patternWidthChange() {
    const { patternWidthChange } = this.props;
    const width = parseInt(this.refs.widthInput.value);

    patternWidthChange(width);
  }

  render() {
    const { pattern, patternOpen, patternDitherChange, patternDitherThresholdChange } = this.props;
    return (
      <ul className="menu clearfix">
        <li className="menu-item">
          <span className="title menu-title">File</span>
          <button className="dropdown-button" onClick={patternOpen}>
            <span className="title">{pattern.imageFilename ? pattern.imageFilename : 'Select Image'}</span>
            <span className="fa fa-caret-down icon"></span>
          </button>
        </li>
        <li className="menu-item">
          <span className="title menu-title">Dither</span>
          <Toggle checked={pattern.dither} onChange={patternDitherChange} disabled={!pattern.imageFilename} />
        </li>
        <li className="menu-item">
          <span className="title menu-title">Dither Amount</span>
          <ReactSlider defaultValue={100} value={pattern.ditherThreshold} disabled={!pattern.imageFilename} onAfterChange={patternDitherThresholdChange} min={0} max={255} withBars={true} />
        </li>
        <li className="menu-item">
          <span className="title menu-title">Width</span>
          <input ref="widthInput" defaultValue={pattern.width} placeholder={pattern.width} disabled={!pattern.imageFilename} />
          <button className="mini-button button-pattern-width" onClick={::this.patternWidthChange} disabled={!pattern.imageFilename}><span className="fa icon fa-refresh"></span></button>
        </li>
      </ul>
    );
  }
}
import React, { Component, PropTypes } from 'react';
import * as Actions from '../actions/actions';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import ReactDOM from 'react-dom';
import PIXI from 'pixi.js';
import $ from 'jQuery';
import config from 'electroknit/config.js';

const colors = {
  highlight : 0xe55523,
  base      : 0x4f4d4a,
  baseLight : 0xbfbcb0,
  background: 0xf2efe4,
  baseWhite : 0xffffff
}

class Sensors extends Component {
  static propTypes = {
    sensors: PropTypes.object
  };

  componentDidMount() {
    const { dispatch } = this.props;

    ipcRenderer.on('update:sensors', function(evt, data) {
      dispatch(Actions.sensorsUpdated(data));
    });

    this._setupRenderer();
    this._setupSprites();
    this._setupText();
    this.animate();
  }

  componentDidUpdate() {
    const { sensors } = this.props;

    this.slider.alpha = 1;
    this.slider.x = (config.machine.maxNeedles - sensors.stitch) * this.spriteSize;
    this.slider.y = sensors.currentRow * this.spriteSize;

    this.colLabel.alpha = 1;
    this.colLabel.x = (config.machine.maxNeedles - sensors.stitch) * this.spriteSize;
    this.colLabel.text = sensors.stitch;

    this.rowLabel.alpha = 1;
    this.rowLabel.y = sensors.currentRow * this.spriteSize;
    this.rowLabel.text = sensors.currentRow;
  }

  _setupRenderer() {
    const node = ReactDOM.findDOMNode(this.refs.sensors);

    this.stageWidth = node.clientWidth;
    this.stage = new PIXI.Container();
    this.stage.interactive = false;
    this.renderer = new PIXI.CanvasRenderer(this.stageWidth, this.stageWidth, {transparent: true});

    $(ReactDOM.findDOMNode(this.refs.sensors)).append(this.renderer.view)
  }

  _setupText() {
    this.colLabel = new PIXI.Text('0', {font:"12px Helvetica", fill:colors.highlight});
    this.colLabel.alpha = 0;
    this.colLabel.y = 0;
    this.stage.addChild(this.colLabel);

    this.rowLabel = new PIXI.Text('0', {font:"12px Helvetica", fill:colors.highlight});
    this.rowLabel.alpha = 0;
    this.rowLabel.x = 0;
    this.stage.addChild(this.rowLabel);

  }

  _setupSprites() {
    this.spriteSize = Math.floor(this.stageWidth / config.machine.maxNeedles);

    let graphics = new PIXI.Graphics();
    graphics.beginFill(colors.highlight, 0.9);
    graphics.drawRoundedRect(0, 0, 100, this.spriteSize * 2, 3);
    graphics.beginFill(colors.baseWhite, 0.9);
    graphics.drawCircle(5, 5, 3);
    graphics.endFill();
    let texture = graphics.generateTexture(this.renderer, 1, PIXI.SCALE_MODES.NEAREST);

    this.slider = new PIXI.Sprite(texture);
    this.slider.alpha = 0;
    this.stage.addChild(this.slider);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.stage);
  }

  render() {
    return (<div className="sensors-container" ref="sensors"></div>);
  }
}


function mapStateToProps(state) {
  return {
    sensors: state.sensors
  }
}

export default connect(mapStateToProps)(Sensors);
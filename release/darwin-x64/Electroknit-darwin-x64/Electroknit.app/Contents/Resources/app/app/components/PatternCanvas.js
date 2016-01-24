import React, { Component, PropTypes } from 'react';
import * as Actions from '../actions/actions';
import PIXI from 'pixi.js';
import $ from 'jQuery';
import ReactDOM from 'react-dom';
import config from 'electroknit/config.js';
import _ from 'underscore';
import Loader from 'react-loaders'
import styles from 'loaders.css/src/animations/ball-grid-pulse.scss'
import loaderSyles from '../stylesheets/modules/loader.scss';

const colors = {
  highlight : 0xe55523,
  base      : 0x4f4d4a,
  baseLight : 0xbfbcb0,
  background: 0xf2efe4,
  baseWhite : 0xffffff
}

class PatternGrid extends PIXI.Container {
  constructor(options) {
    super();

    options = options || {};
    _.extend(this, options);

    this.interactive = false;
    this._setup();
  }

  resize(gridWidth, gridHeight) {    
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    this._removeAllChildren();
    this._setup();
  }

  resizeRows(rows) {
    const gridHeight = rows * this.spriteSize;
    this.resize(this.gridWidth, gridHeight);
  }

  _setup() {
    const steps = 10;
    const cols = this.gridWidth / this.spriteSize;
    const rows = this.gridHeight / this.spriteSize;
    const start = steps;

    this.cacheAsBitmap = false;

    for (let y = start; y < rows; y += steps) {
      let yOffset = this.spriteSize * y;
      this._drawGridLine(0, this.gridWidth, yOffset, yOffset);
      this._drawLabelAt(y.toString(), 0, yOffset);
    }

    for (let x = start; x < cols; x += steps) {
      let xOffset = this.spriteSize * x;
      this._drawGridLine(xOffset, xOffset, 0, this.gridHeight);
      this._drawLabelAt((cols - x).toString(), xOffset, 0);
    }

    this.cacheAsBitmap = true;
  }

  _drawLabelAt(str, x, y) {
    let text = new PIXI.Text(str, {font:"12px Helvetica", fill:colors.baseLight});
    text.x = x;
    text.y = y;
    this.addChild(text);
  }

  _drawGridLine(x1, x2, y1, y2) {
    let graphics = new PIXI.Graphics();
    graphics.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    graphics.lineStyle(1, colors.baseLight);
    graphics.moveTo(x1, y1);
    graphics.lineTo(x2, y2);
    graphics.endFill();
    this.addChild(graphics);
  }

  _removeAllChildren() {
    while(this.children[0]) { 
      this.removeChild(this.children[0]); 
    } 
  }
}

class PatternContainer extends PIXI.Container {
  constructor(options) {
    super();

    options = options || {};
    _.extend(this, options);

    this.interactive = true;
    this._setupComponents();
  }

  updatePattern(pattern) {
    if (pattern.pattern.length == 0) return;

    if (!this.updating) {
      this.updating = true;
      this._resizeIfNeeded(pattern);
      this.patternSprite.texture = this._generatePatternTexture(pattern);
      this.hoverSprite.texture = this._generateHoverTexture()
      this.moveTo({
        x: ((config.machine.maxNeedles - pattern.rightOffset - this.patternWidth) * this.spriteSize), 
        y: pattern.topOffset * this.spriteSize
      });
      this.updating = false;
    }
  }

  moveTo(point, shouldSnap) {
    if (this.mouseOffset) {
      point.x -= this.mouseOffset.x;
      point.y -= this.mouseOffset.y;
    }

    point = this._constrain(point);
    this.container.x = point.x;
    this.container.y = point.y;

    const offset = this.patternOffset();
    this.hoverLabel.text = offset.x + ", " + offset.y;
  }

  snapToNearestPoint(point) {
    point = _.each(point, (n, k) => {
      n = Math.round(n); 
      const r = n % this.spriteSize;
      const a = Math.round(r / this.spriteSize) ? -r : r;
      point[k] = n + a;
    });
    return point;
  }

  resize(patternWidth, patternHeight) {
    this.patternWidth = patternWidth;
    this.patternHeight = patternHeight;
    this.hitArea = new PIXI.Rectangle(0, 0, this.spriteSize * patternWidth, this.spriteSize * patternHeight);
    this._setupPatternRenderContainer();
  }

  toggleUserSelected(userSelected) {
    this.userSelected = userSelected ? userSelected : !this.userSelected;
    let alpha = 1;
    if (!this.userSelected) {
      alpha = 0;
    }
    this.hoverSprite.alpha = this.hoverLabel.alpha = alpha;
  }

  patternOffset() {
    return {
      x: config.machine.maxNeedles - Math.round(this.container.x / this.spriteSize),
      y: Math.round(this.container.y / this.spriteSize)
    }
  }

  _resizeIfNeeded(pattern) {
    if (pattern.width != this.patternWidth || pattern.height != this.patternHeight) {
      this.resize(pattern.width, pattern.height);
    }
  }

  _setupComponents() {
    // this extra container is due to a rendering issue with Canvas 
    this.container = new PIXI.Container();
    this.container.interactive = true;
    this.addChild(this.container);

    // setup sprites
    this.patternSprite = new PIXI.Sprite();
    this.container.addChild(this.patternSprite);

    this.hoverSprite = new PIXI.Sprite();
    this.hoverSprite.alpha = 0;
    this.container.addChild(this.hoverSprite);

    this.hoverLabel = new PIXI.Text('', {font:"12px Helvetica", fill:colors.baseWhite});
    this.hoverLabel.x = 2;
    this.hoverLabel.alpha = 0;
    this.container.addChild(this.hoverLabel);

    // setup textures
    this.spriteTexture = this._generateSpriteTexture()
    this.hoverTexture  = this._generateHoverTexture();
  }

  _generateSpriteTexture() {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(colors.base, 1);
    graphics.drawRect(0, 0, this.spriteSize, this.spriteSize);
    graphics.endFill();
    return graphics.generateTexture(this.renderer, 1, PIXI.SCALE_MODES.NEAREST);
  }

  _generateHoverTexture() {
    let graphics = new PIXI.Graphics();
    graphics.lineStyle(2, colors.highlight);
    graphics.drawRect(0, 0, this.spriteSize * this.patternWidth, this.spriteSize * this.patternHeight);
    graphics.endFill();
    graphics.beginFill(colors.highlight, 1);
    graphics.drawRect(0, 0, 50, 14);
    graphics.endFill();
    return graphics.generateTexture(this.renderer, 1, PIXI.SCALE_MODES.NEAREST);
  }

  _setupPatternSprite(pattern) {
    this.patternSprite = new PIXI.Sprite();
    this.container.addChildAt(this.patternSprite, 0);
  }

  _generatePatternTexture(pattern) {
    const pixels = pattern.pattern;

    pixels.forEach((row, rdx) => {
      row.forEach((pixel, cdx) => {
        const alpha = pixel ? 0 : 0.8;
        const idx = cdx + (rdx * row.length);
        const sprite = this.renderContainer.getChildAt(idx);
        if (sprite.alpha != alpha) {
          sprite.alpha = alpha;
        }
      });
    }); 
    this.addChild(this.renderContainer);
    const texture = this.renderContainer.generateTexture(this.renderer, 1, PIXI.SCALE_MODES.NEAREST);
    this.removeChild(this.renderContainer);
    return texture;
  }

  _setupPatternRenderContainer() {
    this.renderContainer = new PIXI.ParticleContainer();
    for (let y = 0; y < this.patternHeight; y++) {
      for (let x = 0; x < this.patternWidth; x++) {
        let sprite = new PIXI.Sprite(this.spriteTexture);
        sprite.alpha = 0;
        sprite.cacheAsBitmap = true;
        sprite.x = x * this.spriteSize;
        sprite.y = y * this.spriteSize;
        this.renderContainer.addChild(sprite);
      };
    };
  }

  rowLength() {

  }

  colLength

  _constrain(point) {
    const max = (config.machine.maxNeedles - this.patternWidth) * this.spriteSize;
    return _.each(point, (n, k) => {
      point[k] = n < 0 ? 0 : (n > max) ? max : n;
    });
  }
}

export default class PatternCanvas extends Component {
  static propTypes = {
    pattern: PropTypes.object,
    patternRendered: PropTypes.func,
    patternOffset: PropTypes.func
  }

  update() {
    const { pattern, patternRendered } = this.props;

    this.patternContainer.updatePattern(pattern);
    this._resizeIfNeeded();

    patternRendered();
  }

  componentDidUpdate() {
    this.update();
  }

  componentDidMount() {
    this._setupRenderer();
    this.spriteSize = Math.floor(this.stageWidth / config.machine.maxNeedles);
    this._setupGridContainer(); 
    this._setupPatternContainer();
    this._setupMouseEvents();
    
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.stage);
  }

  _resizeIfNeeded() {
    const { pattern } = this.props;
    const rows = pattern.pattern.length;
    const height = pattern.pattern.length * this.spriteSize;

    if (height > this.renderer.height) {
      this.renderer.resize(this.stageWidth, height);
      this.renderer.hitArea = new PIXI.Rectangle(0, 0, this.stageWidth, height);
      this.gridContainer.resize(this.stageWidth, height);
    }
  }

  _setupPatternContainer() {
    this.patternContainer = new PatternContainer({
      renderer  : this.renderer,
      spriteSize: this.spriteSize
    });
    this.stage.addChild(this.patternContainer);
  }

  _setupGridContainer() {
    this.gridContainer = new PatternGrid({ 
      gridWidth : this.stageWidth,
      gridHeight: this.stageWidth,
      spriteSize: this.spriteSize
    });

    this.stage.addChild(this.gridContainer);
  }

  _setupRenderer() {
    const node = ReactDOM.findDOMNode(this.refs.stage);
    this.stageWidth = node.clientWidth;
    this.stage = new PIXI.Container();
    this.stage.interactive = true;
    this.stage.hitArea =  new PIXI.Rectangle(0, 0, this.stageWidth, this.stageWidth);
    this.renderer = new PIXI.CanvasRenderer(this.stageWidth, this.stageWidth);
    this.renderer.backgroundColor = colors.background;

    $(ReactDOM.findDOMNode(this.refs.stage)).append(this.renderer.view)
  }

  _setupMouseEvents() {
    const { patternOffset } = this.props;

    this.stage.mousedown = (mouseData) => {
      const coords = this.renderer.plugins.interaction.mouse.global;
      const localCoords = mouseData.data.getLocalPosition(this.patternContainer.patternSprite);

      if (this.patternContainer.patternSprite.containsPoint(coords)) {
        this.patternContainer.toggleUserSelected(true);
        this.patternContainer.mouseOffset = localCoords;
      }
    }

    this.stage.mousemove = (mouseData) => {
      const coords = this.renderer.plugins.interaction.mouse.global;

      if (this.patternContainer.userSelected) {
        this.patternContainer.moveTo(coords);
      }
    }

    this.stage.mouseup = (mouseData) => {
      const coords = this.renderer.plugins.interaction.mouse.global;

      if (this.patternContainer.userSelected) {
        this.patternContainer.toggleUserSelected(false);
        this.patternContainer.snapToNearestPoint(coords);
        this.patternContainer.mouseOffset = null;

        const offset = this.patternContainer.patternOffset();
        offset.x -= this.patternContainer.patternWidth;
        patternOffset(offset);
      } 
    }
  }

  render() {
    const { pattern } = this.props;

    return (
      <div className="stage" ref="stage"></div>
    );
  }

}
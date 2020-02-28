require('pixi.js');

import Config from './Config';
/**
 * Play button to start the game and restart after game over
 */
export default class PlayButton extends PIXI.Sprite {
	constructor(app, config) {
		super(app.assets.textures[config.texture]);
		this._app = app;
		this._config = {
			minScale: Config.getNested(config, 'scale.min') || 1,
			maxScale: Config.getNested(config, 'scale.max') || 1,
			step: config.step || 0.01,
			anchor: config.anchor || 0.5
		}
		this.anchor.set(this._config.anchor);
		app.stage.addChild(this);
		this.interactive = true;
		this.addListener('pointertap', () => this._app.onButtonTapped());
	}

	/**
	 * Update scale and position
	 */
	update(elapsed) {
		// invert step if lowest or highest scale value is reached
		if(this.scale.x <= this._config.minScale || this.scale.x >= this._config.maxScale)
			this._config.step *= -1;
		this.scale.set(this.scale.x + this._config.step * elapsed);
		this.x = this._app.scaleManager.width / 2;
		this.y = this._app.scaleManager.height / 2;
	}
}
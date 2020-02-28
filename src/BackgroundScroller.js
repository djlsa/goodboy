require('pixi.js');

import Config from './Config';
/**
 * Single fullscreen scrolling background image
 */
export default class BackgroundScroller extends PIXI.TilingSprite {
	constructor(app, config) {
		super(app.assets.textures[config.texture]);
		this._app = app;
		this._config = {
			posX: Config.getNested(config, 'position.x') || 0,
			posY: Config.getNested(config, 'position.y') || 0,
			speedX: Config.getNested(config, 'speed.x') || -1,
			speedY: Config.getNested(config, 'speed.y') || 0
		}
		this.width = app.scaleManager.width;
		this.height = this.texture.height;
		this.x = this._config.posX;
		this.y = this._config.posY;
		this._moving = true;
	}

	set moving(moving) { this._moving = moving; }

	/**
	 * Update sprite background tile position and container width
	 */
	update(elapsed) {
		const c = this._config;
		if(this._moving) {
			this.tilePosition.x += c.speedX * elapsed;
			// Prevent the tile position coordinates from reaching large numbers
			if(Math.abs(this.tilePosition.x) >= this.texture.width)
				this.tilePosition.x -= this.texture.width * Math.sign(c.speedX);
			this.tilePosition.y += c.speedY * elapsed;
			if(Math.abs(this.tilePosition.y) >= this.texture.height)
				this.tilePosition.y -= this.texture.height * Math.sign(c.speedY)
		}
		this.width = this._app.scaleManager.width;
	}
}
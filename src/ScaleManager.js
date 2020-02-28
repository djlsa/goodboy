require('pixi.js');

/**
 * Manage scaling by recalculating width and height when resized
 */
export default class ScaleManager {
	constructor(app, config) {
		this._app = app;
		this._fixedWidth = config.width || 0;
		this._fixedHeight = config.height || 0;
		this._scaledWidth = 0;
		this._scaledHeight = 0;
		this._scale = 1;
		this.update();
	}

	get width() { return this._scaledWidth; }

	get height() { return this._scaledHeight; }

	get scale() { return this._scale; }

	/**
	 * Check if resized and recalculate
	 */
	update() {
		const width = window.innerWidth;
		const height = window.innerHeight;
		if(this._app.renderer.width != width || this._app.renderer.height != height) {
			this._app.renderer.resize(width, height);
			this._app.stage.width = width;
			this._app.stage.height = height;
			this._scale = (this._fixedWidth > this._fixedHeight) ?
				width / this._fixedWidth :
				height / this._fixedHeight
			;
			this._app.stage.scale.set(this._scale);
			// if not fixed dimension, calculate from scale value
			this._scaledWidth = (this._fixedWidth > 0) ? this._fixedWidth : width / this._scale;
			this._scaledHeight = (this._fixedHeight > 0) ? this._fixedHeight : height / this._scale;
		}
	}
}
import SpriteEmitter from "./SpriteEmitter";

/**
 * Very simple particle system
 */
export default class Particles extends SpriteEmitter {
	constructor(app, config, parent) {
		super(app, config);
		this._parent = parent;
		this._scale = config.scale || 1;
		this._time = config.time || 0;
		this._elapsed = 0;
		// decrease alpha by this much on each step
		this._alphaStep = 1 / config.steps || 0;
		this._maxParticles = config.maxParticles || 0
		this._particles = 0;
		this._emitting = false;
	}

	/**
	 * Check if time has passed and still under maximum number of particles
	 */
	shouldEmit() {
		const timePassed = this._elapsed >= this._time;
		if(timePassed)
			this._elapsed -= this._time;
		return timePassed && this._particles < this._maxParticles;
	}

	/**
	 * Position particle and update particle count
	 */
	onEmit() {
		let sprite = super.onEmit();
		sprite.anchor.set(0.5);
		sprite.visible = true;
		sprite.alpha = 1;
		sprite.width = sprite.texture.width * this._scale;
		sprite.height = sprite.texture.height * this._scale;
		sprite.x = this._parent.x;
		sprite.y = this._parent.y + this._parent.height / 2 - Math.random() * this._parent.height;
		sprite.angle = Math.random() * 360;
		this._particles++;
	}

	/**
	 * Remove particle when it fades away
	 */
	shouldRemove(child) {
		return child.visible && child.alpha <= 0;
	}

	/**
	 * Remove particle and update particle count
	 */
	onRemove(child) {
		super.onRemove(child);
		this._particles--;
	}

	/**
	 * Gradually fade particle on each update
	 */
	childUpdate(child, elapsed) {
		super.childUpdate(child, elapsed);
		child.alpha -= this._alphaStep * elapsed;
		child.angle += 2.5 * elapsed;
		if(child.angle >= 360)
			child.angle = 0;
	}

	/**
	 * Keep elapsed time
	 */
	update(elapsed) {
		super.update(elapsed);
		this._elapsed += elapsed;
	}
}
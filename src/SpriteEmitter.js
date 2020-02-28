require('pixi.js');

import Config from './Config';
/**
 * Emits sprites that move, useful for background elements
 * and particle systems
 */
export default class SpriteEmitter extends PIXI.Container {
	constructor(app, config) {
		super();
		this._app = app;
		// Replace array of texture names with texture objects from a resource
		// object. This is because some textures are not in the root of the
		// object returned by the loader
		this._config = {
			textures: config.textures || [],
			posX: Config.getNested(config, 'position.x') || 0,
			posY: Config.getNested(config, 'position.y') || 0,
			speedX: Config.getNested(config, 'speed.x') || -1,
			speedY: Config.getNested(config, 'speed.y') || 0,
			minSpacing: Config.getNested(config, 'spacing.min') || 0,
			maxSpacing: Config.getNested(config, 'spacing.max') || 0,
			randomFlip: config.randomFlip || true
		}
		this.x = this._config.posX;
		this.y = this._config.posY;
		this._emitting = true; // emitting by default
		this._moving = true; // moving by default
		this._pool = []; // sprite pool for recycling
	}

	set emitting(emitting) { this._emitting = emitting; }

	set moving(moving) { this._moving = moving; }

	/**
	 * Reuses a sprite from the pool or creates a new
	 * one if there's none available
	 */
	_getSpriteFromPool() {
		let sprite = this._pool.pop();
		if(!sprite) {
			sprite = new PIXI.Sprite();
			this.addChild(sprite);
		}
		return sprite;
	}

	/**
	 * Adds a sprite to the pool for reuse
	 */
	_addSpriteToPool(sprite) {
		sprite.x = 0;
		sprite.y = 0;
		this._pool.push(sprite);
	}

	/**
	 * Returns if a new sprite should be emitted, runs on every update
	 */
	shouldEmit() {
		// By default emit if this container's width is less than double of the
		// screen's width or height, whichever is largest. This way, there's
		// always enough sprites to fill the screen and keep them moving into
		// view without sudden pop-in
		return this.width <= Math.max(this._app.scaleManager.width, this._app.scaleManager.height) * 2;
	}

	/**
	 * Called whenever shouldEmit() returns true, used for initializing the new
	 * sprite's position and visibility
	 */
	onEmit() {
		let sprite = this._getSpriteFromPool();
		// Random texture from array of textures
		sprite.texture = this._app.assets.textures[
			this._config.textures[
				Math.floor(Math.random() * this._config.textures.length)
			]
		];
		// Random spacing between min and max
		const spacing = this._config.minSpacing +
			Math.floor(Math.random() * this._config.maxSpacing);
		// Randomly flip the sprite horizontally for more variation
		if(this._config.randomFlip)
			sprite.scale.x = Math.random() < 0.5 ? -1 : 1;
		sprite.visible = true;
		sprite.x = this.width + spacing;
		sprite.y = 0;
		return sprite;
	}

	/**
	 * Emits sprites continuously for as long as shouldEmit() returns true.
	 * This is useful for populating background scenes as long as the container
	 * fill up eventually, otherwise it could become an infinite loop.
	 */
	preFill() {
		while(this.shouldEmit())
			this.onEmit();
	}

	/**
	 * Returns if a new sprite should be removed, runs on every update
	 */
	shouldRemove(child) {
		// By default remove if offscreen 
		return (
			(this._config.speedX < 0 && child.x < -child.width * 2) ||
			(this._config.speedX > 0 && child.x > this.width + child.width) ||
			(this._config.speedY < 0 && child.y < -child.height * 2) ||
			(this._config.speedY > 0 && child.y > this.height + child.width)
		);
	}

	/**
	 * Called whenever shouldRemove() returns true, by default makes sprite not
	 * visible and adds it back to the pool
	 */
	onRemove(child) {
		child.visible = false;
		this._addSpriteToPool(child);
	}

	/**
	 * Checks if a corner point of an object is within the bounding box of any
	 * of this container's children.
	 */
	checkCollision(object, margin = 0) {
		const ob = object.getBounds();
		for(const child of this.children) {
			// Don't bother checking invisible sprites
			if(!child.visible)
				continue;
			const cb = child.getBounds();
			if(
				cb.contains(ob.left + margin, ob.top + margin) ||
				cb.contains(ob.right - margin, ob.top + margin) ||
				cb.contains(ob.left + margin, ob.bottom - margin) ||
				cb.contains(ob.right - margin, ob.bottom - margin)
			)
				return true;
		}
		return false;
	}

	/**
	 * Called for each child on update
	 */
	childUpdate(child, elapsed) {
		if(this._moving) {
			child.x += this._config.speedX * elapsed;
			child.y += this._config.speedY * elapsed;
		}
	}

	/**
	 * Add, update and remove sprites
	 */
	update(elapsed) {
		for(const child of this.children) {
			// Don't bother updating invisible sprites
			if(child.visible) {
				this.childUpdate(child, elapsed);
				if(this.shouldRemove(child))
					this.onRemove(child);
			}
		}
		if(this._emitting && this.shouldEmit()) {
			this.onEmit();
		}
	}
}
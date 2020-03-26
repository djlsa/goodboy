require('pixi.js');
require('pixi-spine');

import { OutlineFilter } from 'pixi-filters';

import Config from './Config';
import Particles from './Particles';
/**
 * The player and main logic
 */
export default class Player extends PIXI.Container {
	constructor(app, backgroundElements) {
		super();
		this._app = app;
		this._backgroundElements = backgroundElements;
		this._spineSprite = new PIXI.spine.Spine(app.assets.spine[Config.player.asset]);
		this._spineSprite.state.setAnimation(0, Config.player.animation, true);
		this._spineSprite.state.timeScale = 1;
		this._spineSprite.skeleton.scaleX = this._spineSprite.skeleton.scaleY = Config.player.scale;
		this._spineSprite.filters = [ new OutlineFilter() ];
		this.addChild(this._spineSprite);
		this._starParticles = new Particles(app, Config.player.particles.stars, this);
		app.stage.addChildAt(this._starParticles, Config.player.layer);
		this._smokeParticles = new Particles(app, Config.player.particles.smoke, this);
		app.stage.addChildAt(this._smokeParticles, Config.player.layer);
		app.stage.addChildAt(this, Config.player.layer);
		app.stage.interactive = true;
		app.stage.addListener('pointerdown', () => this.onScreenTapped());
		this._states = {
			MAKING_ENTRANCE: 'making_entrance',
			FALLING: 'falling',
			FLYING: 'flying',
			CRASHING: 'crashing',
			CRASHED: 'crashed'
		}
		this._state = this._states.MAKING_ENTRANCE;
		this._gravity = 0;
	}

	/**
	 * Called when countdown finished
	 */
	onGameStarted() {
		this._state = this._states.FALLING;
	}

	/**
	 * On screen click/tap
	 */
	onScreenTapped() {
		if(this._state == this._states.FALLING) {
			this._app.assets.sounds['fly'].play();
			this._state = this._states.FLYING;
		}
	}

	/**
	 * Restart game
	 */
	resetPosition() {
		this._gravity = 0;
		this.x = -this.width;
		this.y = this._app.scaleManager.height / 2;
		this._state = this._states.MAKING_ENTRANCE;
	}

	/**
	 * Update player and particles, check for collisions
	 */
	update(elapsed) {
		this._spineSprite.update(elapsed);
		this._starParticles.update(elapsed);
		this._smokeParticles.update(elapsed);
		// check for collision with floor
		if(this.y >= this._backgroundElements.floorPosition && this._state != this._states.CRASHED) {
			this._state = this._states.CRASHING;
			this._app.assets.sounds['crash'].play();
		}
		else if(this._state == this._states.FALLING || this._state == this._states.FLYING) {
			// check for collisions with collidable objects from background elements
			for(const collidable of this._backgroundElements.collidable) {
				if(collidable.checkCollision(this, Config.player.collision.margin)) {
					this._state = this._states.CRASHING;
					this._app.assets.sounds['hit'].play();
				}
			}
		}
		const c = Config.player.values;
		switch(this._state) {
			case this._states.MAKING_ENTRANCE:
				this._starParticles.emitting = true;
				this.angle = c.entrance.angle;
				if(this.x < this.width)
					this.x += c.entrance.move * elapsed;
				break;
			case this._states.FALLING:
				this._gravity += c.falling.gravity.step;
				this.y += this._gravity * elapsed;
				if(this.y <= 0)
					this.y = 0;
				if(this.angle < c.falling.angle.max && this._gravity > c.falling.gravity.max)
					this.angle += c.falling.angle.step * elapsed;
				break;
			case this._states.FLYING:
				this.angle = c.flying.angle;
				this._gravity = c.flying.gravity;
				this._state = this._states.FALLING;
				break;
			case this._states.CRASHING:
				// in the air
				if(this.y < this._backgroundElements.floorPosition + c.crashed.ground.offset) {
					this._gravity += c.crashed.fall.gravity;
					this.y += this._gravity * elapsed;
					this.x += c.crashed.fall.move * elapsed;
				// on the ground
				} else {
					// rest at ground position + offset to position correctly
					this.y = this._backgroundElements.floorPosition + c.crashed.ground.offset;
					this._starParticles.emitting = false;
					this._smokeParticles.emitting = true;
					// use gravity value for deceleration
					this._gravity -= c.crashed.ground.decelerate;
					if(this._gravity > 0)
						this.x += this._gravity * elapsed;
					else {
						this._state = this._states.CRASHED;
						this._smokeParticles.emitting = false;
						this._app.onGameEnded();
					}
				}
				if(this.angle < c.crashed.angle.max)
					this.angle += c.crashed.angle.step * elapsed;
				else
					this.angle = c.crashed.angle.max;
				break;
		}
	}
}
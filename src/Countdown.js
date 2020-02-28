require('pixi.js');

import Text from './Text';
import Config from './Config';
/**
 * Text element which counts down to zero
 */
export default class Countdown extends PIXI.Container {
	constructor(app, config) {
		super();
		this._app = app;
		this._config = {
			startValue: config.startValue || 0,
			stepTimeMS: config.stepTimeMS || 1000
		};
		this._current = -1;
		this._elapsed = 0;
		this._text = new Text(this._config.startValue);
		this._text.anchor.set(0.5);
		this.addChild(this._text);
		app.stage.addChild(this);
		this.visible = false;
		// set up a timer to track elapsed time
		PIXI.Ticker.system.add(this._onTick, this);
	}

	start() {
		this._current = this._config.startValue;
		this._elapsed = 0;
		this.onCountDown(this._current); // first step
	}

	/**
	 * Triggered on each decreasing value
	 */
	onCountDown(time) {
		// number if > 0, GO if == 0, clear afterwards
		this._text.text = 
			(time > 0) ? time :
			(time == 0) ? Config.countDown.goText :
			''
		;
		this._app.onCountDown(time);
	}

	/**
	 * Triggered by PIXI.ticker
	 */
	_onTick() {
		if(this._current >= 0) {
			const c = this._config;
			this._elapsed += PIXI.Ticker.system.elapsedMS;
			// if sum of elapsed time is bigger than the step (usually 1000ms)
			if(this._elapsed >= c.stepTimeMS) {
				// subtract only the step since we could have gone over
				this._elapsed -= c.stepTimeMS;
				this.onCountDown(--this._current);
			}
		}
	}

	/**
	 * Keep centered horizontally and vertically
	 */
	update() {
		this.x = this._app.scaleManager.width / 2;
		this.y = this._app.scaleManager.height / 2;
	}
}
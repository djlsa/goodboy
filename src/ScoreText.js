import Config from './Config';
import Text from './Text';
/**
 * Text element to display game score
 */
export default class ScoreText extends Text {
	constructor(app, config) {
		super('');
		this._app = app;
		this._config = config;
		app.stage.addChild(this);
		this.y = Config.getNested(config, 'position.y') || 0;
		this.anchor.set(config.anchor || 0, 0);
	}

	set score(score) {
		this._score = score;
		this.text = this._config.scoreText + score;
		// save to LocalStorage
		if(this._score > this._bestScore)
			window.localStorage.setItem(this._config.localStorageKey, this._score);
	}

	get score() { return this._score; }

	/**
	 * Reset the score
	 */
	reset() {
		this.score = 0;
	}

	/**
	 * High score
	 */
	showBestScore() {
		// get from LocalStorage
		this._bestScore = window.localStorage.getItem(this._config.localStorageKey);
		if(this._bestScore)
			this.text = this._config.bestScoreText + this._bestScore;
		else
			this.reset();
	}

	/**
	 * Keep centered horizontally
	 */
	update() {
		this.x = this._app.scaleManager.width / 2;
	}
}
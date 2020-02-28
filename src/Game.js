require('pixi.js');

import Loader from './Loader';
import Player from './Player';
import ScaleManager from './ScaleManager';
import Countdown from './Countdown';
import BackgroundElements from './BackgroundElements';
import PlayButton from './PlayButton';
import ScoreText from './ScoreText';
import Config from './Config';
/**
 * Game UI and state management
 */
export default class Game extends PIXI.Application {
	constructor() {
		super();
		// Set up screen with fixed height, flexible width
		this._scaleManager = new ScaleManager(this, Config.screen);
		document.getElementById('game').appendChild(this.view);
		new Loader(this, (assets) => this.onLoad(assets));
		this._states = {
			START_SCREEN: 'start_screen',
			START_COUNTDOWN: 'start_countdown',
			IN_GAME: 'in_game',
			GAMEOVER_SCREEN: 'gameover_screen'
		}
		this._state = this._states.START_SCREEN;
	}

	/**
	 * Return loaded assets for access from other classes
	 */
	get assets() { return this._assets; }

	get scaleManager() { return this._scaleManager; }

	/**
	 * Initialize game elements after all assets are loaded
	 */
	onLoad(assets) {
		this._assets = assets;
		this._backgroundElements = new BackgroundElements(this);
		this._player = new Player(this, this._backgroundElements);
		this._countdown = new Countdown(this, Config.countDown);
		this._playButton = new PlayButton(this, Config.playButton);
		this._scoreText = new ScoreText(this, Config.scoreText);
		this._scoreText.showBestScore();
		// play music
		this._music = assets.sounds['music'];
		this._music.loop = true;
		this.ticker.add((elapsed) => this.gameLoop(elapsed));
	}

	/**
	 * Called when player scores a point
	 */
	score() {
		// prevent scoring when game is over but player sprite is
		// still passing through obstacles
		if(this._state != this._states.START_SCREEN) {
			this._scoreText.score++;
			this._assets.sounds['score'].play();
		}
	}

	/**
	 * Main game loop
	 */
	gameLoop(elapsed) {
		// update ScaleManager to recalculate width/height/scale
		this._scaleManager.update();
		switch(this._state) {
			case this._states.START_SCREEN:
				this._playButton.update(elapsed);
				break;
			case this._states.START_COUNTDOWN:
				this._countdown.update(elapsed);
				break;
		}
		this._backgroundElements.update(elapsed);
		this._player.update(elapsed);
		this._scoreText.update();
	}

	/**
	 * Called by playButton on click/tap
	 */
	onButtonTapped() {
		this._assets.sounds['button'].play();
		this._music.play();
		this._state = this._states.START_COUNTDOWN;
		this._countdown.visible = true;
		this._countdown.start();
		this._playButton.visible = false;
		// remove obstacles from every background element declared as obstacle
		this._backgroundElements.removeObstacles();
		this._backgroundElements.moving = true;
		this._player.resetPosition();
		this._scoreText.showBestScore();
	}

	/**
	 * Called by countDown on time passed
	 */
	onCountDown(time) {
		if(time > 0)
			this._assets.sounds['countdown'].play();
		else if(time == 0)
			this._assets.sounds['go'].play();
		else {
			this._countdown.visible = false;
			this._scoreText.reset();
			this._player.onGameStarted();
		}
	}

	/**
	 * Called by player when collision occurs
	 */
	onGameEnded() {
		this._state = this._states.START_SCREEN;
		this._scoreText.text += Config.scoreText.gameOverText;
		this._playButton.visible = true;
		this._backgroundElements.moving = false;
	}
}
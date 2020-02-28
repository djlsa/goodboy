import Config from './Config';
import SpriteEmitter from './SpriteEmitter';
/**
 * All background elements, including obstacles
 */
export default class BackgroundElements {
	constructor(app) {
		this._app = app;
		this._collidable = []; // elements that trigger collision with player
		this._backgroundElements = {}; // hashmap with the background elements
		// background elements are defined in Config
		for(const [name, config] of Object.entries(Config.backgroundElements)) {
			// instantiate using the class defined in config
			const backgroundElement = new config.type(this._app, config);
			this._backgroundElements[name] = backgroundElement;
			// prefill background elements such as trees
			if(config.type == SpriteEmitter)
				backgroundElement.preFill();
			if(config.collidable)
				this._collidable.push(backgroundElement);
			app.stage.addChild(backgroundElement);
			backgroundElement.x = Config.getNested(config, 'position.x') || 0;
			backgroundElement.y = Config.getNested(config, 'position.y') || 0;
		}
		this.moving = false;
	}

	/**
	 * Make all background elements start moving
	 */
	set moving(moving) {
		for(const element of Object.values(this._backgroundElements)) {
			element.moving = moving;
		}
	}

	/**
	 * Returns list of collidable elements
	 */
	get collidable() { return this._collidable;	}

	/**
	 * Calculation of floor position (player position on game over)
	 */
	get floorPosition() {
		return this._backgroundElements['floor'].y +
			Config.player.collision.margin;
	}

	/**
	 * Remove all obstacles to reset the game
	 */
	removeObstacles() {
		this._backgroundElements['columns'].removeObstacles();
	}

	/**
	 * Update all background elements 
	 */
	update(elapsed) {
		for(const element of Object.values(this._backgroundElements))
			element.update(elapsed);
	}
}
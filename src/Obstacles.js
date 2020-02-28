import SpriteEmitter from "./SpriteEmitter";
/**
 * Obstacles that the player has to avoid
 */
export default class Obstacles extends SpriteEmitter {
	constructor(app, config) {
		super(app, config);
		this._config.minSpacing = config.spacing || 0;
		this._config.gap = config.gap || 0;
		// the score will increment whenever an obstacle passes this position
		this._config.scoreX = config.scoreX || 0;
		// get column height from first texture for calculations
		const height = this._app.assets.textures[
			this._config.textures[0]
		].height;
		// how much the columns can move up or down
		this._maxDisplacement = height / 2;
		// top column vertical origin point
		this._topYOrigin = -height + config.gap / 2;
		this._last = null; // last spawned column (to get its position)
	}

	/** 
	 * Called when shouldEmit() indicates that we need to spawn more
	 */
	onEmit() {
		let topColumn = this._getSpriteFromPool();
		let bottomColumn = this._getSpriteFromPool();
		topColumn.texture = bottomColumn.texture = this._app.assets.textures[
			this._config.textures[0]
		];
		this.addChild(topColumn);
		this.addChild(bottomColumn);
		topColumn.visible = true;
		bottomColumn.visible = true;
		// starting X position for calculations, usually from last column
		const x = (this._last) ?
			this._last.x || 0 :
			Math.min( // shortest screen dimension
				this._app.scaleManager.width, this._app.scaleManager.height
			) +	topColumn.width
		;
		topColumn.x = x + topColumn.width + this._config.minSpacing;
		bottomColumn.x = x + bottomColumn.width + this._config.minSpacing;
		const randomHeight = Math.floor(Math.random() * this._maxDisplacement);
		topColumn.y = this._topYOrigin + randomHeight;
		bottomColumn.y = topColumn.y + topColumn.height + this._config.gap;
		// keep the last column for later calculation
		this._last = topColumn;
		topColumn.scored = false;
		bottomColumn.scored = true; // to prevent scoring twice
	}

	/**
	 * Remove obstacles to reset game
	 */
	removeObstacles() {
		for(const child of this.children) {
			this.onRemove(child);
		}
		this._last = null;
	}

	/**
	 * Update and check if in position to score
	 */
	childUpdate(child, elapsed) {
		super.childUpdate(child, elapsed);
		if(child.visible && !child.scored && child.x <= this._config.scoreX) {
			this._app.score();
			child.scored = true;
		}
	}
}
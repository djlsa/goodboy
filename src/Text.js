require('pixi.js');

import Config from './Config';
/**
 * Text element with default pre-configured style
 */
export default class Text extends PIXI.Text {
	constructor(text) {
		super(text, Config.text);
	}
}
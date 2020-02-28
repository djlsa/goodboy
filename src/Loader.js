require('pixi.js');

import Config from './Config';
/**
 * Manages loading of assets, including Google fonts
 */
export default class Loader {
	constructor(app, onLoaded) {
		for(name in Config.loader.assets) {
			app.loader.add(name, Config.loader.assets[name]);
		}
		// https://github.com/typekit/webfontloader#configuration
		window.WebFontConfig = {
			google: {
				families: Config.loader.fonts
			},
			active() {
				// load other assets after fonts are available
				app.loader.load((loader, resources) => {
					let spine = [];
					let textures = [];
					let sounds = [];
					for(const [key, resource] of Object.entries(resources)) {
						// organize assets by type; type check could be better..
						if(resource.spineData)
							spine[key] = resource.spineData;
						else if(resource.spritesheet) {
							for(const [ssKey, ssTexture] of Object.entries(resource.spritesheet.textures))
									textures[ssKey] = ssTexture;
						} else if(resource.texture)
							textures[key] = resource.texture;
						else if(resource.data.play)
							sounds[key] = resource.data;
					}
					onLoaded({
						spine: spine,
						textures: textures,
						sounds: sounds
					});
				});
			}
		};
		// Google webfont loader script
		((d) => {
			const wf = d.createElement('script'), s = d.scripts[0];
			wf.src = '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
			wf.async = true;
			s.parentNode.insertBefore(wf, s);
		})(document);
	}
}
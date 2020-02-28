import BackgroundScroller from "./BackgroundScroller";
import SpriteEmitter from "./SpriteEmitter";
import Obstacles from "./Obstacles";
/**
 * Game configuration
 */
export default {
	/**
	 * returns a value inside an object, to prevent multiple checks for null or
	 * undefined
	 * used to initialize values like in this example:
	 * value = getNested(obj, 'nested.object.xx') || 0
	 */
	getNested: (obj, key) => {
		const keys = key.split('.');
		for(const key of keys) {
			obj = obj[key] || {};
		}
		return obj.constructor == Object ? null : obj;
	},
	screen: {
		height: 720
	},
	text: {
		fontFamily: 'Fredoka One',
		fontSize: 50,
		fill: 'white',
		align: 'center'
	},
	loader: {
		assets: {
			// images
			'pixie.json': 'assets/pixie/pixie.json',
			'column.png': 'assets/column.png',
			'playButton.png': 'assets/playButton.png',
			'WorldAssets.json': 'assets/WorldAssets.json',
			'star_01.png': 'assets/particles/star_01.png',
			'star_04.png': 'assets/particles/star_04.png',
			'star_07.png': 'assets/particles/star_07.png',
			'smoke_01.png': 'assets/particles/smoke_01.png',
			'smoke_02.png': 'assets/particles/smoke_02.png',
			'smoke_04.png': 'assets/particles/smoke_04.png',
			'smoke_05.png': 'assets/particles/smoke_05.png',
			'smoke_07.png': 'assets/particles/smoke_07.png',
			'smoke_08.png': 'assets/particles/smoke_08.png',
			// sounds
			'fly': 'assets/sound/sfx_movement_jump8.wav',
			'score': 'assets/sound/sfx_sound_neutral5.wav',
			'button': 'assets/sound/sfx_sound_neutral6.wav',
			'hit': 'assets/sound/sfx_sounds_impact8.wav',
			'crash': 'assets/sound/sfx_sounds_negative1.wav',
			'countdown': 'assets/sound/sfx_sounds_pause3_out.wav',
			'go': 'assets/sound/sfx_sounds_pause7_out.wav',
			// music
			'music': 'assets/music/xylophone.wav'
		},
		fonts: ['Fredoka One']
	},
	player: {
		asset: 'pixie.json',
		animation: 'flying',
		scale: 0.33,
		layer: 8,
		collision: {
			margin: 30
		},
		values: {
			entrance: {
				angle: 30,
				move: 1
			},
			falling: {
				gravity: {
					step: 0.5,
					max: 3
				},
				angle: {
					step: 3,
					max: 180
				}
			},
			flying: {
				angle: 30,
				gravity: -9
			},
			crashed: {
				fall: {
					gravity: 0.5,
					move: 3
				},
				ground: {
					offset: 10,
					decelerate: 1
				},
				angle: {
					step: 1,
					max: 120
				}
			}
		},
		particles: {
			stars: {
				textures: [
					'star_01.png',
					'star_04.png',
					'star_07.png'
				],
				speed: {
					x: -1,
					y: -0.25
				},
				scale: 0.1,
				time: 10,
				steps: 100,
				maxParticles: 60
			},
			smoke: {
				textures: [
					'smoke_01.png',
					'smoke_02.png',
					'smoke_04.png',
					'smoke_05.png',
					'smoke_07.png',
					'smoke_08.png'
				],
				speed: {
					x: -1.5,
					y: 0.25,
				},
				scale: 0.25,
				time: 10,
				steps: 100,
				maxParticles: 60
			}
		}
	},
	backgroundElements: {
		bg: {
			type: BackgroundScroller,
			spritesheet: 'WorldAssets.json',
			texture: '05_far_BG.jpg',
			speed: {
				x: -1
			}
		},
		silhouette: {
			type: BackgroundScroller,
			spritesheet: 'WorldAssets.json',
			texture: '03_rear_silhouette.png',
			position: {
				y: 350
			},
			speed: {
				x: -1.25
			}
		},
		rear_canopy: {
			type: BackgroundScroller,
			spritesheet: 'WorldAssets.json',
			texture: '03_rear_canopy.png',
			position: {
				y: 30
			},
			speed: {
				x: -1.5
			}
		},
		trees: {
			type: SpriteEmitter,
			spritesheet: 'WorldAssets.json',
			textures: [
				'02_tree_1.png',
				'02_tree_2.png'
			],
			speed: {
				x: -2
			},
			position: {
				y: 20
			},
			spacing: {
				min: 100,
				max: 200
			}
		},
		lava: {
			type: BackgroundScroller,
			spritesheet: 'WorldAssets.json',
			texture: '01_front_silhouette.png',
			position: {
				y: 390
			},
			speed: {
				x: -2.5
			}
		},
		canopy: {
			type: BackgroundScroller,
			spritesheet: 'WorldAssets.json',
			texture: '02_front_canopy.png',
			position: {
				y: 30
			},
			speed: {
				x: -2
			}
		},
		flowers: {
			type: SpriteEmitter,
			spritesheet: 'WorldAssets.json',
			textures: [
				'01_hanging_flower1.png',
				'01_hanging_flower2.png',
				'01_hanging_flower3.png'
			],
			speed: {
				x: -2.25
			},
			spacing: {
				min: 50,
				max: 250
			}
		},
		columns: {
			type: Obstacles,
			collidable: true,
			textures: [
				'column.png'
			],
			speed: {
				x: -2.75
			},
			spacing: 300,
			gap: 200,
			scoreX: 0
		},
		floor: {
			type: BackgroundScroller,
			spritesheet: 'WorldAssets.json',
			texture: '00_forest_floor.png',
			position: {
				y: 562
			},
			speed: {
				x: -3
			}
		},
		leaves: {
			type: BackgroundScroller,
			spritesheet: 'WorldAssets.json',
			texture: '00_roof_leaves.png',
			speed: {
				x: -3.5
			}
		}
	},
	playButton: {
		texture: 'playButton.png',
		scale: {
			min: 0.9,
			max: 1.1
		},
		step: 0.01
	},
	countDown: {
		startValue: 3,
		stepTimeMS: 1000,
		goText: 'GO!'
	},
	scoreText: {
		position: {
			y: 25
		},
		anchor: 0.5,
		localStorageKey: 'bestScore',
		bestScoreText: 'BEST: ',
		scoreText: 'SCORE: ',
		gameOverText: '\n\nGAME OVER'
	}
}
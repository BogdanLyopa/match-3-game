import { Container } from 'pixi.js';
import { GameScene } from './GameScene';
import { GradientBackground } from './GradientBackground';
import { PubSub } from 'utils/PubSub';
import ScaleManager from 'utils/ScaleManager';
import { RESIZE } from './EventsNames';

export class Game extends Container {
	scene: GameScene;
	gradientBackground: GradientBackground;

	constructor() {
		super();
		this.gradientBackground = new GradientBackground(
			[
				[0, '#001f3f'],
				[0.3, '#3498db'],
				[0.5, '#1abc9c'],
				[0.9, '#ffffff'],
			],
			960,
			960,
		);
		this.scene = new GameScene();
		this.addChild(this.gradientBackground, this.scene);
		this.resize();
	}

	resize() {
		PubSub.subscribe(RESIZE, () => {
			this.scene.scale.set(ScaleManager.CONTAIN);
			this.gradientBackground.scale.set(ScaleManager.COVER);
		});
	}
}

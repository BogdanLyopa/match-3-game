import * as PIXI from 'pixi.js';
import { Application, Assets, Sprite, Texture } from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/all';
import { Game } from '../game/Game';
import { Config } from '../game/Config';
import { AssetsLoader } from './Loader';
import ScaleManager from 'utils/ScaleManager';
import { PubSub } from 'utils/PubSub';
import { RESIZE } from 'scripts/game/EventsNames';

class MyApplication {
	app: Application;
	loader: AssetsLoader;
	config: typeof Config;
	view = <HTMLCanvasElement>document.querySelector('#canvas');

	constructor(config: typeof Config) {
		this.config = config;

		this.app = new Application({
			view: this.view,
			backgroundColor: 0x000000,
			antialias: false,
			resizeTo: window,
			autoDensity: true,
		});

		this.loader = new AssetsLoader(Assets, this.config);

		globalThis.__PIXI_APP__ = this.app;
	}

	private registerPlugins(): void {
		gsap.registerPlugin(PixiPlugin);
		PixiPlugin.registerPIXI(PIXI);
	}

	public async run(): Promise<void> {
		this.registerPlugins();
		this.resize();

		this.app.renderer.on('resize', (width, height) => {
			const orientation = width > height ? 'landscape' : 'portrait';
			PubSub.publish(RESIZE, { width, height, orientation });
		});

		await this.loader.preload();
		this.start();
	}

	private resize(): void {
		PubSub.subscribe(RESIZE, ({ width, height }) => {
			this.app.stage.position.set(width / 2, height / 2);
			this.app.stage.hitArea = new PIXI.Rectangle(
				-width / 2,
				-height / 2,
				width,
				height,
			);

			ScaleManager.setScreenSize({
				width: document.body.clientWidth,
				height: document.body.clientHeight,
			});
		});
	}

	private start() {
		const game = new Game();
		this.app.stage.addChild(game);
		this.app.resize();
	}

	public getTexture(textureName: string): Texture {
		return this.loader.assets.cache.get(textureName);
	}

	public sprite(textureName: string): Sprite {
		const sprite = Sprite.from(this.getTexture(textureName));
		sprite.anchor.set(0.5);
		return sprite;
	}
}

export const App = new MyApplication(Config);

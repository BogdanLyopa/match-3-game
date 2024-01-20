import { Assets, Texture } from 'pixi.js';
import { Config } from './../game/Config';

export class AssetsLoader {
	assets: typeof Assets;
	config: typeof Config;
	resources: string[];

	constructor(assets: typeof Assets, config: typeof Config) {
		this.assets = assets;
		this.config = config;
		this.resources = [];
	}

	preload(): Promise<Record<string, Texture>> {
		this.resources = this.config.assets
			.filter(asset => this.hasImageExtension(asset.key))
			.map(asset => {
				const key = this.extractKey(asset.key);
				this.assets.add(key, asset.data);
				return key;
			});

		return this.assets.load(this.resources);
	}

	private extractKey(assetKey: string): string {
		const fileName = assetKey.substring(assetKey.lastIndexOf('/') + 1);
		return fileName.substring(0, fileName.indexOf('.'));
	}

	private hasImageExtension(assetKey: string): boolean {
		const imageExtensions = ['.png', '.jpg'];
		return imageExtensions.some(extension => assetKey.includes(extension));
	}
}

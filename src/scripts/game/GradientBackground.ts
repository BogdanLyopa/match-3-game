import { Container, Sprite, Texture } from 'pixi.js';

export class GradientBackground extends Container {
	private gradientTexture: Texture;

	constructor(colorStops: [number, string][], width: number, height: number) {
		super();

		this.gradientTexture = this.createGradTexture(colorStops);

		const gradientSprite = new Sprite(this.gradientTexture);
		gradientSprite.width = width;
		gradientSprite.height = height;
		gradientSprite.anchor.set(0.5);
		gradientSprite.rotation = Math.PI / -2;

		this.addChild(gradientSprite);
	}

	private createGradTexture(colorStops: [number, string][]): Texture {
		const quality = 256;
		const canvas = document.createElement('canvas');

		canvas.width = quality;
		canvas.height = 1;

		const ctx = canvas.getContext('2d')!;

		const grd = ctx.createLinearGradient(0, 0, quality, 0);

		colorStops.forEach(([stop, color]) => {
			grd.addColorStop(stop, color);
		});

		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, quality, 1);

		return Texture.from(canvas);
	}
}

import { Graphics } from 'pixi.js';
import { App } from 'scripts/system/App';

export class Board extends Graphics {
	constructor() {
		super();

		this.draw();
	}

	private draw(): void {
		const { WIDTH, HEIGHT, COLOR, BORDER } = App.config.BOARD;

		this.lineStyle(BORDER.WIDTH, BORDER.COLOR)
			.beginFill(COLOR)
			.drawRoundedRect(0, 0, WIDTH, HEIGHT, 10)
			.endFill()
			.pivot.set(WIDTH / 2, HEIGHT / 2);
	}
}

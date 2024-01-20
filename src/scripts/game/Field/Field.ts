import { Graphics } from 'pixi.js';
import { App } from 'scripts/system/App';
import { Tile } from '../Tile/Tile';

export class Field extends Graphics {
	row: number;
	col: number;
	color: number;
	tile: Tile | null = null;

	constructor(row: number, col: number) {
		super();
		this.row = row;
		this.col = col;
		this.color = App.config.BOARD.FIELD.COLOR;
		this.draw();
	}

	get width(): number {
		const { WIDTH, COLS, BORDER, FIELD } = App.config.BOARD;
		return (WIDTH - BORDER.WIDTH) / COLS - FIELD.GAP;
	}

	get height(): number {
		const { HEIGHT, ROWS, BORDER, FIELD } = App.config.BOARD;
		return (HEIGHT - BORDER.WIDTH) / ROWS - FIELD.GAP;
	}

	getPosition(): { x: number; y: number } {
		const { width, height, col, row } = this;
		const { BORDER, WIDTH, HEIGHT, FIELD } = App.config.BOARD;

		const colOffset = width * col + FIELD.GAP * (col + 0.5);
		const rowOffset = height * row + FIELD.GAP * (row + 0.5);

		const x = colOffset + width / 2 + BORDER.WIDTH / 2 - WIDTH / 2;
		const y = rowOffset + height / 2 + BORDER.WIDTH / 2 - HEIGHT / 2;

		return { x, y };
	}

	draw(): void {
		const { x, y } = this.getPosition();
		const { RADIUS } = App.config.BOARD.FIELD;

		this.beginFill(this.color)
			.drawRoundedRect(x, y, this.width, this.height, RADIUS)
			.endFill()
			.pivot.set(this.width / 2, this.height / 2);
	}

	setTile(tile: Tile): void {
		this.tile = tile;
		this.name = tile.name;
		tile.field = this;
		tile.setPosition(this.getPosition());
	}
}

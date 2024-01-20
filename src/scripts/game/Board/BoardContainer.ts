import { Container, Graphics } from 'pixi.js';
import { Board } from './Board';
import { Field } from '../Field/Field';
import { Tile } from '../Tile/Tile';
import { TileFactory } from './../Tile/TileFactory';
import { FieldFactory } from '../Field/FieldFactory';

export class BoardContainer extends Container {
	board: Board;
	fields: Field[] = [];
	tiles: Tile[] = [];
	boardMask = new Graphics();

	constructor() {
		super();

		this.board = new Board();
	
		this.fields = FieldFactory.createFields();
		this.tiles = TileFactory.createTiles();

		this.addChild(this.board, ...this.fields, ...this.tiles);
		this.createMask();
	}

	addNewTile(field: Field): Tile {
		const tile = TileFactory.createTile(field);
		this.addChild(tile);
		return tile;
	}

	createMask(): void {
		const { width, height } = this.board;
	
		this.boardMask
			.beginFill(0xffffff)
			.drawRect(0, 0, width, height)
			.endFill()
			.pivot.set(width / 2, height / 2);
	}

	addMask(): void {
		this.addChild(this.boardMask);
		this.mask = this.boardMask;
	}

	removeMask(): void {
		this.removeChild(this.boardMask);
		this.mask = null;
	}
}

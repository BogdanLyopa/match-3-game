import { Tile } from './Tile';
import { FieldFactory } from '../Field/FieldFactory';
import { Field } from '../Field/Field';
import { App } from 'scripts/system/App';
import { Tools } from 'scripts/system/Tools';

export class TileFactory {
	static tiles: Tile[] = [];

	static createTile(field: Field): Tile {
		const { NAMES } = App.config.TILES;

		const name =
			NAMES[
				Tools.randomNumber(0, NAMES.length - 1)
			];

		const tile = new Tile(name);
		this.tiles.push(tile);
		field.setTile(tile);
		return tile;
	}

	static createTiles(): Tile[] {
		return FieldFactory.fields.map(field => {
			return this.createTile(field);
		});
	}
}

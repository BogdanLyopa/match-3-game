import { Field } from './Field';
import { App } from 'scripts/system/App';

export class FieldFactory {
	static fields: Field[] = [];

	static createFields(): Field[] {
		const { ROWS, COLS } = App.config.BOARD;

		for (let row = 0; row < ROWS; row++) {
			for (let col = 0; col < COLS; col++) {
				this.createField(row, col);
			}
		}
		return this.fields;
	}

	static createField(row: number, col: number): Field {
		const field = new Field(row, col);
		this.fields.push(field);
		return field;
	}

	static getField(row: number, col: number): Field {
		return this.fields.find(field => field.row === row && field.col === col)!;
	}
}

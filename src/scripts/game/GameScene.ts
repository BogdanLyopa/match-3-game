import { Container } from 'pixi.js';
import { BoardContainer } from './Board/BoardContainer';
import { Field } from './Field/Field';
import { FieldFactory } from './Field/FieldFactory';
import { ScoreFactory } from './Score/ScoreFactory';
import { SwipeSystem } from './SwipeSystem';
import { App } from 'scripts/system/App';
import { PubSub } from 'utils/PubSub';
import { ADD_NEW_TILES } from './EventsNames';

const INITIAL_SCORES_POSITION_Y = -280;
const INITIAL_BOARD_POSITION_Y = 35;
const INITIAL_NEW_TILES_POSITION_Y = -400;

export class GameScene extends Container {
	boardContainer = new BoardContainer();
	scoresContainer = new Container();

	constructor() {
		super();

		const scores = ScoreFactory.createScores(App.config.SCORES_SETTINGS);
		this.scoresContainer.addChild(...scores);

		this.scoresContainer.y = INITIAL_SCORES_POSITION_Y;
		this.boardContainer.y = INITIAL_BOARD_POSITION_Y;

		this.addChild(this.boardContainer, this.scoresContainer);
		this.interactivityOn();

		PubSub.subscribe(ADD_NEW_TILES, this.updateTiles.bind(this));
	}

	interactivityOn() {
		App.app.stage.eventMode = 'static';
		App.app.stage.on('pointerdown', SwipeSystem.pointerDownHandler);
	}

	fallDownTo(emptyField: Field) {
		for (let row = emptyField.row - 1; row >= 0; row--) {
			const fallingField = FieldFactory.getField(row, emptyField.col);

			if (fallingField.tile) {
				const fallingTile = fallingField.tile;
				fallingTile.field = emptyField;
				emptyField.tile = fallingTile;
				fallingField.tile = null;
				return fallingTile.fallDownTo(emptyField.getPosition(), 0.5);
			}
		}
		return Promise.resolve();
	}

	async processFallDown(): Promise<void | void[]> {
		const tasks: Promise<void>[] = [];
		const { ROWS, COLS } = App.config.BOARD;

		for (let row = ROWS - 1; row >= 0; row--) {
			for (let col = COLS - 1; col >= 0; col--) {
				const field = FieldFactory.getField(row, col);

				if (!field.tile) {
					tasks.push(this.fallDownTo(field) as Promise<void>);
				}
			}
		}

		return Promise.all(tasks);
	}

	addNewTiles() {
		const fields = FieldFactory.fields.filter(field => !field.tile);

		const newTilesPromises = fields.map(field => {
			const tile = this.boardContainer.addNewTile(field);
			tile.y = INITIAL_NEW_TILES_POSITION_Y;
			return tile.fallDownTo(field.getPosition(), 0.5);
		});

		return Promise.all(newTilesPromises);
	}

	async updateTiles() {
		this.boardContainer.addMask();
		this.processFallDown();
		await this.addNewTiles();
		this.boardContainer.removeMask();
		this.interactivityOn();
	}
}

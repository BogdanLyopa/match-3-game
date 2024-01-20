import { FederatedPointerEvent } from 'pixi.js';
import { App } from 'scripts/system/App';
import { Tile } from './Tile/Tile';
import { PubSub } from 'utils/PubSub';
import { ADD_NEW_TILES } from './EventsNames';

export class SwipeSystem {
	static selectedTile: Tile | null = null;
	static selectedTiles: Tile[] = [];

	static pointerDownHandler() {
		App.app.stage.on('pointermove', SwipeSystem.moveHandler.bind(SwipeSystem));
		App.app.stage.on('pointerup', SwipeSystem.pointerUpHandler.bind(SwipeSystem));
	}

	static interactivityOff() {
		App.app.stage.eventMode = 'none';
		App.app.stage.off('pointerdown', SwipeSystem.pointerDownHandler);
	}

	static moveHandler(event: FederatedPointerEvent) {
		if (!(event.target instanceof Tile)) {
			return;
		}

		const tile = event.target;

		if (this.selectedTile) {
			if (!this.isValidMove(tile)) {
				return;
			}

			if (this.isValidToGoBack(tile)) {
				return this.unselectTile(tile);
			}

			if (this.isAlreadySelected(tile)) {
				return;
			}
		}

		this.selectTile(tile);
	}

	static selectTile(tile: Tile) {
		this.selectedTile?.connectWithLine(tile);

		this.selectedTile = tile;
		tile.filterOn();

		this.selectedTiles.push(tile);
	}

	static unselectTile(tile: Tile) {
		this.selectedTile?.filterOff();
		tile.disconnectLine();

		this.selectedTiles.pop();
		this.selectedTile = this.selectedTiles[this.selectedTiles.length - 1];
	}

	static isAlreadySelected(tile: Tile) {
		return this.selectedTiles.includes(tile);
	}

	static isValidMove(tile: Tile) {
		return (
			this.selectedTile?.name === tile.name && this.selectedTile.isNeighbor(tile)
		);
	}

	static isValidToGoBack(tile: Tile) {
		return (
			this.isAlreadySelected(tile) &&
			this.selectedTiles.length - this.selectedTiles.indexOf(tile) === 2
		);
	}

	static pointerUpHandler() {
		App.app.stage.off('pointermove');
		App.app.stage.off('pointerup');
		
		this.clearSelectedTiles();
		this.reset();
	}

	static reset() {
		this.selectedTiles.forEach(tile => {
			tile.filterOff();
			tile.disconnectLine();
		});

		this.selectedTile = null;
		this.selectedTiles = [];
	}

	static async clearSelectedTiles() {
		if (this.selectedTiles.length < 3) {
			return;
		}

		this.interactivityOff();

		const promises = this.selectedTiles.map((tile, index) => {
			return tile.animateToScoreIcon(index);
		});

		await Promise.all(promises);

		PubSub.publish(ADD_NEW_TILES);
	}
}

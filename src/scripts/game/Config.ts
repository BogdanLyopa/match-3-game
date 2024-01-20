import { ScoreSettings } from './Score/ScoreFactory';
import { Tools } from './../system/Tools';
import { TileName } from 'types';

export const Config = {
	assets: Tools.massiveRequire(
		require.context('../../images/', true, /\.(png|jpe?g)$/),
	),

	BOARD: {
		ROWS: 6,
		COLS: 6,
		WIDTH: 520,
		HEIGHT: 540,
		COLOR: 0xecf0f1,
		BORDER: {
			WIDTH: 10,
			COLOR: 0xbdc3c7,
		},
		FIELD: {
			GAP: 5,
			RADIUS: 20,
			COLOR: 0x36c9a7,
		},
	},

	TILES: {
		NAMES: ['green', 'orange', 'pink', 'red', 'yellow'] as TileName[],
		COLORS: {
			green: '0x00ff00',
			orange: '0xffa500',
			pink: '0xffc0cb',
			red: '0xff0000',
			yellow: '0xffff00',
		},
	},

	SCORES_SETTINGS: [
		{ name: 'green', x: -200 },
		{
			name: 'orange',
			x: -100,
		},
		{
			name: 'pink',
			x: 0,
		},
		{
			name: 'red',
			x: 100,
		},
		{
			name: 'yellow',
			x: 200,
		},
	] as ScoreSettings[],
};

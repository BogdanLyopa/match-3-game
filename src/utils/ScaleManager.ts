const gameSize = {
	width: 640,
	height: 960,
};

const gameBigSide = Math.max(gameSize.width, gameSize.height);
const gameSmallSide = Math.min(gameSize.width, gameSize.height);
let screenBigSide = Math.max(gameSize.width, gameSize.height);
let screenSmallSide = Math.min(gameSize.width, gameSize.height);

export default {
	setScreenSize({ width = gameSize.width, height = gameSize.height }) {
		screenBigSide = Math.max(width, height);
		screenSmallSide = Math.min(width, height);
	},

	get COVER() {
		return Math.max(screenBigSide / gameBigSide, screenSmallSide / gameSmallSide);
	},

	get CONTAIN() {
		return Math.min(screenBigSide / gameBigSide, screenSmallSide / gameSmallSide);
	},
};

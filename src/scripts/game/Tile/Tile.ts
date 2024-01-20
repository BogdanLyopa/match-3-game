import gsap from 'gsap';
import { Container, Graphics, Sprite } from 'pixi.js';
import { AdjustmentFilter, GlowFilter } from 'pixi-filters';
import { Emitter, upgradeConfig } from '@pixi/particle-emitter';
import { Field } from '../Field/Field';
import { ScoreFactory } from '../Score/ScoreFactory';
import { App } from 'scripts/system/App';
import particleConfig from './particleConfig';
import ScaleManager from 'utils/ScaleManager';
import { TileName } from 'types';

export class Tile extends Container {
	name: TileName;
	sprite: Sprite;
	field: Field | null = null;
	color = '0xffffff';
	emitter!: Emitter;
	elapsed = 0;
	requestId?: number;

	constructor(name: TileName) {
		super();
		this.name = name;
		this.eventMode = 'static';

		this.sprite = App.sprite(name);
		this.color = App.config.TILES.COLORS[name];

		this.addChild(this.sprite);
	}

	setPosition(position: { x: number; y: number }) {
		this.position.copyFrom(position);
	}

	filterOn() {
		const glowFilter = new GlowFilter();

		const adjustmentFilter = new AdjustmentFilter({
			gamma: 1.4,
			saturation: 1.4,
			contrast: 1.2,
		});

		this.filters = [glowFilter, adjustmentFilter];
		this.animateScaleWithBounceEffect();
	}

	animateScaleWithBounceEffect() {
		return gsap.to(this.sprite, {
			duration: 0.2,
			ease: 'bounce.out',
			keyframes: [
				{ pixi: { scaleX: '+=0.1', scaleY: '-=0.1' } },
				{ pixi: { scaleX: '-=0.2', scaleY: '+=0.2' } },
				{ pixi: { scaleX: '+=0.1', scaleY: '-=0.1' } },
			],
			onComplete: () => {
				this.sprite.scale.set(1);
			},
		});
	}

	filterOff() {
		this.filters = [];
		this.animateScaleWithBounceEffect();
	}

	isNeighbor(tile: Tile): boolean {
		const { row, col } = this.field!;
		const { row: neighborRow, col: neighborCol } = tile.field!;

		const isNeighborRow =
			Math.abs(row - neighborRow) === 1 && col === neighborCol;
		const isNeighborCol =
			Math.abs(col - neighborCol) === 1 && row === neighborRow;
		const isNeighborDiagonal =
			Math.abs(row - neighborRow) === 1 && Math.abs(col - neighborCol) === 1;

		return isNeighborRow || isNeighborCol || isNeighborDiagonal;
	}

	connectWithLine(tile: Tile) {
		const glowFilter = new GlowFilter({ outerStrength: 5 });
		const line = new Graphics();

		line.filters = [glowFilter];

		const { height, width, row, col } = this.field!;

		const y = ((tile.field?.row ?? 0) - row) * height;
		const x = ((tile.field?.col ?? 0) - col) * width;

		this.parent.setChildIndex(tile, this.parent.children.length - 1);

		line.lineStyle(10, this.color, 1).moveTo(0, 0).lineTo(x, y);
		this.addChild(line);
		this.setChildIndex(line, 0);
	}

	disconnectLine() {
		if (this.children.length < 2) {
			return;
		}

		this.removeChildAt(0);
	}

	remove() {
		this.particleAnimate();
		this.destroy();

		if (this.field) {
			this.field.tile = null;
			this.field = null;
		}
	}

	particleAnimate() {
		particleConfig.color.start = this.color;
		particleConfig.color.end = this.color;

		const emmiterConfig = upgradeConfig(particleConfig, [
			App.getTexture('particle'),
		]);

		this.emitter = new Emitter(this, emmiterConfig);
		this.elapsed = Date.now();
		this.emitter.emit = true;
		this.update();
	}

	private update = () => {
		this.requestId = requestAnimationFrame(this.update);
		const now = Date.now();
		const deltaTime = (now - this.elapsed) * 0.001;
		this.emitter.update(deltaTime);
		this.elapsed = now;
	};

	stopParticleAnimation() {
		if (this.emitter && this.requestId) {
			this.emitter.emit = false;
			cancelAnimationFrame(this.requestId);
		}
	}

	moveTo(
		position: { x: number; y: number },
		duration: number,
		delay = 0,
		ease: string,
	) {
		return gsap.to(this, {
			x: position.x,
			y: position.y,
			duration,
			delay,
			ease,
		});
	}

	async fallDownTo(
		position: { x: number; y: number },
		duration: number,
		delay = 0,
	) {
		this.moveTo(position, duration, delay, 'bounce.out');

		return gsap.to(this, {
			duration: 0.4,
			keyframes: [
				{ pixi: { scaleY: '-=0.2' } },
				{ pixi: { scaleX: '-=0.2', scaleY: '+=0.2' } },
				{ pixi: { scaleX: '+=0.2' } },
			],
		});
	}

	calculatePosition(container: Container): { x: number; y: number } {
		const { x: x1, y: y1 } = container.getBounds();
		const { x: x2, y: y2 } = this.sprite.getBounds();

		const x = (x1 - x2) / ScaleManager.CONTAIN;
		const y = (y1 - y2) / ScaleManager.CONTAIN;

		return { x, y };
	}

	animateToScoreIcon(index: number) {
		const score = ScoreFactory.get(this.name);

		if (!score) {
			return;
		}

		const { x, y } = this.calculatePosition(score);

		return gsap
			.timeline()
			.to(this.sprite, {
				x,
				y,
				delay: index * 0.05,
				duration: 0.5,

				onStart: () => {
					this.particleAnimate();
				},

				onComplete: () => {
					this.stopParticleAnimation();
					this.remove();
				},
			})
			.to(score.icon, {
				duration: 0.2,
				ease: 'bounce.out',
				keyframes: [{ pixi: { scale: 1.2 } }, { pixi: { scale: 1 } }],

				onStart: () => {
					score.increase();
				},
			});
	}
}

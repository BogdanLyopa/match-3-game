import { Container, Sprite, Text } from 'pixi.js';
import { App } from 'scripts/system/App';
import { TileName } from 'types';

const textStyle = {
	fontFamily: 'Arial',
	fontSize: 36,
	fill: '#ffffff',
	wordwrap: true,
};

export class Score extends Container {
	count = 0;
	text: Text;
	icon: Sprite;

	constructor(name: TileName) {
		super();
		this.name = name;

		this.text = new Text(this.count, textStyle);
		this.text.anchor.set(0.5);

		this.icon = App.sprite(name);

		this.addChild(this.icon, this.text);
	}

	increase() {
		this.count++;
		this.text.text = this.count;
	}
}

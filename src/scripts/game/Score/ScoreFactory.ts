import { Score } from './Score';
import { TileName } from 'types';

export type ScoreSettings = {
	name: TileName;
	x: number;
};

export class ScoreFactory {
	static scores: Score[] = [];

	static createScore(name: TileName, x: number): Score {
		const score = new Score(name);
		score.position.x = x;
		this.scores.push(score);
		return score;
	}

	static createScores(scoresSettings: ScoreSettings[]): Score[] {
		return scoresSettings.map(({ name, x }) => this.createScore(name, x));
	}

	static get(name: TileName): Score | undefined {
		return this.scores.find(score => score.name === name);
	}
}

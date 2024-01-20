export class Tools {
	static randomNumber(min: number, max: number = 0) {
		if (max === 0) {
			max = min;
			min = 0;
		}

		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	static massiveRequire(
		req: __WebpackModuleApi.RequireContext,
	): { key: string; data: string }[] {
		return req.keys().map((key: string) => ({
			key,
			data: req(key),
		}));
	}
}

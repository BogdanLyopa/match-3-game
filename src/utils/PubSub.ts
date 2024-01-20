export const PubSub = {
	subscribers: {},

	subscribe(eventName: string, callback: unknown) {
		if (!Array.isArray(this.subscribers[eventName])) {
			this.subscribers[eventName] = [];
		}

		this.subscribers[eventName].push(callback);
	},

	publish(eventName: string, data?: object) {
		if (!Array.isArray(this.subscribers[eventName])) return;

		this.subscribers[eventName].forEach(
			(callback: (arg: object | undefined) => void) => {
				callback(data);
			},
		);
	},

	unsubscribe(eventName: string, callback: void) {
		if (!Array.isArray(this.subscribers[eventName])) return;
		this.subscribers[eventName] = this.subscribers[eventName].filter(cb => {
			if (cb === callback) {
				return false;
			}
			return true;
		});
	},
};

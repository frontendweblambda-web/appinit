export interface AppinitEvent<T = any> {
	type: string;
	timestamp: number;
	payload: T;
}

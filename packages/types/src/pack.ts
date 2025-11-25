import { Log } from "./common";

export type PackContext = {
	log: Log;
	fs: Record<string, any>;
};

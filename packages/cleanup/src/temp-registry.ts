import { CleanupItem } from "@appinit/types";

let registry: CleanupItem[] = [];

export function registerTemp(item: CleanupItem) {
	registry.push(item);
}

export function listTemp(): CleanupItem[] {
	return [...registry];
}

export function clearTemp() {
	registry = [];
}

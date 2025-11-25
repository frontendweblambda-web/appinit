export class VirtualFileSystem {
	private store = new Map<string, string>();

	read(path: string): string | undefined {
		return this.store.get(path);
	}

	write(path: string, content: string): void {
		this.store.set(path, content);
	}

	exists(path: string): boolean {
		return this.store.has(path);
	}

	delete(path: string): void {
		this.store.delete(path);
	}

	list(): string[] {
		return Array.from(this.store.keys());
	}

	entries(): [string, string][] {
		return Array.from(this.store.entries());
	}
}

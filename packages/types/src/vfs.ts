export interface VFSFile {
	path: string;
	content: string;
}

export interface VFS {
	files: Map<string, string>;

	read(path: string): string | undefined;
	write(path: string, content: string): void;
	exists(path: string): boolean;
	delete(path: string): void;
	list(): string[];
}

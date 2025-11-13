import path from "node:path";

/** Simple in-memory virtual filesystem */
export class VFS {
	files = new Map<string, string>();

	write(filePath: string, content: string) {
		const normalized = path.posix.normalize(filePath).replaceAll("\\", "/");
		this.files.set(normalized, content);
	}

	read(filePath: string) {
		const normalized = path.posix.normalize(filePath).replaceAll("\\", "/");
		return this.files.get(normalized) ?? null;
	}

	list() {
		return Array.from(this.files.keys()).sort();
	}

	merge(other: VFS, strategy: "overwrite" | "skip" = "overwrite") {
		for (const [k, v] of other.files.entries()) {
			if (strategy === "overwrite" || !this.files.has(k)) {
				this.files.set(k, v);
			}
		}
	}
}

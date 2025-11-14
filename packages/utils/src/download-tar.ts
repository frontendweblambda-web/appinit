// packages/template-resolver/src/utils/extractTar.ts

import fs from "fs";
import path from "path";
import zlib from "zlib";
import { pipeline } from "stream/promises";

/**
 * Extract a .tgz tarball from Buffer into directory with no deps.
 */
export async function extractTarGz(
	tarGz: Buffer,
	outputDir: string,
): Promise<void> {
	await fs.promises.mkdir(outputDir, { recursive: true });

	const gunzip = zlib.createGunzip();
	const tarStream = fs.createReadStream("", { fd: undefined });

	const readable = fs.createReadStream("", { fd: undefined });
	(readable as any)._read = () => readable.emit("data", tarGz);

	await pipeline(readable, gunzip);

	const tar = gunzip; // stream of tar entries

	let buffer = Buffer.alloc(0);

	for await (const chunk of tar) {
		buffer = Buffer.concat([buffer, chunk]);
	}

	let offset = 0;

	while (offset + 512 <= buffer.length) {
		const header = buffer.slice(offset, offset + 512);
		const name = header.slice(0, 100).toString().trim();
		const sizeOctal = header.slice(124, 136).toString().trim();
		const size = parseInt(sizeOctal, 8);

		if (!name) break;

		const fileStart = offset + 512;
		const fileEnd = fileStart + size;

		const fileData = buffer.slice(fileStart, fileEnd);

		const outPath = path.join(outputDir, name);
		await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
		await fs.promises.writeFile(outPath, fileData);

		offset = fileEnd;
		offset += 512 - (size % 512 || 512);
	}
}

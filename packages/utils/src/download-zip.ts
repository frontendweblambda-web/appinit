// packages/template-resolver/src/utils/downloadZip.ts

import fs from "fs";
import path from "path";
import zlib from "zlib";
import { pipeline } from "stream/promises";

/**
 * Download a ZIP file using native fetch and return the raw buffer.
 */
export async function downloadZip(url: string): Promise<Buffer> {
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(`Failed to download ZIP: ${res.status} ${res.statusText}`);
	}

	const arrayBuffer = await res.arrayBuffer();
	return Buffer.from(arrayBuffer);
}

/**
 * Extract a ZIP buffer into a directory using no external deps.
 * Very lightweight ZIP extractor (only stores/deflate supported).
 */
export async function extractZip(buffer: Buffer, outputDir: string) {
	await fs.promises.mkdir(outputDir, { recursive: true });

	let offset = 0;

	while (offset < buffer.length) {
		// Local file header signature 0x04034b50
		if (buffer.readUInt32LE(offset) !== 0x04034b50) break;

		const compression = buffer.readUInt16LE(offset + 8);
		const fileNameLength = buffer.readUInt16LE(offset + 26);
		const extraLength = buffer.readUInt16LE(offset + 28);

		const fileName = buffer
			.slice(offset + 30, offset + 30 + fileNameLength)
			.toString();

		const fileDataStart = offset + 30 + fileNameLength + extraLength;
		const compressedSize = buffer.readUInt32LE(offset + 18);

		const compressedData = buffer.slice(
			fileDataStart,
			fileDataStart + compressedSize,
		);

		const outPath = path.join(outputDir, fileName);

		// Handle directory
		if (fileName.endsWith("/")) {
			await fs.promises.mkdir(outPath, { recursive: true });
		} else {
			await fs.promises.mkdir(path.dirname(outPath), { recursive: true });

			let fileContent: Buffer;

			if (compression === 0) {
				// stored
				fileContent = compressedData;
			} else if (compression === 8) {
				// deflate
				fileContent = zlib.inflateSync(compressedData);
			} else {
				throw new Error("Unsupported ZIP compression method: " + compression);
			}

			await fs.promises.writeFile(outPath, fileContent);
		}

		offset = fileDataStart + compressedSize;
	}

	return outputDir;
}

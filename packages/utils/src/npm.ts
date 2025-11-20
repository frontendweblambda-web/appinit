// packages/template-resolver/src/utils/templateSources/npm.ts

import { extractTarGz } from "./download-tar";

export async function downloadNpmTemplate(pkg: string, tempDir: string) {
	const metadataUrl = `https://registry.npmjs.org/${pkg}`;
	const metadata = await (await fetch(metadataUrl)).json();

	const version = metadata["dist-tags"].latest;
	const tarUrl = metadata.versions[version].dist.tarball;

	const res = await fetch(tarUrl);
	const buf = Buffer.from(await res.arrayBuffer());

	await extractTarGz(buf, tempDir);

	return { ok: true, type: "npm", tempDir };
}

// packages/utils/src/validate-path.ts
import path from "node:path";

const FORBIDDEN_CHARS = /[&|<>*?!%^"'$;{}()=@]/;
const WINDOWS_RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

export function validateProjectPath(dir: string) {
	const folderName = path.basename(dir);

	// 1. No Windows reserved names
	if (WINDOWS_RESERVED.test(folderName)) {
		return `The folder name "${folderName}" is reserved on Windows.`;
	}

	// 2. No forbidden symbols
	if (FORBIDDEN_CHARS.test(dir)) {
		return `The path contains forbidden characters: & | < > * ? ! % ^ " ' $ ; { } ( ) = @`;
	}

	// 3. Must not end with dot or space
	if (/[. ]$/.test(folderName)) {
		return `Folder name cannot end with a dot or space.`;
	}

	// 4. No spaces around slashes
	if (/\/\s|\s\//.test(dir.replace(/\\/g, "/"))) {
		return `Folder path contains invalid spacing around slashes.`;
	}

	return null; // OK
}

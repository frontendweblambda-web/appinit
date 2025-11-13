export const GITHUB_API = "https://api.github.com";

export async function githubRequest(path: string, options: any = {}) {
	const token = process.env.GITHUB_TOKEN;

	const headers = {
		"Content-Type": "application/json",
		...(token && { Authorization: `Bearer ${token}` }),
	};

	const res = await fetch(`${GITHUB_API}${path}`, {
		headers,
		...options,
	});

	if (!res.ok) {
		throw new Error(`GitHub API Error: ${res.status} ${res.statusText}`);
	}

	return res.json();
}

import { Message } from './message';

export function extractPUIDsFromResponse(res: string): string[] {
	const regexp = /[ \(\[]PUID: ?\d+[ \)\]]/g;
	const matches = res.match(regexp);
	if (matches == null) {
		return [];
	} else {
		let stringPUIDs = [...matches.map((r) => String(r))];
		stringPUIDs = [...new Set(stringPUIDs)];
		return [...stringPUIDs.sort((a, b) => PUIDToIdx(a) - PUIDToIdx(b))];
	}
}

export function PUIDToIdx(PUID: string): number {
	const regexp = /\d+/g;
	const arr = [...PUID.match(regexp)];

	if (arr.length === 0) {
		return -1;
	} else {
		const n = Number(arr[0]);
		if (n !== null) {
			return n;
		} else {
			return -1;
		}
	}
}

export function formatHistory(
	userInputs: string[],
	searchQueries: string[],
	prompts: string[],
	modelResponses: string[]
): string {
	let outputStrings: string[] = [];

	userInputs.map((userInput, idx) => {
		outputStrings.push(`# Input
${userInput}

# Search query
${searchQueries[idx]}

# Prompt
${prompts[idx]}

# System output
${modelResponses[idx]}

------------------------`);
	});

	return outputStrings.join('\n\n');
}

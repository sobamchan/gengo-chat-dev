export function extractPUIDsFromResponse(res: string): string[] {
	const regexp = /[ \(\[]PUID: ?\d+[ \)\]]/g;
	let stringPUIDs = [...res.match(regexp).map((r) => String(r))];
	stringPUIDs = [...new Set(stringPUIDs)];
	return [...stringPUIDs.sort((a, b) => PUIDToIdx(a) - PUIDToIdx(b))];
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

import type { ModelType } from './llm';

export async function fromInputToQuery(input: string, modelType: ModelType) {
	const prompt = `
Convert the following text to a non-question plain natural language query without symbols suitable for semantic search. Do not drop technical terms. Generate only the query, nothing else.
Text: ${input}`;
	const res = await fetch('/apis/chat/both', {
		method: 'POST',
		body: JSON.stringify({ message: prompt, modelType: modelType }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const json = await res.json();
	return json['content'];
}

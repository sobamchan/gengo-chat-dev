import type { ModelType } from './llm';
import type { Message } from './message';

export async function fromInputToQuery(input: string, modelType: ModelType, modelID: string) {
	const prompt = `
Convert the following text to a non-question plain natural language query without symbols suitable for semantic search. Do not drop technical terms. Generate only the query, nothing else.
Text: ${input}`;
	const res = await fetch('/apis/chat/both', {
		method: 'POST',
		body: JSON.stringify({ message: prompt, modelType: modelType, modelID: modelID }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const json = await res.json();
	return json['content'];
}

export async function fromInputAndHistoryToQuery(
	messages: Message[],
	input: string,
	modelType: ModelType,
	modelID: string
) {
	const prompt = `Rewrite the 'query' suitable to plain text in netural language for semnatic search engine while the previous conversation, 'previous_query' and 'previous_output', into account. The new query should be able to retrieval documents that deepens the previous interaction. Generate the resulting query only, nothing else.
query: ${input}
previous_query: ${messages[messages.length - 2].content}
previous_output: ${messages[messages.length - 1].content}`;
	const res = await fetch('/apis/chat/both', {
		method: 'POST',
		body: JSON.stringify({ message: prompt, modelType: modelType, modelID: modelID }),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const json = await res.json();
	return json['content'];
}

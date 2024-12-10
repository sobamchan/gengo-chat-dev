import { ChatOllama } from '@langchain/ollama';
import { json } from '@sveltejs/kit';
import { REPLICATE_API_TOKEN } from '$env/static/private';
import Replicate from 'replicate';
import { ModelType } from '$lib/llm';

export const _generate = async (
	message: string,
	modelType: ModelType,
	modelID: string | null = null
): string => {
	if (modelID === null) {
		if (modelType === ModelType.ollama) {
			modelID = 'gemma2:2b';
		} else {
			modelID = 'meta/meta-llama-3-8b-instruct';
		}
	}

	console.log(modelType);
	console.log(modelID);

	let responseStr = '';
	if (modelType === ModelType.ollama) {
		const ollama = new ChatOllama({
			model: modelID,
			temperature: 0,
			maxRetries: 0
		});
		const response = await ollama.invoke([['user', message]]);
		responseStr = response.content;
	} else if (modelType === ModelType.replicate) {
		const replicate = new Replicate({
			auth: REPLICATE_API_TOKEN
		});
		const input = {
			top_k: 0,
			top_p: 0.95,
			prompt: message,
			max_tokens: 512,
			temperature: 1.0,
			system_prompt: 'You are a helpful assistant',
			length_penalty: 1,
			max_new_tokens: 512,
			stop_sequences: '<|end_of_text|>,<|eot_id|>',
			prompt_template:
				'<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n',
			presence_penalty: 0,
			log_performance_metrics: false
		};
		const response = await replicate.run(modelID, { input });
		responseStr = response.join('');
	}
	return responseStr;
};

export async function POST({ request }) {
	const j = await request.json();
	const message: string = j['message'];

	let _modelType: string = j['modelType'];
	if (_modelType === null) {
		_modelType = 'replicate';
	}
	const modelType = ModelType[_modelType];

	const out = await _generate(message, modelType);
	return json({ content: out }, { status: 201 });
}

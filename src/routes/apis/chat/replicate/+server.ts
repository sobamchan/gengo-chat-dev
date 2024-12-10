import { json } from '@sveltejs/kit';
import { REPLICATE_API_TOKEN } from '$env/dynamic/private';
import Replicate from 'replicate';

const replicate = new Replicate({
	auth: REPLICATE_API_TOKEN
});

export async function POST({ request }) {
	const j = await request.json();
	const message: string = j['message'];

	const input = {
		top_k: 0,
		top_p: 0.95,
		prompt: message,
		max_tokens: 512,
		temperature: 0.7,
		system_prompt: 'You are a helpful assistant',
		length_penalty: 1,
		max_new_tokens: 512,
		stop_sequences: '<|end_of_text|>,<|eot_id|>',
		prompt_template:
			'<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n',
		presence_penalty: 0,
		log_performance_metrics: false
	};

	const output = await replicate.run('meta/meta-llama-3-8b-instruct', { input });
	return json({ content: output.join('') }, { status: 201 });
}

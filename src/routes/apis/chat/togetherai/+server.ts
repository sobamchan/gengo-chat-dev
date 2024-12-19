import { json } from '@sveltejs/kit';
import { TOGETHERAI_API_TOKEN } from '$env/static/private';
import Replicate from 'replicate';

import Together from 'together-ai';
const together = new Together({ apiKey: TOGETHERAI_API_TOKEN });

export async function POST({ request }) {
	const j = await request.json();
	const message: string = j['message'];

	const response = await together.chat.completions.create({
		model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
		messages: [{ role: 'user', content: message }]
	});

	const output: string = response.choices[0].message.content;

	return json({ content: output }, { status: 201 });
}

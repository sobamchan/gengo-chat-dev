import { json } from '@sveltejs/kit';
import { ChatOllama } from '@langchain/ollama';

const llm = new ChatOllama({
	model: 'gemma2:2b',
	temperature: 0,
	maxRetries: 0
});

export async function POST({ request }) {
	const j = await request.json();
	const message: string = j['message'];
	const reponse = await llm.invoke([['user', message]]);
	return json({ content: reponse.content }, { status: 201 });
}

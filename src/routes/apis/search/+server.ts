import { json } from '@sveltejs/kit';
import { QdrantClient } from '@qdrant/js-client-rest';
import { QDRANT_KEY, QDRANT_URL, QDRANT_COLLECTION_NAME } from '$env/static/private';

const client = new QdrantClient({
	url: QDRANT_URL,
	apiKey: QDRANT_KEY
});

export async function POST({ request }) {
	const j = await request.json();
	const vector: number[] = j['vector'];
	const limit: number = Number(j['limit']);

	const searchedPapers = await client.search(QDRANT_COLLECTION_NAME, {
		vector: { name: 'overview', vector },
		limit,
		with_vector: false,
		with_payload: { exclude: ['fulltext'] }
	});

	return json({ searchedPapers }, { status: 201 });
}

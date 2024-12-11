<script lang="ts">
	import { page } from '$app/stores';
	import { QdrantClient } from '@qdrant/js-client-rest';
	import { pipeline } from '@xenova/transformers';
	import { Paper, PaperList } from '$lib/paper';
	import { fromInputToQuery } from '$lib/QueryGenerator';
	import { default as UserPost } from '$lib/components/UserPost.svelte';
	import { default as SystemPost } from '$lib/components/SystemPost.svelte';
	import { default as PaperComponent } from '$lib/components/Paper.svelte';
	import { Message } from '$lib/message';
	import { extractPUIDsFromResponse } from '$lib/utils';
	import { getDefaultPrompter } from '$lib/prompter';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	import { onMount } from 'svelte';
	import { ModelType } from '$lib/llm';

	let selectedModel = ModelType.replicate;
	let documentNumber = 15;
	onMount(async () => {
		let _currentSelectedModel = localStorage.getItem('modelType');
		if (_currentSelectedModel === null) {
			_currentSelectedModel === 'replicate';
		}
		selectedModel = ModelType[_currentSelectedModel];

		let _currentDocumentNumber = localStorage.getItem('documentNumber');
		if (_currentDocumentNumber !== null) {
			documentNumber = Number(_currentDocumentNumber);
		}
	});

	let currentMessage = 'Give me an overview of use of LLMs for evaluating summaries.';

	let messages: Message[] = [];

	let papers = new PaperList([]);

	let isGenerating = false;

	const prompter = getDefaultPrompter();

	async function getPapersByQuery(query: string) {
		const extractor = await pipeline('feature-extraction', 'Snowflake/snowflake-arctic-embed-s');
		const output = await extractor(
			'Represent this sentence for searching relevant passages:  +  ' + query,
			{ pooling: 'cls', normalize: false }
		);
		const vector = output.tolist()[0];
		const searchedPapersResponse = await fetch('/apis/search', {
			method: 'POST',
			body: JSON.stringify({ vector: vector, limit: documentNumber }),
			headers: { 'Content-Type': 'application/json' }
		});
		const searchedPapersJson = await searchedPapersResponse.json();
		const searchedPapers = searchedPapersJson['searchedPapers'];
		const paperList = new PaperList(searchedPapers.map((p) => new Paper(p)));
		return paperList;
	}

	async function chatSubmitHandler() {
		if (currentMessage !== '') {
			isGenerating = true;
			messages = [...messages, new Message(false, currentMessage)];
			const messageToSend = currentMessage;
			currentMessage = '';

			const searchQuery = await fromInputToQuery(messageToSend, selectedModel);
			console.log(searchQuery);
			await getPapersByQuery(searchQuery).then((paperList) => {
				const prompt = prompter.generate(paperList, messageToSend);
				console.log(prompt);

				fetch('/apis/chat/both', {
					method: 'POST',
					body: JSON.stringify({ message: prompt, modelType: selectedModel }),
					headers: { 'Content-Type': 'application/json' }
				}).then(async (r) => {
					const j = await r.json();
					let res = j['content'];
					const mentionedPUIDs = extractPUIDsFromResponse(res);
					let filteredPapers = paperList.filterByPUIDs(mentionedPUIDs);

					// Build PUID to Index dict
					const PUID2Index = Object.assign(
						{},
						...mentionedPUIDs.map((puid, i) => ({ [puid]: papers.papers.length + 1 + i }))
					);
					// replace PUIDs in res to Indexs
					Object.keys(PUID2Index).forEach((puid) => {
						res = res.replaceAll(
							puid,
							`<a href="#pp-${PUID2Index[puid]}">[${PUID2Index[puid]}]</a>`
						);
					});
					papers = papers.addPapers(filteredPapers.papers);
					messages = [...messages, new Message(true, res)];
					isGenerating = false;
				});
			});
		}
	}

	let highlightPaperIndex = 0;
	let selectedPaper = null;
	let isHiddenModal = true;
	const handleFetch = () => {
		if ($page.url.hash.includes('#pp-')) {
			highlightPaperIndex = Number($page.url.hash.replace('#pp-', ''));
			selectedPaper = papers.papers[highlightPaperIndex - 1];
			isHiddenModal = false;
			goto('/', { replaceState: false });
		}
	};
	const handleCloseModal = () => {
		isHiddenModal = true;
		goto('/', { replaceState: false });
	};
	$: handleFetch($page.url.search);
</script>

<div class="h-full">
	<div class="h-full px-4 md:px-48">
		<div class="grid grid-row-[1fr_3fr_auto] gap-1">
			<!-- Papers -->
			<!-- {#if papers.papers.length > 0}
				<div class="h-80 w-full overflow-x-scroll">
					{#each papers.papers as pap}
						<PaperComponent isHilighted={pap.index === highlightPaperIndex} paper={pap} />
					{/each}
				</div>
			{/if} -->

			{#if selectedPaper != null}
				<div
					id="default-modal"
					tabindex="-1"
					aria-hidden="true"
					class:hidden={isHiddenModal}
					class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:px-48 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
				>
					<div class="relative p-4 w-full max-h-full">
						<div class="flex items-center justify-between p-4 md:p-5">
							<div class="p-4 md:p-5 space-y-4 bg-surface-300 rounded-md">
								<PaperComponent isHilighted={false} paper={selectedPaper} />
								<button on:click={handleCloseModal} class="btn btn-sm variant-ghost float-right">
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Messages -->
			<div class="overflow-y-auto">
				{#each messages as msg}
					<div class="text-left p-2">
						{#if msg.isSystem}
							<SystemPost {msg} />
						{:else}
							<UserPost {msg} />
						{/if}
					</div>
				{/each}
			</div>

			<!-- Form -->
			{#if isGenerating === true}
				<div class="p-4">
					<Icon icon="eos-icons:bubble-loading" height="32" class="inline" />
				</div>
			{/if}
			<form
				class="w-full input-group input-group-divider grid-cols-[1fr_auto] rounded-container-token"
			>
				<input
					type="text"
					bind:value={currentMessage}
					class="bg-transparent border-0 ring-0 text-sm"
					name="prompt"
					id="prompt"
					placeholder="Write a message..."
					disabled={isGenerating}
				/>
				<button
					class="variant-filled-primary text-xs"
					on:click={chatSubmitHandler}
					disabled={isGenerating}
					type="submit"
				>
					Send
				</button>
			</form>
			<!-- <div class="">
				<div
					class="w-full input-group input-group-divider grid-cols-[1fr_auto] rounded-container-token"
				>
					<textarea
						bind:value={currentMessage}
						class="bg-transparent border-0 ring-0 text-sm"
						name="prompt"
						id="prompt"
						placeholder="Write a message..."
						rows="1"
					/>
					<button
						class="variant-filled-primary text-xs"
						on:click={chatSubmitHandler}
						disabled={isGenerating}
					>
						Send
					</button>
				</div>
			</div> -->
		</div>
	</div>
</div>

<style lang="postcss">
</style>

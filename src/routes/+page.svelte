<script lang="ts">
	import { page } from '$app/stores';
	import { pipeline } from '@xenova/transformers';
	import { Paper, PaperList } from '$lib/paper';
	import { fromInputToQuery } from '$lib/QueryGenerator';
	import { default as UserPost } from '$lib/components/UserPost.svelte';
	import { default as SystemPost } from '$lib/components/SystemPost.svelte';
	import { default as PaperComponent } from '$lib/components/Paper.svelte';
	import { Message } from '$lib/message';
	import { extractPUIDsFromResponse, formatHistory, parseURLParamsToFilters } from '$lib/utils';
	import { getDefaultPrompter } from '$lib/prompter';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	import { onMount } from 'svelte';
	import { ModelType } from '$lib/llm';

	let selectedModel = ModelType.togetherai;
	let documentNumber = 10;
	let modelID = 'meta-llama/Llama-3.3-70B-Instruct-Turbo';
	onMount(async () => {
		let _currentSelectedModel = localStorage.getItem('modelType') || 'togetherai';
		if (_currentSelectedModel === null) {
			_currentSelectedModel === 'togetherai';
		}
		selectedModel = ModelType[_currentSelectedModel];

		let currentModelID = localStorage.getItem('modelID');
		if (currentModelID !== null) {
			modelID = currentModelID;
			console.log(modelID);
		}

		let _currentDocumentNumber = localStorage.getItem('documentNumber');
		if (_currentDocumentNumber !== null) {
			documentNumber = Number(_currentDocumentNumber);
		}
	});

	let queryFormInput;
	let currentMessage = '';

	const exampleQueries = [
		'Give me an overview of use of LLMs for evaluating summaries.',
		'What is ROUGE-K?',
		'What is Generative Retrieval?',
		'List limitations of ROUGE evaluation metric.'
	];
	const handleExampleClick = (event) => {
		currentMessage = event.target.innerText;
		chatSubmitHandler();
	};

	// extract parameters from the current URL
	const filters = parseURLParamsToFilters($page.url);

	let messages: Message[] = [];
	let searchQueries: string[] = [];
	let prompts: string[] = [];
	let userInputs: string[] = [];
	let modelResponses: string[] = [];

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
			body: JSON.stringify({ vector: vector, limit: documentNumber, filters }),
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

			let searchQuery = await fromInputToQuery(messages, messageToSend, selectedModel, modelID);

			userInputs.push(messageToSend);

			console.log(searchQuery);
			searchQueries.push(searchQuery);
			getPapersByQuery(searchQuery).then((paperList) => {
				const prompt = prompter.generate(paperList, messageToSend);
				console.log(prompt);
				prompts.push(prompt);

				fetch('/apis/chat/both', {
					method: 'POST',
					body: JSON.stringify({
						message: prompt,
						modelType: selectedModel,
						modelID: modelID
					}),
					headers: { 'Content-Type': 'application/json' }
				}).then(async (r) => {
					const j = await r.json();
					let res = j['content'];
					modelResponses.push(res);
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

	function onKeyDown(e) {
		switch (e.keyCode) {
			case 75:
				if (e.metaKey) {
					e.preventDefault();
					queryFormInput.focus();
				}
				break;
			case 27:
				queryFormInput.blur();
				break;
		}
	}

	function handleShowHistoryClick() {
		const content = formatHistory(userInputs, searchQueries, prompts, modelResponses);
		const blob = new Blob([content], { type: 'text/plain' });
		let pom = document.createElement('a');
		const url = URL.createObjectURL(blob);
		pom.href = url;
		pom.setAttribute('download', 'history.txt');
		pom.click();
	}
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="h-full">
	<div class="h-full px-4 lg:px-48">
		<!-- ALERT -->
		<div class="alert variant-filled-warning my-4">
			<div class="alert-message">
				<p>
					GENGO-Chat is under a heavy development. Many things are not functioning at the moment.
					Please do not execute queries too much. It will stop the core LLM functionality.
				</p>
			</div>
		</div>

		<!-- MAIN STUFF -->
		<div class="grid grid-row-[1fr_3fr_auto] gap-1">
			{#if selectedPaper != null}
				<div
					id="default-modal"
					tabindex="-1"
					aria-hidden="true"
					class:hidden={isHiddenModal}
					class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 lg:px-48 justify-center items-center w-full lg:inset-0 h-[calc(100%-1rem)] max-h-full"
				>
					<div class="relative p-4 w-full max-h-full">
						<div class="flex items-center justify-between p-4 lg:p-5">
							<div class="p-4 lg:p-5 space-y-4 bg-surface-300 rounded-md">
								<PaperComponent isHilighted={false} paper={selectedPaper} />
								<button on:click={handleCloseModal} class="btn btn-sm variant-ghost float-right">
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			{/if}

			{#if filters.must.length !== 0}
				<div class="alert variant-filled-secondary my-4">
					<a href="/" target="_self" class="btn-icon px-2 py-0">
						<Icon icon="material-symbols:cancel-outline-rounded" height="32" class="inline" />
					</a>
					<div>
						<p class="inline">
							Applied filters: {filters.must.map((f) => f.key + ': ' + f.match.value).join(', ')}
						</p>
					</div>
				</div>
			{/if}

			<!-- Messages -->
			<div class="overflow-y-auto">
				{#each messages as msg}
					<div class="text-left p-2">
						{#if msg.isSystem}
							<SystemPost {msg} {papers} />
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
				class="w-full input-group input-group-divider grid-cols-[1fr_auto] rounded-container-token my-8"
			>
				<input
					type="text"
					bind:value={currentMessage}
					class="bg-transparent border-0 ring-0 text-sm font-light"
					name="prompt"
					id="prompt"
					placeholder="Enter a query...(⌘ + k)"
					disabled={isGenerating}
					bind:this={queryFormInput}
				/>
				<button
					class="variant-filled-primary text-sm font-light"
					on:click={chatSubmitHandler}
					disabled={isGenerating}
					type="submit"
				>
					Send
				</button>
			</form>

			{#if messages.length !== 0 && !isGenerating}
				<button
					on:click={handleShowHistoryClick}
					class="btn variant-ghost w-44 py-1 place-self-end text-xs font-extralight"
					>Download Chat History</button
				>
			{/if}

			{#if messages.length === 0}
				<div class="m-2 mx-2 lg:mx-32">
					<div class="text-sm font-light">Example Queries</div>
					<div class="grid grid-cols-1 xl:grid-cols-2">
						{#each exampleQueries as exampleQuery}
							<button
								class="bg-surface-500 rounded-sm font-light m-1 py-1 px-2 truncate hover:bg-surface-400"
								on:click={handleExampleClick}
							>
								{exampleQuery}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		{#if papers.papers.length !== 0}
			<div class="my-8">
				<Accordion>
					<AccordionItem close>
						<svelte:fragment slot="summary">References</svelte:fragment>
						<svelte:fragment slot="content">
							{#each papers.papers as p}
								<PaperComponent paper={p} />
							{/each}
						</svelte:fragment>
					</AccordionItem>
				</Accordion>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
</style>

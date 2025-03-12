<script>
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let documentNumber = 10;
	let maxDocumentNumber = 15;

	const modelOptions = [
		'meta-llama/Llama-3.3-70B-Instruct-Turbo',
		'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K',
		'mistralai/Mistral-7B-Instruct-v0.3',
		'mistralai/Mixtral-8x7B-Instruct-v0.1',
		'mistralai/Mixtral-8x7B-Instruct-v0.1',
		'mistralai/Mistral-Small-24B-Instruct-2501',
		'mistralai/Mixtral-8x22B-Instruct-v0.1'
	];
	let modelName = modelOptions[0];

	onMount(() => {
		const currentDocumentNumber = localStorage.getItem('documentNumber');
		if (currentDocumentNumber !== null) {
			documentNumber = Number(currentDocumentNumber);
		}

		const currentModelName = localStorage.getItem('modelID');
		if (currentModelName !== null) {
			modelName = currentModelName;
		}
	});
	const updateSetting = () => {
		localStorage.setItem('documentNumber', documentNumber);
		localStorage.setItem('modelID', modelName);
	};
</script>

<div class="p-4 my-8 mx-16">
	<div class="pt-4">
		<form class="max-w-md">
			<label for="modelOption">Model Name</label>
			<select
				id="modelOption"
				class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
				bind:value={modelName}
				on:change={updateSetting}
			>
				{#each modelOptions as modelOption}
					{#if modelOption === modelName}
						<option value={modelOption} selected>{modelOption}</option>
					{:else}
						<option value={modelOption}>{modelOption}</option>
					{/if}
				{/each}
			</select>
		</form>
	</div>
	<div class="w-48 pt-4 mt-8">
		<RangeSlider
			name="range-slider"
			bind:value={documentNumber}
			max={maxDocumentNumber}
			step={1}
			ticked
			on:change={updateSetting}
		>
			<div class="flex justify-between items-center">
				<div class="text-xs">Number of documents to retrieve</div>
				<div class="text-xs">{documentNumber} / {maxDocumentNumber}</div>
			</div>
		</RangeSlider>
	</div>
</div>

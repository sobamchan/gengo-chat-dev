<script>
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	const modelOptions = ['ollama', 'replicate', 'togetherai'];
	let selectedModel = modelOptions[2];

	let documentNumber = 10;
	let max = 30;

	let modelName = 'meta-llama/Llama-3.3-70B-Instruct-Turbo';

	onMount(() => {
		const currentSelectedModel = localStorage.getItem('modelType');
		if (currentSelectedModel !== null) {
			selectedModel = currentSelectedModel;
		}

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
		localStorage.setItem('modelType', selectedModel);
		localStorage.setItem('documentNumber', documentNumber);
		localStorage.setItem('modelID', modelName);
	};
</script>

<div class="p-4">
	{#each modelOptions as modelOption}
		<label>
			<input
				type="radio"
				name="model"
				value={modelOption}
				bind:group={selectedModel}
				on:change={updateSetting}
			/>
			{modelOption}
		</label>
	{/each}

	<div class="w-48 pt-4">
		<RangeSlider
			name="range-slider"
			bind:value={documentNumber}
			max={25}
			step={1}
			ticked
			on:change={updateSetting}
		>
			<div class="flex justify-between items-center">
				<div class="text-xs">Number of documents to retrieve</div>
				<div class="text-xs">{documentNumber} / {max}</div>
			</div>
		</RangeSlider>
	</div>

	<div class="pt-4">
		Model Name
		<input
			type="text"
			id="default-input"
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			bind:value={modelName}
			on:change={updateSetting}
		/>
	</div>
</div>

<script>
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let documentNumber = 20;
	let maxDocumentNumber = 25;

	const modelOptions = [
		'google/gemma-4-31B-it',
		'Qwen/Qwen3.5-397B-A17B',
		'openai/gpt-oss-120b',
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

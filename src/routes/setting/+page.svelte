<script>
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	const modelOptions = ['ollama', 'replicate'];
	let selectedModel = modelOptions[1];

	let documentNumber = 8;
	let max = 30;

	onMount(() => {
		const currentSelectedModel = localStorage.getItem('modelType');
		if (currentSelectedModel !== null) {
			selectedModel = currentSelectedModel;
		}

		const currentDocumentNumber = localStorage.getItem('documentNumber');
		if (currentDocumentNumber !== null) {
			documentNumber = Number(currentDocumentNumber);
		}
	});
	const updateSetting = () => {
		localStorage.setItem('modelType', selectedModel);
		localStorage.setItem('documentNumber', documentNumber);
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
</div>

<script lang="ts">
	import { Paper } from '$lib/paper';
	import Icon from '@iconify/svelte';
	import { popup } from '@skeletonlabs/skeleton';

	export let paper: Paper;
	export let isHilighted: boolean = false;
</script>

<!-- <div id="pp-{paper.index}" class="block border rounded-md my-2 p-2 shadow-sm bg-surface-200 dark:bg-surface-700 text-sm text-left"> -->
<div
	id="pp-{paper.index}"
	class="block border rounded-md my-2 p-2 shadow-sm {isHilighted
		? 'bg-red-500'
		: 'dark:bg-surface-700'} text-sm text-left"
>
	<span class="fond-bold text-sm text-left">[{paper.index}]</span>
	<a
		rel="external"
		href="https://gengo.sotaro.io/{paper.url}"
		target="_blank"
		class="underline font-bold hover:bg-secondary-500/50 text-sm text-left">{paper.paperTitle}</a
	>
	<a
		rel="external"
		href="https://gengo.sotaro.io/volumes/{paper.volumeId}"
		target="_blank"
		class="underline hover:bg-secondary-500/50 text-sm ml-1">({paper.volumeId})</a
	>
	{#if paper.url}
		<a
			href="https://aclanthology.org/{paper.url}.pdf"
			target="_blank"
			class="content-center underline hover:bg-secondary-500/50"
		>
			<Icon icon="mingcute:pdf-fill" class="inline" />
		</a>
	{/if}

	<div class="italic text-sm mt-1 text-left">
		{#each paper.authors as author, i}
			<a
				rel="external"
				href="https://gengo.sotaro.io/author/{author.first}_{author.last}"
				target="_blank"
				class="underline hover:bg-secondary-500/50"
			>
				{author.first}
				{author.last}{i < paper.authors.length - 1 ? `, ` : ''}
			</a>
		{/each}
	</div>
	<div class="mt-1 text-left">
		{#each paper.fieldOfStudies as fos}
			<a
				rel="external"
				href="https://gengo.sotaro.io/fos/{fos}"
				target="_blank"
				class="text-xs p-0.5 rounded-sm bg-tertiary-300 dark:bg-tertiary-900">{fos}</a
			>
		{/each}
	</div>
	<table class="mt-1 border-separate border-spacing-x-0 border-spacing-y-1 text-sm w-full">
		<tbody>
			<tr class="bg-surface-300 dark:bg-surface-700/50 shadow-md">
				<td class="align-text-top">
					<span class="font-semibold rounded-sm italic mx-1">Challenge: </span>
				</td>
				<td class="px-2 text-left text-sm">
					{paper.summaries.challenge}
				</td>
			</tr>
			<tr class="bg-surface-300 dark:bg-surface-700/50 shadow-md">
				<td class="align-text-top">
					<span class="font-semibold rounded-sm italic mx-1">Approach: </span>
				</td>
				<td class="px-2 text-left">
					{paper.summaries.approach}
				</td>
			</tr>
			<tr class="bg-surface-300 dark:bg-surface-700/50 shadow-md">
				<td class="align-text-top">
					<span class="font-semibold rounded-sm italic mx-1">Outcome: </span>
				</td>
				<td class="px-2 text-left">
					{paper.summaries.outcome}
				</td>
			</tr>
		</tbody>
	</table>
</div>

<script>
	import { marked } from 'marked';
	import Icon from '@iconify/svelte';

	export let msg;
	export let papers;

	const handleCopyClick = () => {
		// TODO: replace a tag in msg with markdown link to paper in papers
		const aTagRegexp = /<a.+a>/g;
		const matches = msg.content.match(aTagRegexp);
		const uniqueMatches = [...new Set(matches)];
		let content = msg.content;
		uniqueMatches.map((match) => {
			let regexp = /\[(\d+)\]/;
			let targetPaper = papers.papers[match.match(regexp)[1] - 1];
			content = content.replaceAll(
				match,
				` ([${targetPaper.paperTitle}](https://gengo.sotaro.io/${targetPaper.url}))`
			);
		});
		navigator.clipboard.writeText(content);
	};
</script>

<div class="border-solid border-2 my-4 rounded-md">
	<div class="m-4">
		<div>
			<span class="badge variant-filled-surface mb-2 text-sm"> System </span>

			<button class="float-right btn-icon variant-ghost" on:click={handleCopyClick}>
				<Icon icon="mynaui:copy" class="inline" />
			</button>
		</div>

		<div
			class="
            p-4
            prose
            prose-sm
            max-w-none
            w-full
            text-white
            prose-p:text-white
            prose-p:w-full
            prose-strong:text-white
            prose-strong:font-semibold
            prose-h1:text-white
            prose-h2:text-white
            prose-h3:text-white
            prose-h4:text-white
            prose-li:text-white
            prose-a:text-white
            "
		>
			{@html marked(msg.content, { sanitize: false })}
		</div>
	</div>
</div>

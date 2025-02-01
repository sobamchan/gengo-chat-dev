<script>
	import { marked } from 'marked';
	import Icon from '@iconify/svelte';

	export let msg;
</script>

<div class="border-solid border-2 rounded-md">
	<div class="m-4">
		<div>
			<span class="badge variant-filled-surface mb-2 text-sm"> You </span>

			<!-- <button class="float-right">
				<Icon icon="mynaui:copy" class="inline" />
			</button> -->
		</div>

		<div
			class="
            p-4
            prose
            prose-sm
            max-w-none
            w-full
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
			{@html marked.parse(msg.content)}
		</div>
	</div>
</div>

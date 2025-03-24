<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<!-- App Shell -->
<!-- <AppShell class="h-[80%]">
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">gengo-chat</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				hoge
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell> -->
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl italic"><a href="/">GenGO Ultra</a></strong>
			</svelte:fragment>
			<!-- <svelte:fragment slot="trail"><a href="/setting">Setting</a></svelte:fragment> -->
			<svelte:fragment slot="trail">
				<a href="/setting">Setting</a>
				<a href="/about">About</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter">
		<div class="mx-auto p-2 md:px-40 md:py-4 bg-surface-100 dark:bg-surface-800">
			<div class="grid grid-cols-1 md:grid-cols-4">
				<div class="col-start-1 col-span-1 pb-4 md:pb-2">
					<p class="font-semibold text-sm pb-1">What is <span class="italic">GenGO Ultra</span>?</p>
					<p class="text-xs">
						<span class="italic">GenGO Ultra</span> is a RAG system which combines NLP paper database
						with an LLM to support NLP researchers and practitioners.
					</p>
				</div>
				<div class="col-span-1 gap-10">
					<p class="font-semibold text-sm pb-1">Information</p>
					<a rel="external" href="/about" class="underline text-xs hover:bg-secondary-500/50"
						>About</a
					> <br />
					<a
						rel="external"
						target="_blank"
						href="https://gengo.sotaro.io"
						class="underline text-xs italic hover:bg-secondary-500/50">GenGO</a
					>
				</div>
			</div>
		</div>
	</svelte:fragment>
</AppShell>

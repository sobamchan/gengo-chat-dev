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
				<strong class="text-xl uppercase"><a href="/">gengo-chat</a></strong>
			</svelte:fragment>
			<!-- <svelte:fragment slot="trail"><a href="/setting">Setting</a></svelte:fragment> -->
			<svelte:fragment slot="trail"><a href="/about">About</a></svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>

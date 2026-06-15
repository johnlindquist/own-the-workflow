<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import logomark from '$lib/assets/brand/logomark-skeuo.png';
	import githubQr from '$lib/assets/links/own-the-workflow-github-qr.svg';
	import eggoAgentFirst from '$lib/assets/eggos/selecting-tools-ai-age-v2/08-agent-first-five.png';
	import eggoAskRepo from '$lib/assets/eggos/selecting-tools-ai-age-v2/07-ask-the-repo.png';
	import eggoCliHandles from '$lib/assets/eggos/selecting-tools-ai-age-v2/09-cli-handles.png';
	import eggoClose from '$lib/assets/eggos/selecting-tools-ai-age-v2/11-close.png';
	import eggoCmux from '$lib/assets/eggos/selecting-tools-ai-age-v2/10-cmux-control-surface.png';
	import eggoLeads from '$lib/assets/eggos/selecting-tools-ai-age-v2/04-leads-not-proof.png';
	import eggoScreendrop from '$lib/assets/eggos/selecting-tools-ai-age-v2/05-candidate-not-replacement.png';
	import eggoSearch from '$lib/assets/eggos/selecting-tools-ai-age-v2/03-search-before-build.png';
	import eggoSlice from '$lib/assets/eggos/selecting-tools-ai-age-v2/02-slice-over-list.png';
	import eggoThaw from '$lib/assets/eggos/selecting-tools-ai-age-v2/06-thaw-caveat.png';
	import eggoTitle from '$lib/assets/eggos/selecting-tools-ai-age-v2/01-title.png';
	import type { ToolSlide } from './types';

	type CommandToken = {
		kind: 'command' | 'flag' | 'operator' | 'string' | 'path' | 'text';
		text: string;
	};

	let { slides }: { slides: ToolSlide[] } = $props();

	let index = $state(0);
	const total = $derived(slides.length);
	const current = $derived(slides[index] ?? slides[0]);
	const presenting = $derived(page.url.searchParams.get('present') === '1');
	const progress = $derived(total > 0 ? ((index + 1) / total) * 100 : 0);
	const eggoBySlide: Record<string, string> = {
		title: eggoTitle,
		'slice-over-list': eggoSlice,
		'search-before-build': eggoSearch,
		'leads-not-proof': eggoLeads,
		'candidate-not-replacement': eggoScreendrop,
		'thaw-caveat': eggoThaw,
		'ask-the-repo': eggoAskRepo,
		'agent-first-five': eggoAgentFirst,
		'cli-handles': eggoCliHandles,
		'cmux-control-surface': eggoCmux,
		close: eggoClose,
		resources: eggoClose
	};

	const clamp = (next: number) => Math.max(0, Math.min(total - 1, next));

	const go = (next: number) => {
		index = clamp(next);
		const slide = slides[index];
		if (slide && typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.hash = slide.id;
			window.history.replaceState(null, '', url);
		}
	};

	const findSlideIndex = (id: string | null) => {
		if (!id) return -1;
		return slides.findIndex((slide) => slide.id === id);
	};

	const tokenizeCommand = (command: string): CommandToken[] =>
		command.match(/"[^"]*"|&&|\|\||\||--?[a-zA-Z0-9-]+|[^\s]+|\s+/g)?.map((text, tokenIndex) => {
			if (/^\s+$/.test(text)) return { kind: 'text', text };
			if (tokenIndex === 0) return { kind: 'command', text };
			if (/^--?/.test(text)) return { kind: 'flag', text };
			if (/^"[^"]*"$/.test(text)) return { kind: 'string', text };
			if (/^&&$|^\|$|^\|\|$/.test(text)) return { kind: 'operator', text };
			if (text.includes('/')) return { kind: 'path', text };
			return { kind: 'text', text };
		}) ?? [];

	const toggleFullscreen = async () => {
		if (!document.fullscreenElement) {
			await document.documentElement.requestFullscreen?.();
			return;
		}
		await document.exitFullscreen?.();
	};

	onMount(() => {
		const applyRequestedSlide = () => {
			const url = new URL(window.location.href);
			const requested = url.searchParams.get('slide') ?? window.location.hash.slice(1);
			const requestedIndex = findSlideIndex(requested);
			if (requestedIndex >= 0) index = requestedIndex;
		};

		applyRequestedSlide();

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowRight' || event.key === ' ') {
				event.preventDefault();
				go(index + 1);
			}
			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				go(index - 1);
			}
			if (event.key === 'Home') {
				event.preventDefault();
				go(0);
			}
			if (event.key === 'End') {
				event.preventDefault();
				go(total - 1);
			}
			if (event.key.toLowerCase() === 'f') {
				event.preventDefault();
				void toggleFullscreen();
			}
		};

		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('hashchange', applyRequestedSlide);
		window.addEventListener('popstate', applyRequestedSlide);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('hashchange', applyRequestedSlide);
			window.removeEventListener('popstate', applyRequestedSlide);
		};
	});
</script>

<svelte:head>
	<title>Selecting Tools in the AI Age | egghead</title>
</svelte:head>

<main class="tools-deck" class:presenting data-shift="day">
	{#if !presenting}
		<nav class="deck-nav" aria-label="Slide navigation">
			<a class="nav-key" href="/slides">all variations</a>
			<div class="nav-dots" aria-label="Slide picker">
				{#each slides as slide, slideIndex (slide.id)}
					<button
						type="button"
						class:active={slideIndex === index}
						aria-label={`Open ${slide.title}`}
						onclick={() => go(slideIndex)}
					>
						{slideIndex + 1}
					</button>
				{/each}
			</div>
			<a class="nav-key yolk" href="/slides/selecting-tools-ai-age?present=1#title">present</a>
		</nav>
	{/if}

	<section class="stage" aria-live="polite">
		<article class="slide kind-{current.kind}" data-slide-id={current.id}>
			<a class="brand-tab" href="https://egghead.io/" target="_blank" rel="noreferrer">
				<img src={logomark} alt="" aria-hidden="true" draggable="false" />
				<span>egghead.io</span>
			</a>

			<div class="copy">
				<p class="eyebrow">{current.eyebrow}</p>
				<h1>{current.title}</h1>
				<p class="point">{current.point}</p>
			</div>

			<div class="visual">
				{@render Visual(current)}
			</div>

			{#if eggoBySlide[current.id]}
				<img
					class="slide-eggo"
					src={eggoBySlide[current.id]}
					alt=""
					aria-hidden="true"
					draggable="false"
				/>
			{/if}

			<div class="progress" aria-hidden="true">
				<span style={`width: ${progress}%`}></span>
			</div>
			<p class="slide-count">{index + 1}/{total}</p>
		</article>
	</section>
</main>

{#snippet Visual(slide: ToolSlide)}
	{#if slide.kind === 'title'}
		{@render TitleVisual(slide)}
	{:else if slide.kind === 'thesis'}
		{@render SliceVisual(slide)}
	{:else if slide.kind === 'receipt'}
		{@render ReceiptVisual(slide)}
	{:else if slide.kind === 'candidate'}
		{@render CandidateVisual(slide)}
	{:else if slide.kind === 'questions'}
		{@render QuestionVisual(slide)}
	{:else if slide.kind === 'rubric'}
		{@render RubricVisual(slide)}
	{:else if slide.kind === 'terminal'}
		{@render TerminalVisual(slide)}
	{:else if slide.kind === 'links'}
		{@render LinksVisual(slide)}
	{:else}
		{@render CloseVisual(slide)}
	{/if}
{/snippet}

{#snippet TitleVisual(slide: ToolSlide)}
	<div class="title-object">
		<span class="stamp">tool selection</span>
		<div class="question-swap">
			<section>
				<small>old question</small>
				<strong>{slide.visual.items?.[0]}</strong>
			</section>
			<section class="active">
				<small>{slide.visual.stamp}</small>
				<strong>{slide.visual.items?.[1]}</strong>
			</section>
		</div>
	</div>
{/snippet}

{#snippet SliceVisual(slide: ToolSlide)}
	<div class="slice-board">
		{#if slide.id === 'slice-over-list'}
			<div class="repo-map">
				<span class="stamp">{slide.visual.stamp}</span>
				{#each slide.visual.items ?? [] as item (item)}
					{@const pair = item.split(' -> ')}
					{@const href = slide.visual.links?.[slide.visual.items?.indexOf(item) ?? -1]}
					<svelte:element this={href ? 'a' : 'section'} {href} target="_blank" rel="noreferrer">
						<small>{pair[0]}</small>
						<strong>{pair[1]}</strong>
					</svelte:element>
				{/each}
			</div>
		{:else}
			<div class="product-box">
				<span class="product-label">workflow slice</span>
				{#each slide.visual.items ?? [] as feature (feature)}
					<i class="highlight">{feature}</i>
				{/each}
			</div>
			<div class="slice-strip">
				<span class="stamp">{slide.visual.stamp}</span>
				{#each slide.visual.items ?? [] as item, itemIndex (item)}
					<strong style={`--item-index: ${itemIndex}`}>{item}</strong>
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

{#snippet IngredientVisual(slide: ToolSlide)}
	<div class="ingredient-compare">
		<section class="thin">
			<span>blank prompt</span>
			<strong>guess APIs</strong>
			<strong>guess state</strong>
			<strong>guess edge cases</strong>
		</section>
		<section class="full">
			<span class="stamp">{slide.visual.stamp}</span>
			{#each slide.visual.items ?? [] as item (item)}
				<strong>{item}</strong>
			{/each}
		</section>
	</div>
{/snippet}

{#snippet ReceiptVisual(slide: ToolSlide)}
	<div class="receipt-card">
		<header>
			<span>{slide.demo?.label}</span>
			<strong>{slide.visual.stamp}</strong>
		</header>
		{@render CommandBlock(slide.demo?.command ?? '')}
		<div class="receipt-output">
			{#each slide.demo?.output ?? [] as line (line)}
				<p>{line}</p>
			{/each}
		</div>
		<footer>
			{#each slide.visual.receiptMarks ?? [] as mark (mark)}
				<span>{mark}</span>
			{/each}
		</footer>
	</div>
{/snippet}

{#snippet CandidateVisual(slide: ToolSlide)}
	<div class="candidate-stack">
		{#if slide.id === 'candidate-not-replacement'}
			<div class="slice-choice">
				<section class="whole-app">
					<span>whole app</span>
					{#each slide.visual.items?.slice(0, 4) ?? [] as item (item)}
						<strong>{item}</strong>
					{/each}
				</section>
				<section class="your-slice">
					<span class="stamp">{slide.visual.stamp}</span>
					{#each slide.visual.items?.slice(4) ?? [] as item (item)}
						<strong>{item}</strong>
					{/each}
				</section>
			</div>
		{:else if slide.id === 'leads-not-proof'}
			{@render IngredientVisual(slide)}
		{:else}
			{#each slide.demo?.output ?? slide.visual.items ?? [] as candidate, itemIndex (candidate)}
				<section class="repo-card">
					<span>{['find', 'borrow', 'combine', 'ship'][itemIndex] ?? 'use'}</span>
					<strong>{candidate}</strong>
				</section>
			{/each}
			<div class="candidate-stamps">
				<span class="stamp">{slide.visual.stamp}</span>
				{#each slide.visual.items ?? [] as item (item)}
					<strong>{item}</strong>
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

{#snippet QuestionVisual(slide: ToolSlide)}
	<div class="question-tabs">
		<span class="stamp">{slide.visual.stamp}</span>
		{#each slide.visual.items ?? [] as question, itemIndex (question)}
			<section style={`--tab-index: ${itemIndex}`}>
				<small>ask {itemIndex + 1}</small>
				<strong>{question}</strong>
			</section>
		{/each}
	</div>
{/snippet}

{#snippet RubricVisual(slide: ToolSlide)}
	<div class="rubric-tabs">
		{#each slide.visual.items ?? [] as item, itemIndex (item)}
			<section style={`--tab-index: ${itemIndex}`}>
				<span>{itemIndex + 1}</span>
				<strong>{item}</strong>
				<small
					>{slide.id === 'agent-first-five'
						? ['sets intent', 'does the work', 'exposes actions', 'proves result'][itemIndex]
						: [
								'commands or docs',
								'readable state',
								'scripted moves',
								'logs or screens',
								'exit path'
							][itemIndex]}</small
				>
			</section>
		{/each}
	</div>
{/snippet}

{#snippet TerminalVisual(slide: ToolSlide)}
	<div class="terminal-surface">
		<div class="handles">
			{#each slide.visual.items ?? [] as item (item)}
				<span>{item}</span>
			{/each}
		</div>
		{@render CommandBlock(slide.demo?.command ?? '')}
		<div class="terminal-output">
			{#each slide.demo?.output ?? [] as line (line)}
				<p><span>$</span>{line}</p>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet CloseVisual(slide: ToolSlide)}
	<div class="close-ledger">
		<span class="stamp">{slide.visual.stamp}</span>
		{#each slide.visual.receiptMarks ?? [] as mark, itemIndex (mark)}
			<p style={`--item-index: ${itemIndex}`}>
				<span>{itemIndex + 1}</span>
				<strong>{mark}</strong>
			</p>
		{/each}
	</div>
{/snippet}

{#snippet LinksVisual(slide: ToolSlide)}
	<div class="resource-board">
		<a class="qr-card" href={slide.visual.links?.[0]} target="_blank" rel="noreferrer">
			<img src={githubQr} alt="QR code for github.com/johnlindquist/own-the-workflow" />
			<span>{slide.visual.stamp}</span>
		</a>
		<div class="resource-links">
			{#each slide.visual.items ?? [] as item, itemIndex (item)}
				<a href={slide.visual.links?.[itemIndex]} target="_blank" rel="noreferrer">
					<small>{itemIndex === 0 ? 'source' : 'workshop'}</small>
					<strong>{item}</strong>
				</a>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet CommandBlock(command: string)}
	<pre class="command"><code
			><span class="prompt">$</span
			>{#each tokenizeCommand(command) as token, tokenIndex (tokenIndex)}<span
					class={`cmd-${token.kind}`}>{token.text}</span
				>{/each}</code
		></pre>
{/snippet}

<style>
	.tools-deck {
		min-height: 100vh;
		background:
			radial-gradient(circle at 78% 12%, rgba(247, 201, 72, 0.2), transparent 28%),
			radial-gradient(circle at 18% 92%, rgba(168, 212, 226, 0.2), transparent 30%),
			var(--paper-noise), var(--paper);
		color: var(--ink);
		padding: 18px;
		overflow: hidden;
	}

	.deck-nav {
		display: grid;
		grid-template-columns: max-content 1fr max-content;
		align-items: center;
		gap: 18px;
		max-width: 1500px;
		margin: 0 auto 18px;
	}

	.nav-key,
	.nav-dots button {
		border: var(--stroke) solid var(--navy);
		border-radius: var(--radius-key);
		background: var(--cream-grad);
		color: var(--ink);
		box-shadow: var(--shadow-btn-ghost);
		font-weight: 950;
		text-decoration: none;
	}

	.nav-key {
		padding: 10px 14px;
	}

	.nav-key.yolk,
	.nav-dots button.active {
		background: var(--yolk-grad);
		box-shadow: var(--shadow-btn);
	}

	.nav-dots {
		display: flex;
		justify-content: center;
		gap: 8px;
	}

	.nav-dots button {
		width: 34px;
		height: 34px;
		cursor: pointer;
	}

	.stage {
		max-width: 1500px;
		margin: 0 auto;
	}

	.slide {
		position: relative;
		min-height: calc(100vh - 120px);
		display: grid;
		grid-template-columns: minmax(380px, 0.95fr) minmax(420px, 1.05fr);
		gap: clamp(38px, 4vw, 76px);
		align-items: center;
		padding: clamp(46px, 5vw, 86px);
		border: 1px solid #eadfc2;
		border-radius: 28px;
		background: var(--cream-grad);
		box-shadow: var(--shadow-card-deep);
		overflow: hidden;
	}

	.slide::before {
		position: absolute;
		content: '';
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(circle at 13% 9%, rgba(255, 255, 255, 0.72), transparent 34%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.38), transparent 30%);
		z-index: 0;
	}

	.slide.kind-terminal {
		background:
			radial-gradient(circle at 74% 20%, rgba(168, 212, 226, 0.2), transparent 30%),
			var(--cream-grad);
		color: var(--eggo-day-ink);
		border-color: #eadfc2;
	}

	.slide.kind-close {
		background:
			radial-gradient(circle at 76% 34%, rgba(157, 190, 141, 0.3), transparent 30%),
			var(--cream-grad);
	}

	.presenting {
		padding: 0;
	}

	.presenting .stage {
		width: 100vw;
		height: 100vh;
		max-width: none;
		display: grid;
		place-items: center;
	}

	.presenting .slide {
		width: min(1720px, calc(100vw - 92px));
		height: min(940px, calc(100vh - 76px));
		min-height: 0;
	}

	.brand-tab {
		position: absolute;
		left: clamp(32px, 4.8vw, 68px);
		top: -2px;
		z-index: 5;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 10px 18px 11px;
		border: 1px solid #e2d5b4;
		border-top: 0;
		border-radius: 0 0 16px 16px;
		background: var(--cream-grad);
		box-shadow: var(--shadow-btn-ghost);
		color: var(--eggo-day-ink);
		font-size: 14px;
		font-weight: 1000;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		text-decoration: none;
		transition:
			transform 120ms ease,
			box-shadow 120ms ease,
			background 120ms ease;
	}

	.brand-tab:hover,
	.brand-tab:focus-visible {
		background: var(--yolk-grad);
		box-shadow: var(--shadow-well);
		transform: translateY(4px);
		outline: none;
	}

	.brand-tab:active {
		box-shadow: inset 0 3px 5px rgba(32, 44, 60, 0.28);
		transform: translateY(6px);
	}

	.kind-terminal .brand-tab {
		background: var(--cream-grad);
		border-color: #e2d5b4;
		color: var(--eggo-day-ink);
		box-shadow: var(--shadow-btn-ghost);
	}

	.brand-tab img {
		width: 30px;
		height: 30px;
		filter: drop-shadow(0 3px 4px rgba(120, 90, 30, 0.25));
	}

	.copy,
	.visual {
		position: relative;
		z-index: 2;
	}

	.copy {
		max-width: 780px;
	}

	.eyebrow {
		margin: 0 0 18px;
		color: var(--rust);
		font-size: clamp(18px, 1.35vw, 24px);
		font-weight: 950;
		text-transform: uppercase;
		letter-spacing: 0;
	}

	.kind-terminal .eyebrow {
		color: var(--rust);
	}

	h1 {
		margin: 0;
		font-size: clamp(62px, 6.2vw, 116px);
		line-height: 0.92;
		letter-spacing: 0;
		text-wrap: balance;
	}

	.point {
		max-width: 680px;
		margin: 26px 0 0;
		font-size: clamp(27px, 2vw, 36px);
		line-height: 1.1;
		font-weight: 900;
		color: color-mix(in srgb, currentColor, transparent 8%);
		text-wrap: balance;
	}

	.visual {
		min-width: 0;
	}

	.slide-eggo {
		position: absolute;
		left: var(--eggo-left, 50%);
		bottom: var(--eggo-bottom, clamp(40px, 6.4vw, 104px));
		z-index: var(--eggo-z, 3);
		width: var(--eggo-width, clamp(177px, 19.5vw, 327px));
		height: auto;
		transform: translateX(-50%);
		pointer-events: none;
		filter: drop-shadow(0 14px 18px rgba(80, 60, 25, 0.18));
	}

	.slide[data-slide-id='title'] {
		--eggo-left: 47%;
		--eggo-bottom: 50px;
		--eggo-width: clamp(170px, 15vw, 242px);
		--eggo-z: 1;
	}

	.slide[data-slide-id='slice-over-list'] {
		--eggo-left: 48%;
		--eggo-bottom: 56px;
		--eggo-width: clamp(150px, 12.5vw, 205px);
		--eggo-z: 1;
	}

	.slide[data-slide-id='search-before-build'] {
		--eggo-left: 49%;
		--eggo-bottom: 60px;
		--eggo-width: clamp(158px, 13vw, 215px);
		--eggo-z: 1;
	}

	.slide[data-slide-id='leads-not-proof'] {
		--eggo-left: 49%;
		--eggo-bottom: 58px;
		--eggo-width: clamp(150px, 12.8vw, 208px);
		--eggo-z: 1;
	}

	.slide[data-slide-id='candidate-not-replacement'] {
		--eggo-left: 49%;
		--eggo-bottom: 56px;
		--eggo-width: clamp(152px, 13vw, 210px);
		--eggo-z: 1;
	}

	.slide[data-slide-id='thaw-caveat'] {
		--eggo-left: 83%;
		--eggo-bottom: 54px;
		--eggo-width: clamp(145px, 12.2vw, 198px);
		--eggo-z: 4;
	}

	.slide[data-slide-id='ask-the-repo'] {
		--eggo-left: 84%;
		--eggo-bottom: 56px;
		--eggo-width: clamp(145px, 12.4vw, 200px);
		--eggo-z: 4;
	}

	.slide[data-slide-id='agent-first-five'] {
		--eggo-left: 84%;
		--eggo-bottom: 56px;
		--eggo-width: clamp(145px, 12.4vw, 200px);
		--eggo-z: 4;
	}

	.slide[data-slide-id='cli-handles'] {
		--eggo-left: 49%;
		--eggo-bottom: 58px;
		--eggo-width: clamp(145px, 12vw, 195px);
		--eggo-z: 1;
	}

	.slide[data-slide-id='cmux-control-surface'] {
		--eggo-left: 49%;
		--eggo-bottom: 58px;
		--eggo-width: clamp(148px, 12.2vw, 198px);
		--eggo-z: 1;
	}

	.slide[data-slide-id='close'] {
		--eggo-left: 88%;
		--eggo-bottom: 42px;
		--eggo-width: clamp(150px, 12.8vw, 208px);
		--eggo-z: 4;
	}

	.slide[data-slide-id='resources'] {
		--eggo-left: 91%;
		--eggo-bottom: 34px;
		--eggo-width: clamp(105px, 9vw, 145px);
		--eggo-z: 1;
	}

	.progress {
		position: absolute;
		left: clamp(40px, 5vw, 82px);
		right: clamp(40px, 5vw, 82px);
		bottom: 24px;
		z-index: 6;
		height: 14px;
		border: 2px solid var(--navy);
		border-radius: 999px;
		background: rgba(255, 253, 246, 0.82);
		box-shadow: var(--shadow-well);
		overflow: hidden;
	}

	.kind-terminal .progress {
		border-color: var(--navy);
		background: rgba(255, 253, 246, 0.82);
	}

	.progress span {
		display: block;
		height: 100%;
		background: var(--yolk-grad);
	}

	.slide-count {
		position: absolute;
		right: clamp(40px, 5vw, 82px);
		top: clamp(34px, 4vw, 66px);
		z-index: 5;
		margin: 0;
		color: color-mix(in srgb, currentColor, transparent 38%);
		font-weight: 1000;
	}

	.stamp {
		display: inline-flex;
		width: fit-content;
		align-items: center;
		justify-content: center;
		padding: 9px 14px;
		border: 2px solid var(--rust);
		border-radius: 999px;
		color: var(--rust);
		background: rgba(255, 253, 246, 0.75);
		box-shadow: var(--shadow-btn-ghost);
		font-size: clamp(16px, 1.2vw, 20px);
		font-weight: 1000;
		text-transform: uppercase;
		transform: rotate(-2deg);
	}

	.title-object,
	.slice-board,
	.receipt-card,
	.candidate-stack,
	.question-tabs,
	.rubric-tabs,
	.terminal-surface,
	.close-ledger,
	.resource-board {
		position: relative;
	}

	.title-object {
		display: grid;
		justify-items: start;
		gap: 22px;
	}

	.control-card {
		width: min(100%, 540px);
		padding: 34px;
		border: 2px solid var(--navy);
		border-radius: 22px;
		background: var(--shell-grad);
		box-shadow: var(--shadow-card-deep);
		display: grid;
		gap: 14px;
	}

	.control-card strong {
		margin-bottom: 6px;
		font-size: clamp(42px, 4vw, 70px);
		line-height: 0.95;
	}

	.control-card span,
	.yolk-switch {
		width: fit-content;
		padding: 12px 16px;
		border: 2px solid var(--navy);
		border-radius: 14px;
		background: var(--cream-grad);
		box-shadow: var(--shadow-well);
		font-size: clamp(23px, 1.7vw, 32px);
		font-weight: 950;
	}

	.yolk-switch {
		background: var(--yolk-grad);
		box-shadow: var(--shadow-btn);
		transform: rotate(1.5deg);
	}

	.question-swap {
		width: min(100%, 620px);
		display: grid;
		gap: 20px;
	}

	.question-swap section {
		padding: 24px 28px;
		border: 2px solid color-mix(in srgb, var(--navy), transparent 25%);
		border-radius: 22px;
		background: var(--shell-grad);
		box-shadow: var(--shadow-btn-ghost);
		display: grid;
		gap: 7px;
		transform: rotate(-1deg);
	}

	.question-swap section.active {
		border-color: var(--navy);
		background: var(--yolk-grad);
		box-shadow: var(--shadow-btn);
		transform: rotate(1deg);
	}

	.question-swap small,
	.repo-map small,
	.ingredient-compare section > span,
	.slice-choice section > span {
		color: var(--rust);
		font-size: clamp(15px, 1vw, 19px);
		font-weight: 1000;
		text-transform: uppercase;
	}

	.question-swap strong {
		font-size: clamp(38px, 3.3vw, 64px);
		line-height: 0.98;
	}

	.slice-board {
		display: grid;
		gap: 28px;
	}

	.product-box,
	.slice-strip,
	.receipt-card,
	.dossier,
	.question-tabs section,
	.rubric-tabs section,
	.close-ledger {
		border: 1px solid #eadfc2;
		border-radius: 22px;
		background: var(--cream-grad);
		box-shadow: var(--shadow-card-deep);
	}

	.product-box {
		padding: 28px;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
	}

	.product-label {
		grid-column: 1 / -1;
		color: var(--rust);
		font-weight: 1000;
		text-transform: uppercase;
	}

	.product-box i {
		padding: 12px 14px;
		border: 2px solid color-mix(in srgb, var(--navy), transparent 34%);
		border-radius: 14px;
		font-style: normal;
		font-size: clamp(19px, 1.25vw, 24px);
		font-weight: 900;
		opacity: 0.35;
	}

	.product-box i.highlight {
		opacity: 1;
		background: var(--yolk-grad);
		box-shadow: var(--shadow-btn);
	}

	.slice-strip {
		padding: 24px;
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		align-items: center;
	}

	.slice-strip strong {
		padding: 14px 18px;
		border: 2px solid var(--navy);
		border-radius: 999px;
		background: var(--shell-grad);
		box-shadow: var(--shadow-btn-ghost);
		font-size: clamp(21px, 1.6vw, 30px);
		transform: rotate(calc((var(--item-index) - 1.5) * 1deg));
	}

	.repo-map,
	.ingredient-compare,
	.slice-choice {
		display: grid;
		gap: 14px;
	}

	.repo-map {
		width: min(100%, 600px);
	}

	.repo-map .stamp {
		margin-bottom: 4px;
	}

	.repo-map section,
	.repo-map a,
	.ingredient-compare section,
	.slice-choice section {
		padding: 18px 22px;
		border: 2px solid color-mix(in srgb, var(--navy), transparent 18%);
		border-radius: 18px;
		background: var(--shell-grad);
		box-shadow: var(--shadow-btn-ghost);
		display: grid;
		grid-template-columns: minmax(145px, 0.75fr) minmax(0, 1fr);
		align-items: center;
		gap: 14px;
	}

	.repo-map a {
		color: inherit;
		text-decoration: none;
		transition:
			transform 120ms ease,
			box-shadow 120ms ease,
			background 120ms ease;
	}

	.repo-map a:hover,
	.repo-map a:focus-visible {
		background: var(--yolk-grad);
		box-shadow: var(--shadow-well);
		transform: translateY(4px) rotate(0deg);
		outline: none;
	}

	.repo-map a:active {
		box-shadow: inset 0 3px 5px rgba(32, 44, 60, 0.28);
		transform: translateY(6px) rotate(0deg);
	}

	.repo-map section:nth-of-type(2n),
	.repo-map a:nth-of-type(2n) {
		transform: rotate(0.7deg);
	}

	.repo-map section:nth-of-type(2n + 1),
	.repo-map a:nth-of-type(2n + 1) {
		transform: rotate(-0.5deg);
	}

	.repo-map strong {
		font-size: clamp(28px, 2.4vw, 45px);
		line-height: 0.96;
	}

	.receipt-card {
		padding: 26px;
		display: grid;
		gap: 18px;
	}

	.receipt-card header,
	.receipt-card footer {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		align-items: center;
		flex-wrap: wrap;
	}

	.receipt-card header span,
	.receipt-card footer span {
		color: var(--rust);
		font-size: clamp(16px, 1.1vw, 20px);
		font-weight: 1000;
		text-transform: uppercase;
	}

	.receipt-output,
	.terminal-output {
		display: grid;
		gap: 10px;
	}

	.receipt-output p,
	.terminal-output p {
		margin: 0;
		padding: 12px 14px;
		border-radius: 12px;
		background: rgba(255, 253, 246, 0.74);
		font-size: clamp(18px, 1.25vw, 24px);
		font-weight: 850;
		line-height: 1.15;
	}

	.command {
		margin: 0;
		padding: 18px 20px;
		border: 2px solid color-mix(in srgb, var(--navy), transparent 12%);
		border-radius: 14px;
		background: linear-gradient(180deg, #fffdf6 0%, #f4e7c6 100%);
		box-shadow: var(--shadow-card);
		color: var(--eggo-day-ink);
		font-family:
			'SFMono-Regular', Menlo, Consolas, Monaco, 'Liberation Mono', ui-monospace, monospace;
		font-size: clamp(18px, 1.35vw, 27px);
		font-weight: 760;
		line-height: 1.28;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.kind-terminal .command {
		border-color: rgba(255, 255, 255, 0.18);
		background: linear-gradient(180deg, #253449 0%, #182537 100%);
		color: var(--eggo-night-ink);
		box-shadow: var(--shadow-btn-dark);
	}

	.prompt,
	.cmd-operator {
		color: var(--eggo-yolk-shadow);
		font-weight: 1000;
	}

	.cmd-command {
		font-weight: 1000;
	}

	.cmd-flag {
		color: var(--eggo-night-rust);
	}

	.cmd-string {
		color: #2f6f5e;
	}

	.cmd-path {
		color: #315f88;
	}

	.kind-terminal .cmd-string,
	.kind-terminal .cmd-path {
		color: #9dd8ba;
	}

	.candidate-stack {
		display: grid;
		gap: 14px;
	}

	.repo-card {
		padding: 14px 18px;
		border: 2px solid var(--navy);
		border-radius: 16px;
		background: var(--shell-grad);
		box-shadow: var(--shadow-btn-ghost);
		display: grid;
		gap: 7px;
	}

	.repo-card span {
		color: var(--rust);
		font-size: 15px;
		font-weight: 1000;
		text-transform: uppercase;
	}

	.repo-card strong {
		font-size: clamp(19px, 1.35vw, 28px);
		line-height: 1.05;
	}

	.dossier {
		padding: 18px;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
	}

	.dossier .stamp {
		grid-column: 1 / -1;
	}

	.dossier p {
		margin: 0;
		padding: 10px 12px;
		border-radius: 12px;
		background: rgba(255, 253, 246, 0.74);
		display: grid;
		gap: 4px;
	}

	.dossier small {
		color: var(--ink-soft);
		font-weight: 850;
	}

	.inspection-dossier {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.ingredient-compare section,
	.slice-choice section {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: stretch;
	}

	.ingredient-compare .thin,
	.slice-choice .whole-app {
		opacity: 0.6;
	}

	.ingredient-compare .full,
	.slice-choice .your-slice {
		border-color: var(--navy);
		background: var(--yolk-grad);
		box-shadow: var(--shadow-btn);
	}

	.ingredient-compare section > span,
	.ingredient-compare .stamp,
	.slice-choice section > span,
	.slice-choice .stamp {
		grid-column: 1 / -1;
		width: fit-content;
	}

	.ingredient-compare strong,
	.slice-choice strong {
		padding: 12px 14px;
		border: 2px solid color-mix(in srgb, var(--navy), transparent 24%);
		border-radius: 14px;
		background: rgba(255, 253, 246, 0.74);
		box-shadow: var(--shadow-well);
		font-size: clamp(24px, 1.8vw, 34px);
		line-height: 1;
	}

	.ingredient-compare .thin strong {
		font-size: clamp(21px, 1.5vw, 29px);
	}

	.candidate-stamps {
		padding: 18px;
		border: 1px solid #eadfc2;
		border-radius: 22px;
		background: var(--cream-grad);
		box-shadow: var(--shadow-card-deep);
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.candidate-stamps strong {
		padding: 10px 12px;
		border: 2px solid color-mix(in srgb, var(--navy), transparent 28%);
		border-radius: 12px;
		background: rgba(255, 253, 246, 0.72);
		font-size: clamp(18px, 1.25vw, 24px);
		line-height: 1;
	}

	.question-tabs,
	.rubric-tabs {
		display: grid;
		gap: 16px;
	}

	.question-tabs section,
	.rubric-tabs section {
		padding: 18px 22px;
		transform: translateX(calc(var(--tab-index) * 10px))
			rotate(calc((var(--tab-index) - 1.5) * 0.7deg));
	}

	.question-tabs section small,
	.rubric-tabs section small {
		display: block;
		margin-bottom: 6px;
		color: var(--rust);
		font-weight: 1000;
		text-transform: uppercase;
	}

	.question-tabs section strong,
	.rubric-tabs section strong {
		font-size: clamp(24px, 1.8vw, 34px);
		line-height: 1.05;
	}

	.rubric-tabs section {
		display: grid;
		grid-template-columns: 48px 1fr;
		gap: 4px 16px;
		align-items: center;
	}

	.rubric-tabs section span {
		grid-row: span 2;
		width: 46px;
		height: 46px;
		border: 2px solid var(--navy);
		border-radius: 50%;
		background: var(--yolk-grad);
		box-shadow: var(--shadow-btn);
		display: grid;
		place-items: center;
		font-weight: 1000;
	}

	.terminal-surface {
		padding: 24px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 22px;
		background: rgba(16, 25, 38, 0.62);
		box-shadow: var(--shadow-btn-dark);
		display: grid;
		gap: 18px;
	}

	.slide[data-slide-id='cli-handles'] .terminal-surface,
	.slide[data-slide-id='cmux-control-surface'] .terminal-surface {
		padding: 18px;
		gap: 12px;
	}

	.slide[data-slide-id='cli-handles'] .command,
	.slide[data-slide-id='cmux-control-surface'] .command {
		padding: 14px 16px;
		font-size: clamp(16px, 1.18vw, 22px);
	}

	.slide[data-slide-id='cli-handles'] .terminal-output p,
	.slide[data-slide-id='cmux-control-surface'] .terminal-output p {
		padding: 9px 12px;
		font-size: clamp(16px, 1.12vw, 21px);
		line-height: 1.08;
	}

	.handles {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.handles span {
		padding: 9px 13px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 999px;
		background: var(--yolk-grad);
		color: var(--eggo-day-ink);
		box-shadow: var(--shadow-btn);
		font-weight: 950;
	}

	.terminal-output p {
		background: rgba(255, 255, 255, 0.08);
		color: var(--eggo-night-ink);
	}

	.terminal-output p span {
		margin-right: 10px;
		color: var(--eggo-yolk);
	}

	.close-ledger {
		padding: 22px;
		display: grid;
		gap: 10px;
	}

	.close-ledger p {
		margin: 0;
		padding: 11px 14px;
		border: 2px solid color-mix(in srgb, var(--navy), transparent 20%);
		border-radius: 14px;
		background: var(--shell-grad);
		box-shadow: var(--shadow-btn-ghost);
		display: flex;
		align-items: center;
		gap: 12px;
		transform: rotate(calc((var(--item-index) - 2.5) * 0.7deg));
	}

	.close-ledger p span {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: var(--yolk-grad);
		display: grid;
		place-items: center;
		font-weight: 1000;
		box-shadow: var(--shadow-btn);
	}

	.close-ledger p strong {
		font-size: clamp(22px, 1.6vw, 31px);
	}

	.resource-board {
		display: grid;
		grid-template-columns: minmax(230px, 0.75fr) minmax(260px, 1fr);
		gap: 18px;
		align-items: stretch;
	}

	.qr-card,
	.resource-links a {
		border: 2px solid var(--navy);
		border-radius: 22px;
		background: var(--shell-grad);
		box-shadow: var(--shadow-btn-ghost);
		color: var(--ink);
		text-decoration: none;
		transition:
			transform 120ms ease,
			box-shadow 120ms ease,
			background 120ms ease;
	}

	.qr-card:hover,
	.qr-card:focus-visible,
	.resource-links a:hover,
	.resource-links a:focus-visible {
		background: var(--yolk-grad);
		box-shadow: var(--shadow-well);
		transform: translateY(4px);
		outline: none;
	}

	.qr-card:active,
	.resource-links a:active {
		box-shadow: inset 0 3px 5px rgba(32, 44, 60, 0.28);
		transform: translateY(6px);
	}

	.qr-card {
		padding: 20px;
		display: grid;
		gap: 14px;
		place-items: center;
	}

	.qr-card img {
		width: min(100%, 310px);
		border: 2px solid var(--navy);
		border-radius: 16px;
		background: var(--paper);
		box-shadow: var(--shadow-well);
	}

	.qr-card span {
		font-size: clamp(16px, 1.1vw, 20px);
		font-weight: 950;
		text-align: center;
		overflow-wrap: anywhere;
	}

	.resource-links {
		display: grid;
		gap: 16px;
		align-content: center;
	}

	.resource-links a {
		padding: 24px;
		display: grid;
		gap: 8px;
	}

	.resource-links small {
		color: var(--rust);
		font-size: clamp(16px, 1.1vw, 20px);
		font-weight: 1000;
		text-transform: uppercase;
	}

	.resource-links strong {
		font-size: clamp(31px, 2.55vw, 52px);
		line-height: 0.98;
	}

	@media (max-height: 760px) and (min-width: 1101px) {
		.presenting .slide {
			padding-top: 54px;
			padding-bottom: 58px;
		}

		.slide-eggo {
			width: clamp(138px, 14.25vw, 234px);
			bottom: 52px;
		}

		.kind-close .close-ledger {
			gap: 8px;
			padding: 18px;
		}

		.kind-close .close-ledger p {
			padding: 9px 12px;
		}

		.command {
			font-size: clamp(16px, 1.2vw, 22px);
		}
	}

	@media (max-width: 1100px) {
		.tools-deck {
			overflow: auto;
		}

		.deck-nav {
			grid-template-columns: 1fr;
		}

		.nav-dots {
			flex-wrap: wrap;
		}

		.slide,
		.presenting .slide {
			width: auto;
			height: auto;
			min-height: calc(100vh - 80px);
			grid-template-columns: 1fr;
			padding: 64px 28px 86px;
		}

		.product-box,
		.dossier {
			grid-template-columns: 1fr;
		}

		.slide-eggo {
			position: relative;
			left: auto;
			right: auto;
			bottom: auto;
			justify-self: end;
			width: min(58vw, 285px);
			transform: none;
			margin-top: -28px;
			margin-bottom: -34px;
		}
	}
</style>

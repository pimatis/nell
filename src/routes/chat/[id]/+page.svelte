<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { goto } from '$app/navigation';

	interface Message {
		role: 'user' | 'assistant' | 'error';
		content: string;
	}

	interface ChatData {
		id: string;
		title: string;
		messages: Message[];
		created: string;
		updated: string;
		isPublic: boolean;
	}

	let chatData: ChatData | null = null;
	let isLoading = true;
	let error: string | null = null;
	let messagesEnd: HTMLElement;
	let copiedMessageIndex: number | null = null;

	function renderMarkdown(content: string): string {
		return content
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			.replace(/`(.*?)`/g, '<code>$1</code>')
			.replace(/\n/g, '<br>');
	}

	async function loadChat() {
		try {
			isLoading = true;
			error = null;

			const chatId = $page.params.id;
			const response = await fetch(`/api/chat/${chatId}`);
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to load chat');
			}

			chatData = result.data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			isLoading = false;
		}
	}

	async function copyToClipboard(text: string, index: number) {
		try {
			await navigator.clipboard.writeText(text);
			copiedMessageIndex = index;
			setTimeout(() => {
				copiedMessageIndex = null;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	}

	onMount(() => {
		loadChat();
	});

	$: if (chatData && messagesEnd) {
		setTimeout(() => {
			messagesEnd.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	}
</script>

<div class="flex flex-col h-screen w-full">
	<div class="backdrop-blur-sm sticky top-0 bg-primary">
		<div class="w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<Button variant="outline" size="sm" onclick={() => goto('/')}>
					<i class="ri-arrow-left-line mr-2"></i>
					Back to Chat
				</Button>
				{#if chatData}
					<div>
						<h1 class="text-lg font-semibold">{chatData.title}</h1>
						<p class="text-sm opacity-50">Shared chat • {chatData.messages.length} messages</p>
					</div>
				{/if}
			</div>
			<div class="flex items-center gap-2 {chatData?.isPublic ? 'text-green-500' : 'text-red-500'}">
				<i class="ri-{chatData?.isPublic ? 'share' : 'lock'}-line"></i>
				<span class="text-sm">{chatData?.isPublic ? 'Public' : 'Private'}</span>
			</div>
		</div>
	</div>

	<ScrollArea class="flex-1 overflow-auto">
		<div class="w-full max-w-6xl mx-auto px-4 py-4 space-y-4">
			{#if isLoading}
				<div class="flex items-center justify-center h-64">
					<div class="flex flex-col items-center gap-4">
						<i class="ri-loop-right-line animate-spin text-2xl"></i>
						<p class="text-sm opacity-50">Loading chat...</p>
					</div>
				</div>
			{:else if error}
			<div class="flex items-center justify-center min-h-screen">
				<div class="flex flex-col items-center gap-4 text-center">
					<i class="ri-error-warning-line text-4xl text-destructive"></i>
					<div>
						<h2 class="text-lg font-semibold">Chat not found</h2>
						<p class="text-sm opacity-50 mt-1">{error}</p>
					</div>
					<Button variant="secondary" onclick={() => goto('/')}>
						Go to Home
					</Button>
				</div>
			</div>
			{:else if chatData}
				{#each chatData.messages as message, i (i)}
					{#if message.role === 'user'}
						<div class="flex justify-end w-full">
							<div class="flex max-w-[90%] items-start group">
								<div class="px-3 py-2 bg-secondary rounded-tl-lg rounded-bl-lg rounded-br-lg relative break-all">
									<div class="text-sm leading-relaxed break-all">
										{message.content}
									</div>
									<div class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
										<Button variant="ghost" size="sm" class="h-6 px-2 text-xs bg-secondary backdrop-blur-lg shadow-xl" onclick={() => copyToClipboard(message.content, i)} title="Copy message">
											{#if copiedMessageIndex === i}
												<i class="ri-check-line"></i>
											{:else}
												<i class="ri-file-copy-line"></i>
											{/if}
										</Button>
									</div>
								</div>
							</div>
						</div>
					{:else if message.role === 'error'}
						<div class="w-full py-1 group">
							<div class="text-sm text-destructive whitespace-pre-line px-4 relative flex items-center">
								<i class="ri-error-warning-line mr-2"></i>
								{message.content}
								<div class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
									<Button variant="ghost" size="sm" class="h-6 px-2 text-xs flex items-center bg-secondary backdrop-blur-lg shadow-xl" onclick={() => copyToClipboard(message.content, i)} title="Copy error message">
										{#if copiedMessageIndex === i}
											<i class="ri-check-line"></i>
										{:else}
											<i class="ri-file-copy-line"></i>
										{/if}
									</Button>
								</div>
							</div>
						</div>
					{:else}
						<div class="w-full py-1 group">
							<div class="text-sm whitespace-pre-line px-4 relative break-all">
								<div class="prose prose-sm max-w-none break-all">
									{@html renderMarkdown(message.content || '...')}
								</div>
								<div class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
									<Button variant="ghost" size="sm" class="h-6 px-2 text-xs flex items-center bg-secondary backdrop-blur-lg shadow-xl" onclick={() => copyToClipboard(message.content, i)} title="Copy response">
										{#if copiedMessageIndex === i}
											<i class="ri-check-line"></i>
										{:else}
											<i class="ri-file-copy-line"></i>
										{/if}
									</Button>
								</div>
							</div>
						</div>
					{/if}
				{/each}
				<div bind:this={messagesEnd}></div>
			{/if}
		</div>
	</ScrollArea>
</div>

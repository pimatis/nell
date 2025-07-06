<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { models, searchModel } from "$lib/config/models";
    import { renderMarkdown } from "$lib/config/markdown";
    import { thinkingMessages } from "$lib/config/messages";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Vault from "../components/Vault.svelte";

    interface ChatHistory {
        id: string;
        title: string;
        messageCount: number;
        lastMessage: string;
        created: string;
        updated: string;
    }

    let messages: Array<{role: string, content: string}> = [];
    let input = '';
    let isLoading = false;
    let error: string | null = null;
    let selectedModel = models[0];
    let showModelDialog = false;
    let modelSearchQuery = '';
    let copiedMessageIndex: number | null = null;
    let messagesEnd: HTMLElement;
    let isWebSearchActive = false;
    let messageElement: HTMLElement;
    let isValid = false;
    let currentChatId: string | null = null;
    let chatHistory: ChatHistory[] = [];
    let showChatHistory = false;
    let isDeletingChat = false;
    let isSharingChat = false;
    let info: any;
    let currentThinkingMessage = "";
    let thinkingInterval: NodeJS.Timeout | null = null;
    let showUpdatesDialog = false;
    let updates: Array<{id: string, title: string, description: string, created: string}> = [];
    let quickActionsDropdownOpen = false;
    let showPremiumDialog = false;
    let defaultPrompts = [
        {
            title: "How does artificial intelligence work?",
            prompt: "Can you explain how artificial intelligence works?"
        },
        {
            title: "How many R's are there in strawberry?",
            prompt: "How many R's are there in strawberry?"
        },
        {
            title: "What should you do in a life-threatening situation?",
            prompt: "What should you do in a life-threatening situation?"
        }
    ];

    $: filteredModels = models.filter(model =>
        model.name.toLowerCase().includes(modelSearchQuery.toLowerCase())
    );

    $: if (!showModelDialog) {
        modelSearchQuery = '';
    }

    $: if (thinkingInterval && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'assistant' && isLoading) {
            messages = [...messages.slice(0, -1), { role: 'assistant', content: currentThinkingMessage }];
        }
    }

    const toggleWebSearch = () => {
        isWebSearchActive = !isWebSearchActive;
    };

    const startThinkingAnimation = () => {
        const getRandomMessage = () => {
            return thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];
        };

        currentThinkingMessage = getRandomMessage();
        
        thinkingInterval = setInterval(() => {
            currentThinkingMessage = getRandomMessage();
        }, 2000);
    };

    const stopThinkingAnimation = () => {
        if (thinkingInterval) {
            clearInterval(thinkingInterval);
            thinkingInterval = null;
        }
        currentThinkingMessage = "";
    };

    function renderHtml(html: string) {
        return { __html: html };
    }

    const loadChatHistory = async () => {
        try {
            const response = await fetch('/api/user/chats');
            if (response.ok) {
                const data = await response.json();
                chatHistory = data.data || [];
            } else {
                console.error('Failed to load chat history');
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    const deleteChat = async (chatId: string) => {
        isDeletingChat = true;
        try {
            const response = await fetch(`/api/user/chats?id=${chatId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                chatHistory = chatHistory.filter(chat => chat.id !== chatId);

                if (currentChatId === chatId) {
                    startNewChat();
                }
            } else {
                console.error('Failed to delete chat');
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
        } finally {
            isDeletingChat = false;
        }
    };

    const deleteAllChats = async () => {
        if (!confirm('Are you sure you want to delete all chat history? This action cannot be undone.')) {
            return;
        }

        isDeletingChat = true;
        try {
            const deletePromises = chatHistory.map(chat => 
                fetch(`/api/user/chats?id=${chat.id}`, {
                    method: 'DELETE'
                })
            );

            const responses = await Promise.all(deletePromises);
            const allSuccess = responses.every(response => response.ok);

            if (allSuccess) {
                chatHistory = [];
                startNewChat();
            } else {
                console.error('Failed to delete some chats');
                alert('Some chats could not be deleted. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting all chats:', error);
            alert('Failed to delete all chats. Please try again.');
        } finally {
            isDeletingChat = false;
        }
    };

    const shareChat = async (chatId: string) => {
        try {
            isSharingChat = true;

            const response = await fetch('/api/chat/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chatId })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to share chat');
            }

            const shareUrl = `${window.location.origin}${result.shareUrl}`;
            await navigator.clipboard.writeText(shareUrl);

            alert('Chat shared successfully! Link copied to clipboard.');

        } catch (error) {
            console.error('Error sharing chat:', error);
            alert('Failed to share chat. Please try again.');
            } finally {
                isSharingChat = false;
            }
        };

        const loadChat = async (chatId: string) => {
        try {
            const response = await fetch('/api/user/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatId })
            });

            if (response.ok) {
                const data = await response.json();
                const chatData = data.data;

                currentChatId = chatId;

                if (chatData.messages && Array.isArray(chatData.messages)) {
                    messages = [...chatData.messages];
                } else {
                    messages = [];
                }

                showChatHistory = false;

                setTimeout(() => {
                    messagesEnd?.scrollIntoView({ behavior: 'smooth' });
                }, 200);

            } else {
                const errorData = await response.json();
                console.error('Failed to load chat:', errorData);
            }
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    };

    const debugChat = async () => {
        try {
            const response = await fetch('/api/user/chats');
            const data = await response.json();

            if (data.data.length > 0) {
                const firstChat = data.data[0];

                const chatResponse = await fetch('/api/user/chats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chatId: firstChat.id })
                });

                const chatData = await chatResponse.json();
            }
        } catch (error) {
            console.error('Debug error:', error);
        }
    };

    onMount(async () => {
        const res = await fetch("/api/user/valid");
        const data = await res.json();
        isValid = data.data;

        const infoRes = await fetch("/api/user/info");
        const infoData = await infoRes.json();
        info = infoData.data;

        if (!isValid) {
            goto("/login");
        } else {
            await loadChatHistory();
            setTimeout(debugChat, 1000);
        }
    });

    const loadUpdates = async () => {
        try {
            const response = await fetch('/api/updates');
            if (response.ok) {
                const data = await response.json();
                updates = data.data || [];
            } else {
                console.error('Failed to load updates');
            }
        } catch (error) {
            console.error('Error loading updates:', error);
        }
    };

    const canUseChat = () => {
        if (!info) return false;
        return info.accountType === 'Premium' && info.verified && info.usageCount < info.limit;
    };

    const handleSubmit = async () => {
        if (!input.trim() || isLoading) return;

        if (!canUseChat()) {
            showPremiumDialog = true;
            return;
        }

        if (isWebSearchActive) {
            await handleSearch();
            return;
        }

        const userMessage = { role: 'user', content: input };
        messages = [...messages, userMessage];

        startThinkingAnimation();
        const tempMessage = { role: 'assistant', content: currentThinkingMessage };
        messages = [...messages, tempMessage];

        input = '';
        isLoading = true;
        error = null;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: selectedModel.id,
                    messages: messages.slice(0, -1),
                    chatId: currentChatId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const data = await response.json();

            if (data.chatId) {
                currentChatId = data.chatId;
                await loadChatHistory();
            }

            stopThinkingAnimation();
            messages = [...messages.slice(0, -1), { role: 'assistant', content: data.choices[0].message.content }];
        } catch (e) {
            stopThinkingAnimation();
            const errorMessage = 'An error occurred while processing your message.';
            messages = [...messages.slice(0, -1), { role: 'error', content: errorMessage }];
            console.error('Error:', e);
        } finally {
            isLoading = false;
        }
    };

    const handleSearch = async () => {
        if (!input.trim() || isLoading) return;

        if (!canUseChat()) {
            showPremiumDialog = true;
            return;
        }

        const userMessage = { role: 'user', content: input };
        messages = [...messages, userMessage];

        startThinkingAnimation();
        const tempMessage = { role: 'assistant', content: currentThinkingMessage };
        messages = [...messages, tempMessage];

        input = '';
        isLoading = true;
        error = null;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: searchModel,
                    messages: messages.slice(0, -1),
                    chatId: currentChatId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const data = await response.json();

            if (data.chatId) {
                currentChatId = data.chatId;
                await loadChatHistory();
            }

            stopThinkingAnimation();
            messages = [...messages.slice(0, -1), { role: 'assistant', content: data.choices[0].message.content }];
        } catch (e) {
            stopThinkingAnimation();
            const errorMessage = 'An error occurred while processing your message.';
            messages = [...messages.slice(0, -1), { role: 'error', content: errorMessage }];
            console.error('Error:', e);
        } finally {
            isLoading = false;
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const copyToClipboard = async (text: string, messageIndex: number) => {
        try {
            await navigator.clipboard.writeText(text);
            copiedMessageIndex = messageIndex;
            setTimeout(() => {
                copiedMessageIndex = null;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const startNewChat = () => {
        stopThinkingAnimation();
        messages = [];
        currentChatId = null;
        input = '';
        error = null;
        isLoading = false;
    };

    $: if (messages.length > 0) {
        setTimeout(() => {
            messagesEnd?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
</script>

<div class="flex flex-col h-screen w-full">
    <!-- Messages Area -->
    <ScrollArea class="flex-1 overflow-auto">
        <div class="w-full max-w-6xl mx-auto px-4 py-4 space-y-4">
            <!-- Desktop/Tablet: Inline buttons -->
            <div class="hidden md:flex justify-center gap-2 mb-4">
                <Button variant="outline" size="sm" onclick={() => { showUpdatesDialog = true; loadUpdates(); }}>
                    <i class="ri-notification-line"></i>
                    Updates
                </Button>
                <Button variant="outline" size="sm" onclick={startNewChat}>
                    <i class="ri-add-line"></i>
                    New Chat
                </Button>
                <Button variant="outline" size="sm" onclick={() => { showChatHistory = true; loadChatHistory(); }}>
                    <i class="ri-time-line"></i>
                    History
                </Button>
                <Button variant="outline" size="sm" onclick={() => { goto('/profile') }}>
                    <i class="ri-user-line"></i>
                    Profile
                </Button>
            </div>

            <!-- Mobile: Dropdown menu -->
            <div class="md:hidden flex mb-4">
                <DropdownMenu.Root onOpenChange={(open) => quickActionsDropdownOpen = open}>
                    <DropdownMenu.Trigger>
                        <Button variant="outline" size="sm" class="flex items-center gap-2">
                            <i class="ri-{quickActionsDropdownOpen ? 'close' : 'menu'}-line"></i>
                            Quick Actions
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item onclick={() => { showUpdatesDialog = true; loadUpdates(); }}>
                            <i class="ri-notification-line mr-2"></i>
                            Updates
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onclick={startNewChat}>
                            <i class="ri-add-line mr-2"></i>
                            New Chat
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onclick={() => { showChatHistory = true; loadChatHistory(); }}>
                            <i class="ri-time-line mr-2"></i>
                            History
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onclick={() => { goto('/profile') }}>
                            <i class="ri-user-line mr-2"></i>
                            Profile
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
            {#if messages.length === 0}
            <div class="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                <h2 class="text-2xl font-semibold mb-1">Ask Nell anything</h2>
                <p class="text-sm opacity-80">Your AI assistant powered by multiple models</p>
                <div class="flex flex-col sm:flex-col md:flex-col lg:flex-row gap-4 text-xs mt-6">
                    {#each defaultPrompts as prompt}
                        <button on:click={() => { input = prompt.prompt; handleSubmit(); }} class="hover:cursor-pointer hover:bg-secondary/50 px-4 py-2 rounded-md">
                            {prompt.title}
                        </button>
                    {/each}
                </div>
            </div>
            {:else}
                {#each messages as message, i (i)}
                    {#if message.role === 'user'}
                        <div class="flex justify-end w-full">
                            <div class="flex max-w-[90%] items-start group">
                                <div class="px-3 py-2 bg-secondary rounded-tl-lg rounded-bl-lg rounded-br-lg relative break-all">
                                    <div class="text-sm leading-relaxed break-all" bind:this={messageElement}>
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
                                <div class="prose prose-sm max-w-none break-all" bind:this={messageElement}>
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
                <!-- svelte-ignore element_invalid_self_closing_tag -->
                <div bind:this={messagesEnd} />
            {/if}
        </div>
    </ScrollArea>

    <div class="backdrop-blur-sm sticky bottom-0">
        <div class="w-full max-w-6xl mx-auto px-4 py-4">
            <form on:submit|preventDefault={handleSubmit} class="space-y-3">
                <!-- Input Container -->
                <div class="relative">
                    <Textarea bind:value={input} onkeydown={handleKeyDown} placeholder={isWebSearchActive ? "Search the web..." : "Message Nell..."} rows={1} disabled={isLoading} class="resize-none h-28 pb-16 relative z-0" style="scroll-padding-bottom: 4rem;" />

                    <div class="absolute left-2 bottom-2 flex items-center gap-1 z-20">
                        <Dialog.Root bind:open={showModelDialog}>
                            <Dialog.Trigger class="flex items-center gap-1.5 focus:outline-none hover:cursor-pointer" title="Change model (currently: {selectedModel.name})">
                                <Button variant="outline" size="icon" disabled={isLoading} class="pointer-events-auto">
                                    <i class="ri-cpu-line"></i>
                                </Button>
                            </Dialog.Trigger>
                            <Dialog.Content class="max-w-md">
                                <Dialog.Header>
                                    <Dialog.Title>Select Model</Dialog.Title>
                                    <Dialog.Description>
                                        Choose the AI model you want to use for your conversations.
                                    </Dialog.Description>
                                </Dialog.Header>

                                <!-- Search Input -->
                                <div class="relative">
                                    <Input bind:value={modelSearchQuery} placeholder="Search models..." type="text" />
                                </div>

                                <!-- Scrollable Models List -->
                                <ScrollArea class="h-[300px] w-full">
                                    <div class="space-y-2">
                                        {#each filteredModels as model}
                                            <div class="flex items-center space-x-3 p-2.5 rounded-md bg-secondary cursor-pointer" class:bg-primary-50={selectedModel.id === model.id} on:click={() => { selectedModel = model; showModelDialog = false; }} on:keydown={(e) => e.key === 'Enter' && (selectedModel = model, showModelDialog = false)} role="button" tabindex="0">
                                                <div class="flex-1">
                                                    <h4 class="font-medium text-sm">{model.name}</h4>
                                                </div>
                                                {#if selectedModel.id === model.id}
                                                    <i class="ri-check-line"></i>
                                                {/if}
                                            </div>
                                        {/each}

                                        {#if filteredModels.length === 0}
                                            <div class="flex items-center justify-center py-8 opacity-50 text-center">
                                                <p>Nell couldn't find the model you're looking for. I think he's a little tired...</p>
                                            </div>
                                        {/if}
                                    </div>
                                </ScrollArea>

                                <Dialog.Footer class="mt-4">
                                    <Dialog.Close>
                                        <Button variant="secondary">Close</Button>
                                    </Dialog.Close>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Root>
                        <Button variant="outline" size="icon" title={isWebSearchActive ? "Disable web search" : "Enable web search"} class={`pointer-events-auto ${isWebSearchActive ? 'bg-secondary' : ''} ${!isWebSearchActive ? 'hover:bg-secondary' : ''}`} onclick={toggleWebSearch} disabled={isLoading}>
                            <i class="ri-search-line"></i>
                        </Button>
                    </div>

                    <div class="absolute right-2 bottom-2 flex items-center gap-1 z-20">
                        <Button type="submit" size="icon" disabled={isLoading || !input.trim()} title="Send message" class="pointer-events-auto">
                            {#if isLoading}
                                <i class="ri-loop-right-line animate-spin"></i>
                            {:else}
                                <i class="ri-arrow-up-line"></i>
                            {/if}
                            <span class="sr-only">Send message</span>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Updates Dialog -->
<Dialog.Root bind:open={showUpdatesDialog}>
    <Dialog.Content class="max-w-2xl max-h-[80vh]">
        <Dialog.Header>
            <Dialog.Title>Updates & Announcements</Dialog.Title>
            <Dialog.Description>
                Latest updates and announcements from the Nell team.
            </Dialog.Description>
        </Dialog.Header>

        <ScrollArea class="h-[400px] w-full">
            <div class="space-y-4">
                {#if updates.length === 0}
                    <div class="text-center py-8 opacity-50">
                        <p>No updates available</p>
                    </div>
                {:else}
                    {#each updates as update}
                        <div class="p-4 rounded-lg bg-secondary">
                            <h4 class="font-medium text-sm mb-2">{update.title}</h4>
                            <div class="text-xs opacity-50 mb-3">
                                {new Date(update.created).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                            <div class="prose prose-sm max-w-none">
                                {@html update.description}
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </ScrollArea>

        <Dialog.Footer class="mt-4">
            <Dialog.Close>
                <Button variant="secondary">Close</Button>
            </Dialog.Close>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

<!-- Chat History Bottom Sheet -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore element_invalid_self_closing_tag -->
<Vault isOpen={showChatHistory} on:close={() => showChatHistory = false}>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Chat History</h3>
            {#if chatHistory.length > 0}
                <Button variant="outline" size="sm" class="text-destructive/70 hover:text-destructive" onclick={deleteAllChats} disabled={isDeletingChat} title="Delete all chats">
                    <i class="ri-delete-bin-line mr-1"></i>
                    Delete All
                </Button>
            {/if}
        </div>

        {#if chatHistory.length === 0}
            <div class="text-center py-8 opacity-50">
                <p>No chat history yet</p>
            </div>
        {:else}
            <div class="space-y-2 max-h-[60vh] overflow-y-auto">
                {#each chatHistory as chat}
                    <div class={`p-3 rounded-lg hover:bg-accent/20 cursor-pointer transition-colors flex justify-between items-center ${currentChatId === chat.id ? 'bg-accent/50' : ''}`} on:click={() => { loadChat(chat.id); showChatHistory = false; }}>
                        <div class="flex-1 min-w-0">
                            <p class="font-medium truncate">{chat.title}</p>
                            <p class="text-xs opacity-50 truncate">{chat.lastMessage}</p>
                        </div>
                        <div class="flex items-center gap-1">
                            <Button variant="outline" size="icon" class="h-8 w-8 text-blue-500/70 hover:text-blue-500" onclick={(e) => { e.stopPropagation(); shareChat(chat.id); }} disabled={isSharingChat} title="Share chat">
                                <i class="ri-share-line" />
                            </Button>
                            <Button variant="outline" size="icon" class="h-8 w-8 text-destructive/70 hover:text-destructive" onclick={(e) => { e.stopPropagation(); deleteChat(chat.id); }} disabled={isDeletingChat} title="Delete chat">
                                <i class="ri-delete-bin-line" />
                            </Button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</Vault>

<!-- Premium Account Required Dialog -->
<Dialog.Root bind:open={showPremiumDialog}>
    <Dialog.Content class="max-w-md">
        <Dialog.Header>
            <Dialog.Title>Premium Account Required</Dialog.Title>
            <Dialog.Description>
                You need to have a Premium account and verify your email address to use this chat feature!
            </Dialog.Description>
        </Dialog.Header>

        <Dialog.Footer class="mt-4 flex gap-2">
            <Dialog.Close>
                <Button variant="secondary">Cancel</Button>
            </Dialog.Close>
            <Button onclick={() => { showPremiumDialog = false; goto('/profile'); }}>
                Go to Profile
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

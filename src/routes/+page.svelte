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
    import { ChatDB, type ChatHistory } from "$lib/db/chatdb";

    const chatDB = new ChatDB();
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
    let currentThinkingMessage = "";
    let thinkingInterval: NodeJS.Timeout | null = null;
    let quickActionsDropdownOpen = false;
    let showChatHistory = false;
    let chatHistory: ChatHistory[] = [];
    let currentChatId: string | null = null;
    let isDeletingChat = false;

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

    onMount(async () => {
        try {
            await chatDB.init();
            await loadChatHistory();
        } catch (error) {
            console.error('Failed to initialize chat database:', error);
        }
    });

    const loadChatHistory = async () => {
        try {
            chatHistory = await chatDB.getChats();
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    };

    const saveCurrentChat = async () => {
        if (messages.length === 0) return;

        try {
            const chatId = currentChatId || chatDB.generateChatId();
            const title = chatDB.generateChatTitle(messages);
            const lastMessage = messages[messages.length - 1]?.content || '';

            const chatData: ChatHistory = {
                id: chatId,
                title,
                messages: [...messages],
                timestamp: Date.now(),
                lastMessage: lastMessage.substring(0, 100)
            };

            await chatDB.saveChat(chatData);
            currentChatId = chatId;
            await loadChatHistory();
        } catch (error) {
            console.error('Failed to save chat:', error);
        }
    };

    const deleteChat = async (chatId: string) => {
        if (!confirm('Are you sure you want to delete this chat?')) return;

        isDeletingChat = true;
        try {
            await chatDB.deleteChat(chatId);
            await loadChatHistory();
            
            if (currentChatId === chatId) {
                startNewChat();
            }
        } catch (error) {
            console.error('Failed to delete chat:', error);
        } finally {
            isDeletingChat = false;
        }
    };

    const deleteAllChats = async () => {
        if (!confirm('Are you sure you want to delete all chat history? This action cannot be undone.')) return;

        isDeletingChat = true;
        try {
            await chatDB.clearAllChats();
            chatHistory = [];
            startNewChat();
        } catch (error) {
            console.error('Failed to delete all chats:', error);
        } finally {
            isDeletingChat = false;
        }
    };

    const loadChat = async (chatId: string) => {
        try {
            const chat = chatHistory.find(c => c.id === chatId);
            if (chat) {
                messages = [...chat.messages];
                currentChatId = chatId;
                showChatHistory = false;
                
                setTimeout(() => {
                    messagesEnd?.scrollIntoView({ behavior: 'smooth' });
                }, 200);
            }
        } catch (error) {
            console.error('Failed to load chat:', error);
        }
    };

    const handleSubmit = async () => {
        if (!input.trim() || isLoading) return;

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
                    messages: messages.slice(0, -1)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const data = await response.json();

            stopThinkingAnimation();
            messages = [...messages.slice(0, -1), { role: 'assistant', content: data.choices[0].message.content }];
            
            await saveCurrentChat();
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
                    messages: messages.slice(0, -1)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const data = await response.json();

            stopThinkingAnimation();
            messages = [...messages.slice(0, -1), { role: 'assistant', content: data.choices[0].message.content }];
            
            await saveCurrentChat();
        } catch (e) {
            stopThinkingAnimation();
            const errorMessage = 'An error occurred while processing your message.';
            messages = [...messages.slice(0, -1), { role: 'error', content: errorMessage }];
            console.error('Error:', e);
        } finally {
            isLoading = false;
        }
    };

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

    $: if (messages.length > 0) {
        setTimeout(() => {
            messagesEnd?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    const startNewChat = () => {
        stopThinkingAnimation();
        messages = [];
        currentChatId = null;
        input = '';
        error = null;
        isLoading = false;
        showChatHistory = false;
    };

    const defaultPrompts = [
        { title: "Explain a complex topic", prompt: "Explain quantum computing in simple terms" },
        { title: "Write code", prompt: "Write a Python function to calculate fibonacci numbers" },
        { title: "Creative writing", prompt: "Write a short story about a time traveler" },
        { title: "Problem solving", prompt: "Help me organize my daily schedule" }
    ];
</script>

<div class="flex flex-col h-screen w-full">
    <!-- Messages Area -->
    <ScrollArea class="flex-1 overflow-auto">
        <div class="w-full max-w-6xl mx-auto px-4 py-4 space-y-4">
            <!-- Desktop/Tablet: Inline buttons -->
            <div class="hidden md:flex justify-center gap-2 mb-4">
                <Button variant="outline" size="sm" onclick={startNewChat}>
                    <i class="ri-add-line"></i>
                    New Chat
                </Button>
                <Button variant="outline" size="sm" onclick={() => { showChatHistory = true; loadChatHistory(); }}>
                    <i class="ri-history-line"></i>
                    History
                </Button>
                <Button variant="outline" size="sm" onclick={() => goto('/terms')}>
                    <i class="ri-file-text-line"></i>
                    Terms
                </Button>
                <Button variant="outline" size="sm" onclick={() => goto('/privacy')}>
                    <i class="ri-shield-check-line"></i>
                    Privacy
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
                        <DropdownMenu.Item onclick={startNewChat}>
                            <i class="ri-add-line mr-2"></i>
                            New Chat
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onclick={() => { showChatHistory = true; loadChatHistory(); }}>
                            <i class="ri-history-line mr-2"></i>
                            History
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onclick={() => goto('/terms')}>
                            <i class="ri-file-text-line mr-2"></i>
                            Terms
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onclick={() => goto('/privacy')}>
                            <i class="ri-shield-check-line mr-2"></i>
                            Privacy
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
            {#if messages.length === 0}
            <div class="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                <img src="https://www.upload.ee/image/18296072/nell-mascot-whitee.png" alt="Nell Logo" class="w-16 mb-4" />
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

<!-- Chat History Vault -->
<Vault bind:isOpen={showChatHistory} on:close={() => showChatHistory = false}>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Chat History</h3>
        </div>

        <div class="flex items-center justify-between mb-4">
            <div class="text-sm opacity-50">
                {chatHistory.length} conversation{chatHistory.length !== 1 ? 's' : ''} found
            </div>
            {#if chatHistory.length > 0}
                <Button variant="outline" size="sm" class="text-destructive hover:text-destructive" onclick={deleteAllChats} disabled={isDeletingChat}>
                    <i class="ri-delete-bin-line mr-2"></i>
                    Delete All
                </Button>
            {/if}
        </div>

        <ScrollArea class="h-[300px] w-full">
            <div class="space-y-2">
                {#if chatHistory.length === 0}
                    <div class="text-center py-8 opacity-50">
                        <i class="ri-message-3-line text-4xl mb-4"></i>
                        <p>No chat history yet</p>
                        <p class="text-sm">Start a conversation to see your history here</p>
                    </div>
                {:else}
                    {#each chatHistory as chat}
                        <div class="p-4 rounded-lg cursor-pointer bg-secondary/50 transition-all hover:bg-secondary" on:click={() => loadChat(chat.id)} on:keydown={(e) => e.key === 'Enter' && loadChat(chat.id)} role="button" tabindex="0">
                            <div class="flex items-start justify-between">
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-1">
                                        <h4 class="font-medium text-sm truncate">{chat.title}</h4>
                                    </div>
                                    <p class="text-xs text-muted-foreground truncate mb-2">{chat.lastMessage}</p>
                                    <div class="flex items-center gap-2 text-xs text-muted-foreground">
                                        <i class="ri-time-line"></i>
                                        {new Date(chat.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        <span class="mx-1">•</span>
                                        <i class="ri-message-2-line"></i>
                                        {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                <div class="flex items-center gap-1 ml-2">
                                    {#if currentChatId === chat.id}
                                        <div class="px-2 py-1 rounded-full bg-secondary text-xs">
                                            Current
                                        </div>
                                    {/if}
                                    <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive/70 hover:text-destructive" 
                                            onclick={(e) => { e.stopPropagation(); deleteChat(chat.id); }} 
                                            disabled={isDeletingChat} 
                                            title="Delete chat">
                                        <i class="ri-delete-bin-line"></i>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </ScrollArea>
    </div>
</Vault>
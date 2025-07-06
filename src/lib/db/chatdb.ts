export interface ChatHistory {
    id: string;
    title: string;
    messages: Array<{role: string, content: string}>;
    timestamp: number;
    lastMessage: string;
}

export class ChatDB {
    private dbName = 'NellDB';
    private version = 1;
    private db: IDBDatabase | null = null;

    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                
                if (!db.objectStoreNames.contains('chats')) {
                    const store = db.createObjectStore('chats', { keyPath: 'id' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    async saveChat(chatData: ChatHistory): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['chats'], 'readwrite');
            const store = transaction.objectStore('chats');
            const request = store.put(chatData);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async getChats(): Promise<ChatHistory[]> {
        if (!this.db) throw new Error('Database not initialized');
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['chats'], 'readonly');
            const store = transaction.objectStore('chats');
            const index = store.index('timestamp');
            const request = index.openCursor(null, 'prev');
            
            const chats: ChatHistory[] = [];
            
            request.onerror = () => reject(request.error);
            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor) {
                    chats.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(chats);
                }
            };
        });
    }

    async deleteChat(chatId: string): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['chats'], 'readwrite');
            const store = transaction.objectStore('chats');
            const request = store.delete(chatId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async clearAllChats(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['chats'], 'readwrite');
            const store = transaction.objectStore('chats');
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    generateChatId(): string {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateChatTitle(messages: Array<{role: string, content: string}>): string {
        const firstUserMessage = messages.find(msg => msg.role === 'user');
        if (firstUserMessage) {
            const title = firstUserMessage.content.substring(0, 50);
            return title.length < firstUserMessage.content.length ? title + '...' : title;
        }
        return 'New Chat';
    }
}

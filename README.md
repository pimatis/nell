# Nell

A modern, anonymous AI chat platform that provides unified access to multiple AI providers through a single interface. Built with SvelteKit and TailwindCSS, offering a seamless and privacy-focused experience for AI interactions with local chat management and no data collection.

## 🚀 Features

### Core Features
- **Multi-AI Provider Support**: Access to GPT-4, Claude 3.5, Gemini, DeepSeek, and more through a unified interface
- **Anonymous Usage**: No account creation or personal data collection required
- **Real-time Chat Interface**: Modern chat UI with markdown support and local message history
- **Local Data Storage**: All chat history stored locally in your browser using IndexedDB
- **Web Search Integration**: Enhanced AI responses with web search capabilities
- **Model Selection**: Choose from multiple AI models for different tasks
- **Responsive Design**: Mobile-first design that works on all devices

### Privacy Features
- **Complete Anonymity**: No user registration, email collection, or personal data storage
- **Local Storage Only**: Chat history never leaves your browser
- **No Tracking**: Minimal analytics, no personal identifiers
- **GDPR Compliant**: Privacy by design with no data collection

### Technical Features
- **Modern Tech Stack**: SvelteKit, TypeScript, TailwindCSS
- **Client-Side Database**: IndexedDB for local chat storage
- **UI Components**: shadcn/ui components adapted for Svelte
- **Real-time Processing**: Direct API communication with AI providers
- **Rate Limiting**: Built-in API rate limiting

## 🛠️ Technology Stack

- **Frontend**: SvelteKit, TypeScript, TailwindCSS
- **Data Storage**: IndexedDB (client-side only)
- **AI Integration**: Multiple AI provider APIs
- **Styling**: TailwindCSS with shadcn/ui components
- **Icons**: Lucide Icons, Remix Icons
- **Build Tool**: Vite
- **Package Manager**: Bun/npm/yarn

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **bun** (package manager)
- **Git** (for version control)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/pimatis/nell.git
cd nell
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using bun:
```bash
bun install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and configure the following environment variables:

```env
VITE_APP_API_KEY=your_api_key_here
VITE_APP_API_URL=https://api.example.com
```

**Note**: This project is designed to work without server-side configuration. All chat data is stored locally in your browser.

### 4. Setup Complete

That's it! No database setup, no backend configuration, no external services required. The application works completely client-side with local storage.

## 🚀 Development

### Start the Development Server

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

## 🔑 Key Features Explanation

### Anonymous AI Chat Platform
The platform provides access to multiple AI providers without requiring any personal information:
- GPT-4 variants (GPT-4, GPT-4o, GPT-4o Mini)
- Claude models (Claude 3.5 Sonnet, Claude 3.5 Haiku)
- Google Gemini models
- DeepSeek models
- And more...

### Privacy-First Design
- **No Account Required**: Start chatting immediately without registration
- **Local Storage Only**: All chat history stored in your browser's IndexedDB
- **No Data Collection**: Zero personal information collected or stored
- **Anonymous Usage**: No tracking, no analytics of personal data

### Chat Management
- **Local Chat History**: Save and manage conversations locally
- **Chat Organization**: Organize conversations with automatic titles
- **Export/Import**: Full control over your chat data
- **Cross-Session Persistence**: Chat history persists across browser sessions

### Web Search Integration
- **Enhanced Responses**: AI responses enhanced with real-time web search
- **Current Information**: Get up-to-date information from the web
- **Seamless Integration**: Toggle web search on/off per conversation

## 🌐 API Endpoints

### Chat API
- `POST /api/chat` - Process chat messages with AI providers

### Static Pages
- `/` - Main chat interface
- `/privacy` - Privacy policy
- `/terms` - Terms of service

**Note**: This is a client-side application with minimal server-side API endpoints. Most functionality is handled in the browser.

## 🚀 Deployment

### Build for Production

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

### Deployment Options

The project uses `@sveltejs/adapter-auto` which automatically detects your deployment environment. It supports:

- **Vercel** (recommended)
- **Netlify**
- **Cloudflare Pages**
- **GitHub Pages**
- **Any static hosting service**

**Note**: Since this is a client-side application, it can be deployed to any static hosting service. No server-side configuration is required.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please:
- Open an issue on GitHub
- Visit our website for documentation
- Check the privacy policy and terms of service for more information

## 🙏 Acknowledgments

- Built with [SvelteKit](https://kit.svelte.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/) and [Remix Icon](https://remixicon.com/)
- Privacy-first design inspired by modern web standards
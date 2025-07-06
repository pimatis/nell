# Nell

A modern, full-stack AI chat platform that provides unified access to multiple AI providers through a single interface. Built with SvelteKit, TailwindCSS, and PocketBase, offering a seamless experience for AI interactions with features like chat management, user authentication, and subscription handling.

## 🚀 Features

### Core Features
- **Multi-AI Provider Support**: Access to GPT-4, Claude 3.5, Gemini, DeepSeek, and more through a unified interface
- **Real-time Chat Interface**: Modern chat UI with markdown support and message history
- **User Authentication**: Complete auth system with registration, login, and profile management
- **Subscription Management**: Integrated payment system with Polar.sh for premium features
- **Chat History**: Save, manage, and share chat conversations
- **Responsive Design**: Mobile-first design that works on all devices

### Technical Features
- **Modern Tech Stack**: SvelteKit 2.0, TypeScript, TailwindCSS 4.0
- **Database**: PocketBase for backend services
- **UI Components**: shadcn/ui components adapted for Svelte
- **Analytics**: PostHog integration for user analytics
- **Email Service**: Resend integration for transactional emails
- **Rate Limiting**: Built-in API rate limiting

## 🛠️ Technology Stack

- **Frontend**: SvelteKit 2.0, TypeScript, TailwindCSS 4.0
- **Backend**: PocketBase, Node.js API routes
- **Database**: PocketBase (SQLite-based)
- **Authentication**: PocketBase Auth
- **Payments**: Polar.sh
- **Analytics**: PostHog
- **Email**: Resend
- **Styling**: TailwindCSS with shadcn/ui components
- **Icons**: Lucide Icons, Remix Icons

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
# PocketBase Configuration
VITE_APP_PBURL=your_pocketbase_url

# API Configuration
VITE_APP_API_URL=your_api_endpoint

# Polar.sh Configuration (for payments)
VITE_APP_POLARSH_URL=https://sandbox-api.polar.sh
VITE_APP_ORGANIZATION_ID=your_polar_organization_id
VITE_APP_POLAR_KEY=your_polar_api_key
VITE_APP_POLAR_URL=https://sandbox-api.polar.sh

# Resend Configuration (for emails)
VITE_APP_RESEND_KEY=your_resend_api_key

# PostHog Configuration (for analytics)
VITE_APP_POSTHOG_KEY=your_posthog_key
```

### 4. Database Setup

This project uses PocketBase as the backend. You'll need to:

1. Set up a PocketBase instance (locally or hosted)
2. Configure the database collections for users, chats, and subscriptions
3. Update the `VITE_APP_PBURL` in your `.env` file

## 🚀 Development

### Start the Development Server

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

## 🔑 Key Features Explanation

### AI Provider Integration
The platform supports multiple AI providers through a unified API:
- GPT-4 variants (GPT-4, GPT-4o, GPT-4o Mini)
- Claude models (Claude 3.5 Sonnet, Claude 3.5 Haiku)
- Google Gemini models
- DeepSeek models
- And more...

### Authentication System
- User registration and login
- Email verification
- Password reset functionality
- Profile management
- Session management

### Subscription Management
- Integration with Polar.sh for payments
- Free and premium tiers
- Usage tracking and limits
- Subscription status management

### Chat Features
- Real-time messaging interface
- Message history and persistence
- Chat sharing functionality
- Markdown rendering support
- Multiple model selection

## 🌐 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/logout` - User logout
- `GET /api/user/valid` - Check auth status

### Chat Management
- `POST /api/chat` - Create new chat
- `GET /api/chat/[id]` - Get chat by ID
- `POST /api/chat/[id]/share` - Share chat

### User Management
- `GET /api/user/info` - Get user profile
- `POST /api/user/delete` - Delete account
- `POST /api/user/password/reset` - Reset password

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

- **Vercel**
- **Netlify**
- **Cloudflare Pages**
- **Node.js**
- **Static hosting**

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
- Contact the development team

## 🙏 Acknowledgments

- Built with [SvelteKit](https://kit.svelte.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/) and [Remix Icon](https://remixicon.com/)
- Backend powered by [PocketBase](https://pocketbase.io/)
- Payment processing by [Polar.sh](https://polar.sh/)
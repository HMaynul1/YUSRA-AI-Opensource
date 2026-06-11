# YUSRA AI – Open-Source Multilingual PWA Chat

A completely open-source, self-hosted PWA chat application with support for 10+ AI APIs, voice capabilities, NeonDB, Cloudinary storage, and Vercel deployment.

## ✨ Features

### Core Chat Experience
- **Mobile-first PWA** with installable "Add to Home Screen"
- **Three themes**: Dark (gradient), Light, AMOLED
- **Multilingual**: English, Bengali (BN), Arabic (AR) with RTL support
- **Chat modes**: Chat, Creative, Expert
- **Message actions**: Copy, like, timestamps
- **Auto-scroll** to latest messages

### AI & Voice
- **10+ AI Models**:
  - OpenAI (GPT-4, GPT-3.5)
  - Google Gemini
  - Anthropic Claude
  - Mistral
  - Groq
  - Cohere
  - Perplexity
  - Together AI
  - HuggingFace
  - DeepSeek
- **Web Speech API** for voice input
- **Whisper STT** for speech-to-text
- **Dynamic model selector**

### Backend
- **Express.js** server
- **Prisma ORM** with PostgreSQL (NeonDB)
- **JWT authentication**
- **Admin panel** with stats and config management
- **Cloudinary** integration for media storage

### Deployment
- **Vercel** hosting (free tier)
- **NeonDB** PostgreSQL (free tier)
- **Cloudinary** media storage (free tier)
- **GitHub** integration with auto-deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- PostgreSQL database (NeonDB recommended)
- AI API keys (OpenAI, Gemini, etc.)
- Cloudinary account

### Installation

```bash
# Clone repository
git clone https://github.com/HMaynul1/YUSRA-AI.git
cd yusra-ai-opensource

# Install dependencies
pnpm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
# - DATABASE_URL (NeonDB)
# - AI API keys
# - Cloudinary credentials
# - JWT_SECRET

# Setup database
pnpm db:push

# Start development
pnpm dev
```

Visit:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname"

# JWT
JWT_SECRET="your-secret-key"

# AI API Keys (add at least one)
OPENAI_API_KEY="sk-..."
GEMINI_API_KEY="AIzaSy..."
ANTHROPIC_API_KEY="sk-ant-..."
MISTRAL_API_KEY="..."
GROQ_API_KEY="gsk_..."
COHERE_API_KEY="..."
PERPLEXITY_API_KEY="pplx-..."
TOGETHER_API_KEY="..."
HUGGINGFACE_API_KEY="hf_..."
DEEPSEEK_API_KEY="..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Whisper (OpenAI)
WHISPER_API_KEY="sk-..."

# App
NODE_ENV="development"
PORT="3000"
FRONTEND_URL="http://localhost:5173"

# Creator Info
CREATOR_NAME="Mohammad Maynul Hasan Shaon"
YUSRA_BACKSTORY="I am YUSRA, a virtual clone of Ezreen Al YUSRA, daughter of Mohammad Maynul Hasan Shaon."
```

## 📁 Project Structure

```
yusra-ai-opensource/
├── server/
│   ├── index.ts              # Express server
│   ├── middleware/
│   │   └── auth.ts           # JWT authentication
│   ├── routes/
│   │   ├── auth.ts           # Login/register
│   │   ├── chat.ts           # Chat sessions & messages
│   │   ├── ai.ts             # AI providers & transcription
│   │   └── admin.ts          # Admin stats & config
│   └── services/
│       ├── aiProvider.ts     # 10+ AI provider integration
│       └── cloudinary.ts     # Media storage
├── src/
│   ├── pages/
│   │   ├── LoginPage.tsx     # Auth UI
│   │   ├── ChatPage.tsx      # Main chat interface
│   │   └── AdminPage.tsx     # Admin panel
│   ├── store/
│   │   └── useAppStore.ts    # Zustand state management
│   ├── lib/
│   │   ├── i18n.ts           # Multilingual strings
│   │   └── api.ts            # API client
│   ├── App.tsx               # Router
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── prisma/
│   └── schema.prisma         # Database schema
├── public/
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
├── .env.example              # Environment template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🗄️ Database Schema

**Users**
- id, email, password, name, role, createdAt, updatedAt

**ChatSessions**
- id, userId, title, mode, language, model, createdAt, updatedAt

**Messages**
- id, sessionId, userId, role, content, model, liked, createdAt

**AppConfig**
- id, key, value, updatedAt

## 🔐 Authentication

JWT-based authentication with bcrypt password hashing.

- **Register**: Create new account
- **Login**: Get JWT token
- **Protected routes**: Require valid token in Authorization header

## 🚢 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit: YUSRA AI open-source"
git push origin main
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use Vercel Dashboard:
1. Go to [Vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Select your GitHub repository
4. Add environment variables
5. Deploy

### 3. Setup NeonDB

1. Go to [NeonDB.io](https://neon.tech)
2. Create new PostgreSQL database
3. Copy connection string
4. Add to Vercel environment: `DATABASE_URL`
5. Run migrations: `pnpm db:push`

### 4. Setup Cloudinary

1. Go to [Cloudinary.com](https://cloudinary.com)
2. Create account and get credentials
3. Add to Vercel environment:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test --watch
```

## 📚 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Chat
- `POST /api/chat/sessions` - Create session
- `GET /api/chat/sessions` - List sessions
- `GET /api/chat/sessions/:id/messages` - Get messages
- `POST /api/chat/sessions/:id/messages` - Send message
- `DELETE /api/chat/sessions/:id` - Delete session
- `POST /api/chat/messages/:id/like` - Like message

### AI
- `GET /api/ai/providers` - List available providers
- `GET /api/ai/models` - List available models
- `POST /api/ai/transcribe` - Transcribe audio

### Admin
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/config` - Get configuration
- `POST /api/admin/config` - Update configuration
- `GET /api/admin/users` - List users
- `POST /api/admin/users/:id/role` - Update user role

## 🎨 Customization

### Add New AI Provider

Edit `server/services/aiProvider.ts`:

```typescript
case 'newprovider':
  return this.newproviderChat(apiKey, messages, model, temperature)

private async newproviderChat(...): Promise<string> {
  // Implementation
}
```

### Change Themes

Edit `src/index.css` CSS variables for each theme.

### Add New Language

Edit `src/lib/i18n.ts` and add language object.

## 📱 PWA Installation

### iOS
1. Open in Safari
2. Tap Share → Add to Home Screen
3. Name and add

### Android
1. Open in Chrome
2. Tap ⋮ → Install app
3. Confirm

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 👤 Creator

**Mohammad Maynul Hasan Shaon**

YUSRA AI is a virtual clone of Ezreen Al YUSRA, his daughter.

---

**Status**: Production-ready ✅
**Last Updated**: 2026-06-11
**Version**: 1.0.0

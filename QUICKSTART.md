# YUSRA AI – Quick Start Guide

## 🎯 5-Minute Setup

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/HMaynul1/YUSRA-AI-Opensource.git
cd yusra-ai-opensource

# 2. Install dependencies
pnpm install

# 3. Create .env file
cp .env.example .env

# 4. Add your API keys to .env
# At minimum:
# - DATABASE_URL (from NeonDB)
# - JWT_SECRET (any random string)
# - OPENAI_API_KEY (or another AI provider)
# - Cloudinary credentials

# 5. Setup database
pnpm db:push

# 6. Start development
pnpm dev
```

Visit:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

---

## ☁️ Deploy to Vercel (3 Steps)

### Step 1: Prepare Credentials

Get these before deploying:

1. **Database**: [neon.tech](https://neon.tech) → Create PostgreSQL → Copy connection string
2. **Cloudinary**: [cloudinary.com](https://cloudinary.com) → Get Cloud Name, API Key, API Secret
3. **AI API Key**: Choose ONE:
   - OpenAI: [platform.openai.com](https://platform.openai.com)
   - Gemini: [makersuite.google.com](https://makersuite.google.com)
   - Claude: [console.anthropic.com](https://console.anthropic.com)
   - Or any of: Mistral, Groq, Cohere, Perplexity, Together, HuggingFace, DeepSeek

### Step 2: Deploy

```bash
# Option A: Using Vercel CLI
npm i -g vercel
vercel

# Option B: Using Vercel Dashboard
# 1. Go to vercel.com
# 2. Click "Add New Project"
# 3. Select HMaynul1/YUSRA-AI-Opensource
# 4. Add environment variables (see VERCEL_SETUP.md)
# 5. Click Deploy
```

### Step 3: Setup Database

```bash
# After Vercel deployment succeeds
DATABASE_URL="your-neon-url" npx prisma db push
```

---

## 🔑 Essential Environment Variables

**Minimum required** to get started:

```env
# Database (Required)
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-random-secret-key

# AI API (Choose ONE)
OPENAI_API_KEY=sk-proj-...
# OR
GEMINI_API_KEY=AIzaSy...
# OR
ANTHROPIC_API_KEY=sk-ant-...

# Cloudinary (Required)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Optional** (for advanced features):

```env
WHISPER_API_KEY=sk-proj-...    # For voice transcription
MISTRAL_API_KEY=...             # Additional AI provider
GROQ_API_KEY=gsk_...            # Additional AI provider
# ... more AI providers
```

---

## 🧪 Test Your Deployment

1. **Visit your Vercel URL**
2. **Register a new account**
3. **Send a message** (should get AI response)
4. **Try voice input** (click 🎤 button)
5. **Change theme** (settings ⚙️)
6. **Switch language** (EN/BN/AR)
7. **Select different AI model** (footer dropdown)

---

## 📁 Project Structure

```
yusra-ai-opensource/
├── server/              # Express backend
│   ├── routes/         # API endpoints
│   └── services/       # AI & Cloudinary
├── src/                # React frontend
│   ├── pages/          # Chat & Admin
│   └── lib/            # i18n & API client
├── prisma/             # Database schema
├── public/             # PWA manifest & service worker
├── .env.example        # Environment template
├── README.md           # Full documentation
├── DEPLOYMENT_GUIDE.md # Detailed deployment
└── VERCEL_SETUP.md     # Vercel-specific setup
```

---

## 🚀 Features Overview

### Chat
- ✅ Real-time messaging
- ✅ 10+ AI models
- ✅ Chat history
- ✅ Multiple chat modes (Chat, Creative, Expert)

### Voice
- ✅ Web Speech API input
- ✅ Whisper STT transcription
- ✅ Multilingual support (EN/BN/AR)

### UI
- ✅ 3 themes (Dark, Light, AMOLED)
- ✅ Mobile-first PWA
- ✅ Settings drawer
- ✅ Admin panel

### Storage
- ✅ PostgreSQL (NeonDB)
- ✅ Cloudinary media
- ✅ Chat persistence

---

## 🆘 Common Issues

**"Database connection failed"**
- Check `DATABASE_URL` is correct
- Verify NeonDB project is active
- Run `npx prisma db push`

**"AI model not working"**
- Verify API key is correct
- Check API key has credits
- Try a different provider

**"Voice input not working"**
- Ensure HTTPS is enabled
- Check browser supports Web Speech API
- Verify `WHISPER_API_KEY` is set

**"Build failed on Vercel"**
- Check build logs
- Ensure all required env vars are set
- Try redeploying

---

## 📚 Next Steps

1. **Read full README.md** for complete documentation
2. **Read DEPLOYMENT_GUIDE.md** for detailed setup
3. **Read VERCEL_SETUP.md** for Vercel-specific instructions
4. **Customize** system prompt in admin panel
5. **Add custom domain** (optional)

---

## 🔗 Useful Links

- **Repository**: https://github.com/HMaynul1/YUSRA-AI-Opensource
- **Vercel**: https://vercel.com
- **NeonDB**: https://neon.tech
- **Cloudinary**: https://cloudinary.com
- **OpenAI**: https://platform.openai.com
- **Google Gemini**: https://makersuite.google.com

---

**Ready to deploy?** Start with Step 1 above! 🚀

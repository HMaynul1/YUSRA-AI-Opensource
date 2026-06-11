# YUSRA AI – Complete Deployment Guide

## Step 1: Push to GitHub

### Using GitHub CLI

```bash
# Clone the repo
git clone https://github.com/HMaynul1/YUSRA-AI-Opensource.git
cd yusra-ai-opensource

# Push to GitHub
git push -u origin main
```

### Or Create New Repository

```bash
# Create new repo on GitHub
gh repo create YUSRA-AI-Opensource --private --source=. --remote=origin --push
```

## Step 2: Setup NeonDB (PostgreSQL)

1. **Go to [neon.tech](https://neon.tech)**
2. **Sign up** with GitHub
3. **Create new project**
4. **Copy connection string** (looks like: `postgresql://user:password@host/dbname`)
5. **Save for Vercel environment variables**

## Step 3: Setup Cloudinary

1. **Go to [cloudinary.com](https://cloudinary.com)**
2. **Sign up** (free tier available)
3. **Get credentials**:
   - Cloud Name
   - API Key
   - API Secret
4. **Save for Vercel environment variables**

## Step 4: Get AI API Keys

Add at least ONE of these (or multiple for more options):

### OpenAI
- Go to [platform.openai.com](https://platform.openai.com)
- Create API key
- Copy `OPENAI_API_KEY`

### Google Gemini
- Go to [makersuite.google.com](https://makersuite.google.com)
- Create API key
- Copy `GEMINI_API_KEY`

### Anthropic Claude
- Go to [console.anthropic.com](https://console.anthropic.com)
- Create API key
- Copy `ANTHROPIC_API_KEY`

### Other Providers
- **Mistral**: [console.mistral.ai](https://console.mistral.ai)
- **Groq**: [console.groq.com](https://console.groq.com)
- **Cohere**: [dashboard.cohere.ai](https://dashboard.cohere.ai)
- **Perplexity**: [www.perplexity.ai](https://www.perplexity.ai)
- **Together AI**: [www.together.ai](https://www.together.ai)
- **HuggingFace**: [huggingface.co](https://huggingface.co)
- **DeepSeek**: [platform.deepseek.com](https://platform.deepseek.com)

## Step 5: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and add environment variables
```

### Option B: Using Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "Add New Project"**
4. **Select `HMaynul1/YUSRA-AI-Opensource` repository**
5. **Configure project**:
   - Framework: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
6. **Add Environment Variables**:

```
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-super-secret-key-change-this
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIzaSy...
ANTHROPIC_API_KEY=sk-ant-...
MISTRAL_API_KEY=...
GROQ_API_KEY=gsk_...
COHERE_API_KEY=...
PERPLEXITY_API_KEY=pplx-...
TOGETHER_API_KEY=...
HUGGINGFACE_API_KEY=hf_...
DEEPSEEK_API_KEY=...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
WHISPER_API_KEY=sk-...
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-vercel-url.vercel.app
```

7. **Click "Deploy"**
8. **Wait for build to complete** (2-5 minutes)

## Step 6: Setup Database

After deployment:

```bash
# Install Prisma CLI
npm i -g prisma

# Run migrations
DATABASE_URL="your-neon-connection-string" npx prisma db push

# Optionally open Prisma Studio
npx prisma studio
```

Or use Vercel's deployment logs to run migrations.

## Step 7: Verify Deployment

1. **Visit your Vercel URL**: `https://your-project.vercel.app`
2. **Register a new account**
3. **Test chat functionality**
4. **Try different AI models**
5. **Test voice input**
6. **Access admin panel** (if admin user)

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (NeonDB) |
| `JWT_SECRET` | ✅ | Random secret for JWT signing |
| `OPENAI_API_KEY` | ❌ | OpenAI API key |
| `GEMINI_API_KEY` | ❌ | Google Gemini API key |
| `ANTHROPIC_API_KEY` | ❌ | Anthropic Claude API key |
| `MISTRAL_API_KEY` | ❌ | Mistral API key |
| `GROQ_API_KEY` | ❌ | Groq API key |
| `COHERE_API_KEY` | ❌ | Cohere API key |
| `PERPLEXITY_API_KEY` | ❌ | Perplexity API key |
| `TOGETHER_API_KEY` | ❌ | Together AI API key |
| `HUGGINGFACE_API_KEY` | ❌ | HuggingFace API key |
| `DEEPSEEK_API_KEY` | ❌ | DeepSeek API key |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `WHISPER_API_KEY` | ❌ | OpenAI Whisper API key (for voice) |
| `NODE_ENV` | ✅ | Set to `production` |
| `PORT` | ✅ | Set to `3000` |
| `FRONTEND_URL` | ✅ | Your Vercel deployment URL |

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all required environment variables are set
- Verify `DATABASE_URL` format is correct

### Database Connection Error
- Verify NeonDB connection string
- Check that database exists
- Run `npx prisma db push` to create tables

### AI Models Not Working
- Verify API keys are correct
- Check API key has sufficient credits
- Try a different provider

### Voice Input Not Working
- Ensure HTTPS is enabled (Vercel provides this)
- Check browser supports Web Speech API
- Verify `WHISPER_API_KEY` is set for STT

### Cloudinary Upload Fails
- Verify Cloudinary credentials
- Check cloud name is correct
- Ensure API key has upload permissions

## Custom Domain

To use a custom domain:

1. **In Vercel Dashboard**:
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update DNS Records**:
   - Add CNAME record pointing to Vercel
   - Wait for DNS propagation (24-48 hours)

3. **Update `FRONTEND_URL`**:
   - Change environment variable to your custom domain
   - Redeploy

## Local Development

```bash
# Install dependencies
pnpm install

# Create .env file
cp .env.example .env

# Update .env with your credentials

# Setup database
pnpm db:push

# Start development
pnpm dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

## Monitoring & Maintenance

### Vercel Dashboard
- Monitor deployments
- Check build logs
- View analytics
- Manage environment variables

### NeonDB Console
- Monitor database usage
- View query performance
- Manage backups
- Check connection logs

### Cloudinary Dashboard
- Monitor storage usage
- View upload/download stats
- Manage API keys
- Check bandwidth

## Support

For issues:
- Check [Vercel Docs](https://vercel.com/docs)
- Check [NeonDB Docs](https://neon.tech/docs)
- Check [Cloudinary Docs](https://cloudinary.com/documentation)
- Check [Prisma Docs](https://www.prisma.io/docs)

---

**Deployment Status**: Ready for production ✅
**Last Updated**: 2026-06-11

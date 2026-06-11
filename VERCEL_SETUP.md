# YUSRA AI – Vercel Deployment Setup

## 🚀 Quick Deploy to Vercel

### Step 1: Go to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub (use account: `Hmaynul1`)
3. Click **"Add New Project"**

### Step 2: Import Repository

1. Select **`HMaynul1/YUSRA-AI-Opensource`**
2. Click **"Import"**

### Step 3: Configure Project

**Build Settings:**
- Framework: **Vite**
- Build Command: **`pnpm build`**
- Output Directory: **`dist`**
- Install Command: **`pnpm install`**

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add ALL of these:

#### Database (Required)
```
DATABASE_URL = postgresql://user:password@host/dbname
JWT_SECRET = your-random-secret-key-min-32-chars
```

#### AI API Keys (Add at least ONE)

**OpenAI** (Recommended for beginners)
```
OPENAI_API_KEY = sk-proj-...
WHISPER_API_KEY = sk-proj-...
```

**Google Gemini**
```
GEMINI_API_KEY = AIzaSy...
```

**Anthropic Claude**
```
ANTHROPIC_API_KEY = sk-ant-...
```

**Mistral**
```
MISTRAL_API_KEY = ...
```

**Groq**
```
GROQ_API_KEY = gsk_...
```

**Cohere**
```
COHERE_API_KEY = ...
```

**Perplexity**
```
PERPLEXITY_API_KEY = pplx-...
```

**Together AI**
```
TOGETHER_API_KEY = ...
```

**HuggingFace**
```
HUGGINGFACE_API_KEY = hf_...
```

**DeepSeek**
```
DEEPSEEK_API_KEY = ...
```

#### Cloudinary (Required)
```
CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret
```

#### App Config (Optional)
```
NODE_ENV = production
PORT = 3000
FRONTEND_URL = https://your-project.vercel.app
```

### Step 5: Deploy

Click **"Deploy"** and wait for the build to complete (2-5 minutes).

---

## 📋 Environment Variables Checklist

Before deploying, gather these credentials:

### 1. NeonDB PostgreSQL
- [ ] Create account at [neon.tech](https://neon.tech)
- [ ] Create new project
- [ ] Copy connection string
- [ ] Format: `postgresql://user:password@host/dbname`

### 2. Cloudinary
- [ ] Create account at [cloudinary.com](https://cloudinary.com)
- [ ] Get Cloud Name
- [ ] Get API Key
- [ ] Get API Secret

### 3. AI API Keys (Choose at least ONE)

**OpenAI** (Best for beginners)
- [ ] Go to [platform.openai.com](https://platform.openai.com)
- [ ] Create API key
- [ ] Copy `OPENAI_API_KEY`
- [ ] (Optional) Copy `WHISPER_API_KEY` for voice

**Google Gemini**
- [ ] Go to [makersuite.google.com](https://makersuite.google.com)
- [ ] Create API key
- [ ] Copy `GEMINI_API_KEY`

**Anthropic Claude**
- [ ] Go to [console.anthropic.com](https://console.anthropic.com)
- [ ] Create API key
- [ ] Copy `ANTHROPIC_API_KEY`

**Other Providers** (Optional)
- [ ] Mistral: [console.mistral.ai](https://console.mistral.ai)
- [ ] Groq: [console.groq.com](https://console.groq.com)
- [ ] Cohere: [dashboard.cohere.ai](https://dashboard.cohere.ai)
- [ ] Perplexity: [www.perplexity.ai](https://www.perplexity.ai)
- [ ] Together: [www.together.ai](https://www.together.ai)
- [ ] HuggingFace: [huggingface.co](https://huggingface.co)
- [ ] DeepSeek: [platform.deepseek.com](https://platform.deepseek.com)

---

## 🔧 Post-Deployment Setup

After Vercel deployment succeeds:

### 1. Setup Database

```bash
# Install Prisma CLI
npm i -g prisma

# Run migrations
DATABASE_URL="your-neon-connection-string" npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

### 2. Create Admin User

1. Visit your Vercel URL
2. Register a new account
3. Access database and update user role to `admin`:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 3. Test Functionality

- [ ] Register new account
- [ ] Send a chat message
- [ ] Select different AI model
- [ ] Try voice input
- [ ] Access admin panel
- [ ] Test different themes
- [ ] Test multilingual (EN/BN/AR)

---

## 🎯 Complete Environment Variables Template

Copy and paste this into Vercel:

```
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-super-secret-key-change-this-32-chars-min
OPENAI_API_KEY=sk-proj-...
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
WHISPER_API_KEY=sk-proj-...
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-project.vercel.app
```

---

## 🆘 Troubleshooting

### Build Fails
**Error**: `Build failed`
- Check Vercel build logs
- Ensure all required env vars are set
- Try redeploying

### Database Connection Error
**Error**: `Can't reach database`
- Verify `DATABASE_URL` is correct
- Check NeonDB project is active
- Run `npx prisma db push` to create tables

### AI Models Not Working
**Error**: `API key invalid` or `No models available`
- Verify API key is correct
- Check API key has credits
- Try a different provider

### Voice Input Not Working
**Error**: `Transcription failed`
- Ensure HTTPS is enabled (Vercel provides this)
- Verify `WHISPER_API_KEY` is set
- Check browser supports Web Speech API

### Cloudinary Upload Fails
**Error**: `Upload failed`
- Verify cloud name is correct
- Check API credentials
- Ensure API key has upload permissions

---

## 📊 Monitoring

### Vercel Dashboard
- View deployments
- Check build logs
- Monitor performance
- Manage domains

### NeonDB Console
- Monitor database usage
- View query performance
- Check connection logs

### Cloudinary Dashboard
- Monitor storage usage
- View upload stats
- Check bandwidth

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use strong `JWT_SECRET`** (32+ characters)
3. **Rotate API keys** regularly
4. **Enable Vercel branch protection**
5. **Use environment-specific variables**
6. **Monitor API usage** for unusual activity
7. **Keep dependencies updated**

---

## 📱 Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration
4. Update `FRONTEND_URL` environment variable
5. Redeploy

---

## ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] NeonDB database set up
- [ ] Cloudinary account created
- [ ] AI API key(s) obtained
- [ ] Vercel project created
- [ ] All environment variables added
- [ ] Deployment successful
- [ ] Database migrations run
- [ ] Admin user created
- [ ] Chat functionality tested
- [ ] Voice input tested
- [ ] Admin panel accessed

---

**Status**: Ready for production ✅
**Last Updated**: 2026-06-11

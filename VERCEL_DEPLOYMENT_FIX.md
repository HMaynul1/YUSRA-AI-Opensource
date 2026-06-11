# ✅ Vercel Deployment Fix: DATABASE_URL Schema Validation Error

## ❌ Error Message
```
Build Failed
The `vercel.json` schema validation failed with the following message:
`env.DATABASE_URL` should be string
```

## ✅ Solution

The error is now **FIXED** in the latest version. The `vercel.json` has been updated to properly define `DATABASE_URL` as a required string environment variable.

---

## 🚀 Steps to Deploy Successfully

### Step 1: Pull Latest Changes
```bash
cd yusra-ai-opensource
git pull origin main
```

### Step 2: Get NeonDB Connection String

1. Go to [neon.tech](https://neon.tech)
2. Sign up or log in
3. Create a new PostgreSQL database
4. Copy the connection string (looks like):
   ```
   postgresql://neon_user:password@ep-cool-lake-123456.us-east-1.neon.tech/yusra_ai?sslmode=require
   ```

### Step 3: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these **REQUIRED** variables:

| Variable | Value | Example |
|----------|-------|---------|
| `DATABASE_URL` | Your NeonDB connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Random 32-character string | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `FRONTEND_URL` | Your Vercel domain | `https://yusra-ai-opensource.vercel.app` |
| `NODE_ENV` | `production` | `production` |

4. Add **AT LEAST ONE** AI Provider key:

| Provider | Variable | Get Key From |
|----------|----------|--------------|
| OpenAI | `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| Google Gemini | `GEMINI_API_KEY` | https://makersuite.google.com/app/apikey |
| Anthropic Claude | `ANTHROPIC_API_KEY` | https://console.anthropic.com/account/keys |

5. (Optional) Add other providers:
   - `MISTRAL_API_KEY`
   - `GROQ_API_KEY`
   - `COHERE_API_KEY`
   - `PERPLEXITY_API_KEY`
   - `TOGETHER_API_KEY`
   - `HUGGINGFACE_API_KEY`
   - `DEEPSEEK_API_KEY`

6. (Optional) Add Cloudinary for media storage:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click the (...) menu on the latest failed deployment
3. Select **Redeploy**
4. Wait 2-5 minutes for build to complete

### Step 5: Verify Deployment

1. Once deployment succeeds, click the domain link
2. You should see the login page
3. Test the health endpoint: `https://your-domain.vercel.app/health`
   - Should return: `{"status":"ok","timestamp":"...","environment":"production"}`

---

## 🔑 Generate JWT_SECRET

Run one of these commands to generate a secure JWT_SECRET:

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**OpenSSL:**
```bash
openssl rand -hex 32
```

**Python:**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Copy the output and paste it as `JWT_SECRET` in Vercel.

---

## 📋 Complete Environment Variables Checklist

### Required (Must have)
- [ ] `DATABASE_URL` – NeonDB connection string
- [ ] `JWT_SECRET` – Generated random string
- [ ] `FRONTEND_URL` – Your Vercel domain
- [ ] `NODE_ENV` – Set to `production`
- [ ] At least ONE AI provider key (OpenAI, Gemini, or Claude)

### Optional but Recommended
- [ ] `OPENAI_API_KEY` – For ChatGPT support
- [ ] `GEMINI_API_KEY` – For Google Gemini support
- [ ] `ANTHROPIC_API_KEY` – For Claude support

### Optional (Media Storage)
- [ ] `CLOUDINARY_CLOUD_NAME` – For image storage
- [ ] `CLOUDINARY_API_KEY` – For image storage
- [ ] `CLOUDINARY_API_SECRET` – For image storage

---

## 🐛 Troubleshooting

### Error: "Build Failed - DATABASE_URL should be string"
**Solution**: Make sure `DATABASE_URL` is added to Vercel environment variables and is not empty.

### Error: "Connection refused"
**Solution**: 
- Verify NeonDB database is running
- Check connection string is correct
- Ensure `?sslmode=require` is in the connection string

### Error: "Authentication failed"
**Solution**:
- Verify username and password in connection string
- Check if special characters in password are URL-encoded
- Ensure user has database access

### Error: "Database does not exist"
**Solution**:
- Create database in NeonDB console
- Verify database name in connection string
- Run: `npx prisma db push` after deployment

### Build succeeds but app crashes
**Solution**:
- Check Vercel logs: Deployments → Click deployment → Logs
- Verify all required environment variables are set
- Check database connection is working

---

## ✅ What's Fixed in Latest Version

1. **vercel.json** – Now properly defines `DATABASE_URL` as required string
2. **server/config/env.ts** – Validates all environment variables on startup
3. **server/index.ts** – Uses validated env config with better error handling
4. **DATABASE_URL_SETUP.md** – Complete setup guide

---

## 🚀 Next Steps After Successful Deployment

1. **Create Admin User**
   ```bash
   curl -X POST https://your-domain.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "secure-password",
       "name": "Admin"
     }'
   ```

2. **Test Chat**
   - Login with your credentials
   - Send a test message
   - Verify AI response

3. **Enable Voice**
   - Go to Settings
   - Enable Voice Mode
   - Test microphone input

4. **Access Admin Panel**
   - Go to `/admin`
   - Configure system prompt
   - Set default model

---

## 📞 Still Having Issues?

1. **Check Vercel Logs**
   - Go to Deployments
   - Click latest deployment
   - Click "Logs" tab
   - Look for error messages

2. **Check NeonDB Status**
   - Go to neon.tech
   - Verify database is running
   - Check connection logs

3. **Verify Environment Variables**
   - Go to Vercel Settings
   - Click Environment Variables
   - Confirm all required variables are set
   - Ensure no typos in variable names

4. **Test Locally First**
   ```bash
   # Set DATABASE_URL locally
   export DATABASE_URL="your-connection-string"
   
   # Run migrations
   npx prisma db push
   
   # Start server
   pnpm dev
   
   # Test health endpoint
   curl http://localhost:3000/health
   ```

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [NeonDB Documentation](https://neon.tech/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html)

---

**Status**: ✅ **FIXED AND READY FOR DEPLOYMENT**

The latest version has all fixes applied. Simply add your environment variables to Vercel and redeploy!

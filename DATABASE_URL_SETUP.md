# DATABASE_URL Setup Guide for Vercel

## ❌ Common Error: "env.DATABASE_URL should be string"

This error occurs when:
1. DATABASE_URL is not set in Vercel environment variables
2. DATABASE_URL is set to an empty string
3. DATABASE_URL format is invalid
4. DATABASE_URL contains special characters that need escaping

---

## ✅ Solution: Proper DATABASE_URL Configuration

### Step 1: Get NeonDB Connection String

1. Go to [neon.tech](https://neon.tech)
2. Create a new PostgreSQL database
3. Copy the connection string (looks like):
   ```
   postgresql://username:password@ep-xxxxx.us-east-1.neon.tech/yusra_ai?sslmode=require
   ```

### Step 2: Add to Vercel

1. Go to your Vercel project settings
2. Navigate to **Settings → Environment Variables**
3. Add new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Paste the full connection string from NeonDB
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**

### Step 3: Redeploy

1. Go to **Deployments**
2. Click the three dots (...) on the latest deployment
3. Select **Redeploy**
4. Wait for deployment to complete

---

## 📋 DATABASE_URL Format

### NeonDB PostgreSQL (Recommended)
```
postgresql://user:password@host:port/database?sslmode=require
```

**Example:**
```
postgresql://neon_user:neon_password@ep-cool-lake-123456.us-east-1.neon.tech/yusra_ai?sslmode=require
```

### Local PostgreSQL (Development)
```
postgresql://postgres:password@localhost:5432/yusra_ai
```

### Supabase PostgreSQL
```
postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

---

## 🔧 Troubleshooting

### Issue: "Connection refused"
- ✅ Check if NeonDB database is active
- ✅ Verify IP is whitelisted (NeonDB allows all IPs by default)
- ✅ Ensure `sslmode=require` is in the connection string

### Issue: "Authentication failed"
- ✅ Check username and password are correct
- ✅ Verify no special characters in password (or URL-encode them)
- ✅ Ensure user has database access permissions

### Issue: "Database does not exist"
- ✅ Check database name is correct
- ✅ Verify database was created in NeonDB
- ✅ Run migrations: `npx prisma db push`

### Issue: "SSL certificate problem"
- ✅ Add `?sslmode=require` to connection string
- ✅ Ensure `sslmode` is not set to `disable`

---

## 🚀 Vercel Environment Variables Setup

### Full Configuration for Vercel

Add these environment variables in Vercel:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Your NeonDB connection string | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `JWT_SECRET` | Random string (min 32 chars) | ✅ Yes |
| `FRONTEND_URL` | Your Vercel domain (e.g., `https://yusra.vercel.app`) | ✅ Yes |
| `OPENAI_API_KEY` | Your OpenAI API key | ⚠️ At least one AI provider |
| `GEMINI_API_KEY` | Your Google Gemini API key | ⚠️ At least one AI provider |
| `ANTHROPIC_API_KEY` | Your Anthropic Claude API key | ⚠️ At least one AI provider |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | ❌ Optional |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | ❌ Optional |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | ❌ Optional |

---

## 📝 Step-by-Step Vercel Setup

### 1. Import Repository
```
1. Go to vercel.com
2. Click "Add New Project"
3. Select "HMaynul1/YUSRA-AI-Opensource"
4. Click "Import"
```

### 2. Configure Project
```
Framework: Other
Build Command: pnpm run build
Output Directory: dist
Install Command: pnpm install
```

### 3. Add Environment Variables
```
1. Click "Environment Variables"
2. Add DATABASE_URL (from NeonDB)
3. Add JWT_SECRET (generate random string)
4. Add FRONTEND_URL (your Vercel URL)
5. Add at least one AI provider key
```

### 4. Deploy
```
1. Click "Deploy"
2. Wait 2-5 minutes for build
3. Check deployment logs if errors occur
```

### 5. Run Migrations
```
After successful deployment:
1. Go to your Vercel project
2. Open "Settings → Functions"
3. Run: npx prisma db push
```

---

## 🔑 Generate JWT_SECRET

Run this command to generate a secure JWT_SECRET:

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Using Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Copy the output and use it as `JWT_SECRET` in Vercel.

---

## ✅ Verification Checklist

- [ ] NeonDB database created
- [ ] Connection string copied
- [ ] DATABASE_URL added to Vercel
- [ ] JWT_SECRET generated and added
- [ ] FRONTEND_URL set correctly
- [ ] At least one AI provider key added
- [ ] Project redeployed
- [ ] Health check endpoint returns 200: `https://your-domain.vercel.app/health`
- [ ] Database migrations ran successfully
- [ ] Can login and send messages

---

## 🆘 Still Having Issues?

### Check Vercel Logs
```
1. Go to Vercel project
2. Click "Deployments"
3. Click latest deployment
4. Click "Logs"
5. Look for error messages
```

### Check Database Connection
```
1. Go to NeonDB console
2. Check if database is running
3. Verify connection string is correct
4. Check if any queries are failing
```

### Test Locally First
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

- [NeonDB Documentation](https://neon.tech/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Prisma Connection Strings](https://www.prisma.io/docs/reference/database-reference/connection-urls)
- [PostgreSQL Connection String Format](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

---

**Status**: ✅ DATABASE_URL configuration guide complete

If you still encounter issues, check the Vercel logs and NeonDB console for specific error messages.

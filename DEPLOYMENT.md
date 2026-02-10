# Vercel Deployment Guide

## 📦 Prerequisites

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Create Vercel Account**
- Sign up at [vercel.com](https://vercel.com)

## 🚀 Deployment Steps

### Option 1: Deploy via CLI (Recommended)

1. **Login to Vercel**
```bash
vercel login
```

2. **Deploy from project directory**
```bash
cd c:\Users\tawil\Python\schedual
vercel
```

3. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? (Select your account)
   - Link to existing project? `N`
   - Project name? `daily-schedule` (or your choice)
   - Directory? `./`
   - Override settings? `N`

4. **Production deployment**
```bash
vercel --prod
```

Your app will be live at: `https://your-project-name.vercel.app`

---

### Option 2: Deploy via GitHub

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Click "Deploy"

3. **Automatic deployments**
   - Every push to `main` branch auto-deploys
   - Pull requests get preview deployments

---

## ⚙️ Configuration

The following files are already configured:

✅ `vercel.json` - Vercel deployment config
✅ `requirements.txt` - Python dependencies
✅ `app.py` - Updated for serverless

## 🔧 Environment Variables (Optional)

If you need environment variables:

1. **Via CLI:**
```bash
vercel env add SECRET_KEY
```

2. **Via Dashboard:**
   - Go to project settings
   - Navigate to "Environment Variables"
   - Add your variables

## 📱 Access Your App

After deployment, you'll get:
- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: For each deployment
- **Custom Domain**: Can be added in project settings

## 🔄 Update Your App

```bash
# Make changes to your code
git add .
git commit -m "Update features"
git push

# Or deploy directly
vercel --prod
```

## 💡 Tips

- **Custom Domain**: Add in Vercel dashboard → Settings → Domains
- **Analytics**: Enable in project settings
- **Logs**: View in Vercel dashboard → Deployments → Function Logs
- **Rollback**: Click on previous deployment → Promote to Production

## ⚠️ Important Notes

- Vercel uses serverless functions (no persistent storage)
- Task bank uses browser localStorage (client-side)
- Schedule tasks are in-memory (reset on deployment)
- For persistent storage, consider adding a database

## 🆘 Troubleshooting

**Build fails?**
- Check `vercel.json` is in root directory
- Verify `requirements.txt` is correct

**App not loading?**
- Check function logs in Vercel dashboard
- Verify all files are committed

**Static files not loading?**
- Ensure `static/` and `templates/` folders are included
- Check `.gitignore` doesn't exclude them

---

**Ready to deploy!** 🚀

Run `vercel` in your project directory to get started!

# Noted. - Todo & Notes PWA

A beautiful, offline-ready Progressive Web App for todos and notes.

## 🚀 Deploy to GitHub Pages — Exact Commands

### Step 1: Initialize Git & Push

```bash
# Navigate into your project folder
cd todo-pwa

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "🚀 Initial commit — Noted. PWA"

# Rename branch to main
git branch -M main

# Add your GitHub remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/pages`
2. Under **Source** → select **Deploy from a branch**
3. Branch: `main` | Folder: `/ (root)`
4. Click **Save**

### Step 3: Your Live URL

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

⏱ Wait 1–3 minutes after saving, then visit the URL!

---

## 📁 Project Structure

```
todo-pwa/
├── index.html          # Main HTML
├── manifest.json       # PWA manifest
├── service-worker.js   # Offline caching
├── css/
│   └── style.css       # All styles
├── js/
│   └── app.js          # App logic
└── icons/
    ├── icon-192.png    # PWA icon (small)
    └── icon-512.png    # PWA icon (large)
```

## ✨ Features

- ✅ Add, complete, delete todos
- 🗂 Categories: Personal, Work, Ideas, Urgent
- 🔍 Filter: All / Active / Done
- 📊 Live stats counter
- 💾 Offline support (Service Worker)
- 📱 Installable on mobile & desktop
- 🌙 Dark theme with elegant design

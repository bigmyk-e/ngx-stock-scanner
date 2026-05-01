# 📊 NGX Edge Scanner

A personal stock scoring tool for the Nigerian Exchange (NGX), built with React + Vite.

Score any NGX stock across **18 fundamental metrics** — 6 baseline + 12 edge metrics — to get a composite investment grade.

---

## 🚀 Deploy to GitHub Pages (Step-by-Step)

### 1. Create a GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click **New repository**
3. Name it exactly: `ngx-stock-scanner`
4. Set it to **Public**
5. Click **Create repository**

---

### 2. Upload the Project Files

**Option A — GitHub Web Upload (easiest):**
1. Unzip the downloaded folder
2. On your new repo page, click **uploading an existing file**
3. Drag all the files/folders in — including the hidden `.github` folder
4. Click **Commit changes**

**Option B — Git CLI:**
```bash
cd ngx-stock-scanner
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ngx-stock-scanner.git
git push -u origin main
```

---

### 3. Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

---

### 4. Wait for Deployment

- Go to the **Actions** tab in your repo
- You'll see a workflow called "Deploy to GitHub Pages" running
- Once it shows a ✅ green checkmark, your app is live

---

### 5. Access Your App

Your app will be live at:
```
https://YOUR_GITHUB_USERNAME.github.io/ngx-stock-scanner/
```

---

## 🔧 Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## 📈 Metrics Covered

**Baseline (6)**
- Revenue Growth
- Earnings (PAT) Growth  
- Operating Margin
- Price-to-Earnings (P/E)
- Price-to-Book (P/B)
- Price-to-Sales (P/S)

**Edge (12)**
- PEG Ratio
- EV/EBITDA
- Free Cash Flow Yield
- Return on Equity (ROE)
- Return on Invested Capital (ROIC)
- Debt-to-Equity
- Interest Coverage Ratio
- Earnings Quality (CFO/NI)
- FX / Hard Currency Revenue %
- Insider Ownership
- Dividend Yield
- Revenue Diversification Score

---

## 📂 Project Structure

```
ngx-stock-scanner/
├── src/
│   ├── App.jsx        # Main scoring component
│   └── main.jsx       # React entry point
├── .github/
│   └── workflows/
│       └── deploy.yml # Auto-deploy to GitHub Pages
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

Built for NGX investors. Not financial advice.

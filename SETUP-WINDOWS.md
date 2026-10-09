# Set up on Windows (`C:\Side\portsmouthbadmintonhub`)

## If the folder is empty or missing files

### Option 1 — Clone into the folder (easiest)

```powershell
cd C:\Side
rmdir portsmouthbadmintonhub /s /q   # only if empty or you want a fresh start
git clone https://github.com/jerilkuruvilawork/portsmouthbadmintonhub.git portsmouthbadmintonhub
cd portsmouthbadmintonhub
npm install
npm run dev
```

Open: http://localhost:5173/portsmouthbadmintonhub/

### Option 2 — Folder already exists with `git init`

```powershell
cd C:\Side\portsmouthbadmintonhub
git remote add origin https://github.com/jerilkuruvilawork/portsmouthbadmintonhub.git
git fetch origin
git checkout -b main
git reset --hard origin/main
npm install
```

If `origin` already exists: `git remote set-url origin https://github.com/jerilkuruvilawork/portsmouthbadmintonhub.git`

### Option 3 — Copy from `pompeysmashers` (before separate repo is pushed)

```powershell
git clone https://github.com/jerilkuruvilawork/pompeysmashers.git
xcopy /E /I pompeysmashers\portsmouthbadmintonhub C:\Side\portsmouthbadmintonhub
cd C:\Side\portsmouthbadmintonhub
npm install
```

## Publish

```powershell
git add .
git commit -m "Portsmouth Badminton Hub"
git push -u origin main
```

Then GitHub → **Settings → Pages** → branch **`gh-pages`** / **root** (after Actions runs once).

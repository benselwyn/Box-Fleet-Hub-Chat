# Box Fleet Hub Chat

AI chat interface for the Fleet Research Box Hub, embeddable in WordPress via iframe.

## Architecture
```
WordPress iframe → fleet-hub-chat.html → Railway proxy (server.js) → Anthropic API + Box MCP → Box Hub AI
```

## Files
- `server.js` — Express proxy server (deploy to Railway)
- `package.json` — Node dependencies
- `railway.json` — Railway deployment config
- `fleet-hub-chat.html` — WordPress embed (iframe this file)

## Deploy

### 1. Railway (proxy server)
```bash
# Push this repo to GitHub, then:
# railway.app → New Project → Deploy from GitHub → select this repo
# Add environment variable: ANTHROPIC_API_KEY=sk-ant-...
# Copy the Railway public URL
```

### 2. HTML embed
Open `fleet-hub-chat.html` and replace:
```
REPLACE_WITH_YOUR_RAILWAY_URL
```
with your Railway URL e.g. `https://box-fleet-hub-chat-production.up.railway.app`

### 3. WordPress
```html
<iframe src="/wp-content/uploads/fleet-hub-chat.html"
        width="100%" height="600px"
        style="border:none; border-radius:12px;">
</iframe>
```

## Local dev
```bash
npm install
ANTHROPIC_API_KEY=sk-ant-... node server.js
```

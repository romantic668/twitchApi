// server/index.js
import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---- 简单内存缓存 token ----
let tokenCache = { value: null, expiresAt: 0 };

async function getAppToken() {
    if (tokenCache.value && Date.now() < tokenCache.expiresAt - 5 * 60 * 1000) {
        return tokenCache.value;
    }
    const params = new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
    });

    const r = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    const data = await r.json();
    if (!r.ok) {
        console.error('Token error:', data);
        throw new Error('Failed to get token');
    }

    tokenCache = {
        value: data.access_token,
        expiresAt: Date.now() + (Number(data.expires_in || 3600) * 1000),
    };
    return tokenCache.value;
}

// ---- API: 搜频道（前端直接调这个） ----
// GET /api/search-channels?query=xxx&first=50
app.get('/api/search-channels', async (req, res) => {
    try {
        const query = (req.query.query ?? '').toString();
        const first = (req.query.first ?? '50').toString();

        const token = await getAppToken();

        const url = new URL('https://api.twitch.tv/helix/search/channels');
        url.searchParams.set('query', query || 'a'); // 必填，空时给默认
        url.searchParams.set('first', first);

        const r = await fetch(url, {
            headers: {
                'Client-Id': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await r.json();
        res.status(r.status).json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: String(e) });
    }
});

// 健康检查
app.get('/health', (_req, res) => res.json({ ok: true }));

// ---- 静态托管 build/ ----
app.use(express.static(path.join(__dirname, '..', 'build')));
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server listening on ' + PORT));

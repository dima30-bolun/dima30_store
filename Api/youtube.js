// api/youtube.js — прокси для YouTube API (Vercel serverless function)
export default async function handler(req, res) {
    // Разрешаем CORS для всех источников (можно ограничить)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { endpoint, ...params } = req.query;
    if (!endpoint) {
        return res.status(400).json({ error: 'Missing endpoint parameter' });
    }

    // ВАШ КЛЮЧ YouTube API (храните здесь, он не виден клиенту)
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'YOUR_API_KEY_HERE';

    // Формируем URL запроса к YouTube API
    let url = `https://www.googleapis.com/youtube/v3/${endpoint}?key=${YOUTUBE_API_KEY}`;
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            url += `&${key}=${encodeURIComponent(value)}`;
        }
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json(data);
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

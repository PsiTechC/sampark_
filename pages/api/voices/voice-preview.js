export default async function handler(req, res) {
  const { voiceId, text } = req.query;

  if (!voiceId || !text) {
    return res.status(400).json({ error: 'Missing voiceId or text' });
  }

  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: 'Failed to generate preview', details: errText });
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'no-store');

    res.status(200).end(audioBuffer);
  } catch (err) {
    console.error('[Voice Preview Error]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

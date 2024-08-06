import OpenAI from 'openai';
import { Readable } from 'stream';

const openai = new OpenAI();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, voice } = req.body;

    try {
      const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: voice.toLowerCase(),
        input: text,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      const readableStream = new Readable();
      readableStream._read = () => {};
      readableStream.push(buffer);
      readableStream.push(null);

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', 'attachment; filename=speech.mp3');
      readableStream.pipe(res);
    } catch (error) {
      console.error('Error generating speech:', error);
      res.status(500).json({ error: 'Error generating speech' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

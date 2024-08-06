// pages/tts-test.js
import { useState } from 'react';

export default function TtsTest() {
  const [message, setMessage] = useState('Hello, this is a test message.');

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      utterance.onstart = () => {
        console.log('Speech synthesis started');
      };
      utterance.onend = () => {
        console.log('Speech synthesis ended');
      };
      utterance.onerror = (event) => {
        console.error('Speech synthesis error', event);
      };
      console.log('Speaking:', utterance.text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech Synthesis not supported in this browser.');
      alert('Speech Synthesis not supported in this browser.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Text-to-Speech Test</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows="4"
        className="border p-2 mb-4 w-1/2"
      />
      <button
        onClick={handleSpeak}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Speak
      </button>
    </div>
  );
}

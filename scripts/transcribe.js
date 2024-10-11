
// const axios = require('axios');
// const FormData = require('form-data');
// const fs = require('fs');

// OPENAI_API_KEY = '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';

// console.log('API Key:', OPENAI_API_KEY); // Debugging line

// // Function to transcribe audio using OpenAI Whisper
// async function transcribeAudio(filePath) {
//   try {
//     // Prepare the form data for transcription
//     const formData = new FormData();
//     formData.append('file', fs.createReadStream(filePath));
//     formData.append('model', 'whisper-1');

//     // Make the API request to OpenAI Whisper for transcription
//     const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
//       headers: {
//         'Authorization': `Bearer ${OPENAI_API_KEY}`,
//         ...formData.getHeaders(),
//       },
//     });

//     const transcription = response.data.text;
//     console.log('Transcription:', transcription);

//     // Translate the transcription to English
//     const translatedText = await translateToEnglish(transcription);
//     console.log('Translation:', translatedText);

//   } catch (error) {
//     console.error('Error transcribing audio:', error.response ? error.response.data : error.message);
//   }
// }

// // Function to translate text to English
// async function translateToEnglish(text) {
//   try {
//     const response = await axios.post('https://api.openai.com/v1/completions', {
//       model: 'text-davinci-003',  // Using OpenAI's GPT-3 model for translation
//       prompt: `Translate the following text to English: ${text}`,
//       max_tokens: 1000,
//       temperature: 0.5,
//     }, {
//       headers: {
//         'Authorization': `Bearer ${OPENAI_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     return response.data.choices[0].text.trim();
//   } catch (error) {
//     console.error('Error translating text:', error.response ? error.response.data : error.message);
//   }
// }

// // File path for the audio file you want to transcribe and translate
// const audioFilePath = 'public/urdu_demo.mp3'; // Input audio file

// // Transcribe and then translate the audio
// transcribeAudio(audioFilePath);



// // C:\botGIT\botGIT-main\scripts\transcribe.js
// const axios = require('axios');
// const FormData = require('form-data');
// const fs = require('fs');

// // Hardcoded API key for OpenAI Whisper
// const openaiApiKey = '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';

// // Function to transcribe audio to text using OpenAI Whisper
// async function transcribeAudio(filePath) {
//     try {
//         const formData = new FormData();
//         formData.append('file', fs.createReadStream(filePath));
//         formData.append('model', 'whisper-1'); // Using Whisper's latest model

//         const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
//             headers: {
//                 'Authorization': `Bearer ${openaiApiKey}`,
//                 ...formData.getHeaders(),
//             },
//         });

//         console.log('Transcription:', response.data.text);
//         return response.data.text; // Return the transcribed text for TTS
//     } catch (error) {
//         console.error('Error transcribing audio:', error.response ? error.response.data : error.message);
//     }
// }

// // Function to convert text to speech using Mozilla TTS
// async function synthesizeSpeechWithMozilla(text) {
//     try {
//         const response = await axios.post('http://localhost:5002/api/tts', {
//             text: text,
//             // speaker: 'en', // Change speaker as necessary
//             // language: 'en-US', // Language code
//             language: 'mr-IN', // Language code for Marathi
//             speaker: 'mr-IN-Voice1', // Example speaker for Marathi

//             speed: 1.0, // Adjust speech speed
//             pitch: 1.0, // Adjust pitch
//         }, {
//             responseType: 'arraybuffer', // Get the audio file as a buffer
//         });

//         // Save the synthesized speech to an MP3 file
//         fs.writeFileSync('output_speech.mp3', response.data);
//         console.log('Speech synthesized successfully to "output_speech.mp3".');
//     } catch (error) {
//         console.error('Error generating speech:', error.message);
//     }
// }

// // Main function to process audio
// async function processAudio() {
//     const audioFilePath = 'public/nepali_demo.mp3'; // Input audio file

//     // Step 1: Transcribe audio to text (STT)
//     const transcribedText = await transcribeAudio(audioFilePath);

//     // Step 2: Convert transcribed text to speech (TTS)
//     if (transcribedText) {
//         await synthesizeSpeechWithMozilla(transcribedText);
//     }
// }

// // Start the STT and TTS process
// processAudio();






// const axios = require('axios');
// const FormData = require('form-data');
// const fs = require('fs');

// // Hardcoded API key for OpenAI Whisper
// const openaiApiKey = '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';

// // Function to transcribe audio to text using OpenAI Whisper
// async function transcribeAudio(filePath) {
//     try {
//         const formData = new FormData();
//         formData.append('file', fs.createReadStream(filePath));
//         formData.append('model', 'whisper-1'); // Using Whisper's latest model

//         const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
//             headers: {
//                 'Authorization': `Bearer ${openaiApiKey}`,
//                 ...formData.getHeaders(),
//             },
//         });

//         console.log('Transcription:', response.data.text);
//         return response.data.text; // Return the transcribed text for TTS
//     } catch (error) {
//         console.error('Error transcribing audio:', error.response ? error.response.data : error.message);
//     }
// }

// // Function to convert text to speech using iSTTS
// async function synthesizeSpeechWithISTTS(text) {
//     try {
//         const response = await axios.post('http://localhost:5002/api/tts', { // Use the correct iSTTS API URL
//             text: text,
//             language: 'mr-IN', // Language code for Marathi
//             speaker: 'mr-IN-Voice1', // Example speaker for Marathi, you need to check the speaker options in iSTTS
//             speed: 1.0, // Adjust speech speed
//             pitch: 1.0, // Adjust pitch
//         }, {
//             responseType: 'arraybuffer', // Get the audio file as a buffer
//         });

//         // Save the synthesized speech to an MP3 file
//         fs.writeFileSync('output_speech.mp3', response.data);
//         console.log('Speech synthesized successfully to "output_speech.mp3".');
//     } catch (error) {
//         console.error('Error generating speech with iSTTS:', error.message);
//     }
// }

// // Main function to process audio
// async function processAudio() {
//     const audioFilePath = 'public/marathi_demo.mp3'; // Input audio file

//     // Step 1: Transcribe audio to text (STT)
//     const transcribedText = await transcribeAudio(audioFilePath);

//     // Step 2: Convert transcribed text to speech (TTS) using iSTTS
//     if (transcribedText) {
//         await synthesizeSpeechWithISTTS(transcribedText);
//     }
// }

// // Start the STT and TTS process
// processAudio();

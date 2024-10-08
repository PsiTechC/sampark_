// // transcribe.js
// const axios = require('axios');
// const FormData = require('form-data');
// const fs = require('fs');


// OPENAI_API_KEY='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'

// console.log('API Key:', OPENAI_API_KEY); // Debugging line


// async function transcribeAudio(filePath) {
//   try {
//     // Prepare the form data
//     const formData = new FormData();
//     formData.append('file', fs.createReadStream(filePath));
//     formData.append('model', 'whisper-1');

//     // Make the API request to OpenAI Whisper
//     const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
//       headers: {
//         'Authorization': `Bearer ${OPENAI_API_KEY}`,
//         ...formData.getHeaders(),
//       },
//     });

//     // Log the transcription
//     console.log('Transcription:', response.data.text);
//   } catch (error) {
//     console.error('Error transcribing audio:', error.response ? error.response.data : error.message);
//   }
// }

// // Replace this with your actual file path
// const audioFilePath = 'public/English_demo.mp3'; // The audio file you want to transcribe
// const audioFilePath1 = 'public/hindi_demo.mp3'; // The audio file you want to transcribe
// transcribeAudio(audioFilePath);
// transcribeAudio(audioFilePath1);





const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Hardcoded API key for OpenAI Whisper
const openaiApiKey = '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';

// Function to transcribe audio to text using OpenAI Whisper
async function transcribeAudio(filePath) {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('model', 'whisper-1'); // Using Whisper's latest model

        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                ...formData.getHeaders(),
            },
        });

        console.log('Transcription:', response.data.text);
        return response.data.text; // Return the transcribed text for TTS
    } catch (error) {
        console.error('Error transcribing audio:', error.response ? error.response.data : error.message);
    }
}

// Function to convert text to speech using Mozilla TTS
async function synthesizeSpeechWithMozilla(text) {
    try {
        const response = await axios.post('http://localhost:5002/api/tts', {
            text: text,
            speaker: 'en', // Change speaker as necessary
            language: 'en-US', // Language code
            speed: 1.0, // Adjust speech speed
            pitch: 1.0, // Adjust pitch
        }, {
            responseType: 'arraybuffer', // Get the audio file as a buffer
        });

        // Save the synthesized speech to an MP3 file
        fs.writeFileSync('output_speech.mp3', response.data);
        console.log('Speech synthesized successfully to "output_speech.mp3".');
    } catch (error) {
        console.error('Error generating speech:', error.message);
    }
}

// Main function to process audio
async function processAudio() {
    const audioFilePath = 'public/English_demo.mp3'; // Input audio file

    // Step 1: Transcribe audio to text (STT)
    const transcribedText = await transcribeAudio(audioFilePath);

    // Step 2: Convert transcribed text to speech (TTS)
    if (transcribedText) {
        await synthesizeSpeechWithMozilla(transcribedText);
    }
}

// Start the STT and TTS process
processAudio();

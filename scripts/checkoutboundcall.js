//8b99281a-03c4-4775-aea4-ed690b04e046



const axios = require('axios');

// API endpoints and credentials
const apiBaseUrl = 'https://api-smartflo.tatateleservices.com/v1';
const ivrEndpoint = `${apiBaseUrl}/ivr`;
const broadcastEndpoint = `${apiBaseUrl}/broadcast`;
const apiToken = '8b99281a-03c4-4775-aea4-ed690b04e046';

// IVR Text
const ivrText = "Welcome to our service. Press 1 for sales, press 2 for support.";

(async function createIVRAndBroadcast() {
    try {
        // Create IVR with direct text-to-speech conversion
        const ivrData = {
            name: "Sample IVR",
            description: "This is a sample IVR",
            recording: ivrText, // Directly use the text as the recording
            timeout: 30,
            option: [1, 2],
            destination: ["extension|05047530000", "extension|05047530001"],
            incorrect_count: 2,
            timeout_recording: ivrText, // Use the text for timeout recording
            invalid_recording: ivrText, // Use the text for invalid input recording
            invalid_destination: "extension|05047530099",
            timeout_retry_recording: ivrText, // Use the text for timeout retry
            timeout_destination: "extension|05047530675",
            timeout_tries: 2,
        };

        const ivrResponse = await axios.post(ivrEndpoint, ivrData, {
            headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('IVR created successfully:', ivrResponse.data);

        // Create Broadcast associated with the IVR
        const broadcastData = {
            name: "Sample Broadcast",
            description: "This is a sample broadcast",
            phone_number_list: 7977743973, // Replace with actual phone number list ID
            destination: `ivr|${ivrResponse.data.ivr_id}`, // Use the created IVR ID
            timeout: "40",
            concurrent_limit: "10",
            retry_after_minutes: "5",
            caller_id_number: "1234567890",
            number_of_retry: "3",
            start_date_time: "2024-08-23 10:00:00",
            end_date_time: "2024-08-23 12:00:00",
        };

        const broadcastResponse = await axios.post(broadcastEndpoint, broadcastData, {
            headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Broadcast created successfully:', broadcastResponse.data);

    } catch (error) {
        console.error('Error creating IVR or Broadcast:', error.response ? error.response.data : error.message);
    }
})();

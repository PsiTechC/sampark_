const axios = require("axios");
require("dotenv").config(); // For environment variables (optional)

// Replace with actual API key and recipient details
const API_KEY = "bn-b142c4a604bb40479de01dbd9ca769b0";
const API_URL = "https://api.bolna.dev/call";
// const RECIPIENT_PHONE = "+919131296862";
const RECIPIENT_PHONE = "+917977743973";
const FROM_PHONE = "+918035736988";

// Given JSON data
const agentData = {
  updated_at: "2025-01-31T13:15:42.012671",
  agent_name: "***REMOVED***",
  agent_status: "processed",
  created_at: "2025-01-30T15:57:42.704891",
  webhook_url: null,
  agent_welcome_message:
    "Welcome to Taj by Raheja Builders, Vashi—a premium ready-to-move-in residential project offering luxurious 2BHK & 3BHK homes with world-class amenities in a prime Navi Mumbai location. Will you be interested in knowing more? If you have any questions, feel free to ask!",
  tasks: [],
  agent_type: "other",
  id: "5ad4dace-34fa-44bd-a184-c7d6fedf737c", // Extracted agent_id
  agent_prompts: {},
};

// Extract agent_id from JSON data
const agentId = agentData.id;

if (!agentId) {
  console.error("Agent ID not found in the provided data.");
  process.exit(1);
}

// Request payload
const requestData = {
  agent_id: agentId,
  recipient_phone_number: RECIPIENT_PHONE,
  from_phone_number: FROM_PHONE,
  user_data: {
    variable1: "value1",
    variable2: "value2",
    variable3: "some phrase as value",
  },
};

// Function to make the API request
const makeCall = async () => {
  try {
    const response = await axios.post(API_URL, requestData, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Call initiated successfully:", response.data);
  } catch (error) {
    console.error(
      "Error making API request:",
      error.response ? error.response.data : error.message
    );
  }
};

// Execute the function
makeCall();

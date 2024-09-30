const dialogflow = require('@google-cloud/dialogflow-cx');
const { v4: uuidv4 } = require('uuid');

// Creates a client with the correct endpoint for your region
const client = new dialogflow.SessionsClient({
  apiEndpoint: 'us-central1-dialogflow.googleapis.com'
});

async function detectIntent(projectId, location, agentId, sessionId, query, languageCode) {
  const sessionPath = client.projectLocationAgentSessionPath(
    projectId,
    location,
    agentId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
      },
      languageCode: languageCode,
    },
  };

  const [response] = await client.detectIntent(request);
  return response.queryResult;
}

module.exports = {
  detectIntent,
};

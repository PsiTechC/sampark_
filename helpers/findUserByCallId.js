
export async function findUserByCallId(callId, db) {
    const callCollection = db.collection("userdatafromcallwithsentiment");
    const agentMappingCollection = db.collection("useragentmapping");
    const userCollection = db.collection("users");
  
    // Step 1: Find the call document that contains the callId
    const callDoc = await callCollection.findOne({
      [`data.${callId}`]: { $exists: true }
    });
  
    if (!callDoc) {
      throw new Error(`No document found containing callId: ${callId}`);
    }
  
    const assistantId = callDoc.assistantId;
    if (!assistantId) {
      throw new Error(`assistantId missing in document for callId: ${callId}`);
    }
  
    // Step 2: Find the userId from useragentmapping using assistantId
    const mappingDoc = await agentMappingCollection.findOne({
      assistants: assistantId
    });
  
    if (!mappingDoc || !mappingDoc.userId) {
      throw new Error(`No user mapping found for assistantId: ${assistantId}`);
    }
  
    const userId = mappingDoc.userId;
  
    // Step 3: Fetch the user from users collection using userId
    const user = await userCollection.findOne({ _id: userId });
  
    if (!user) {
      throw new Error(`No user found for userId: ${userId}`);
    }
  
    // Step 4: Extract calendar tokens
    const tokens = Object.entries(user)
      .filter(([key, val]) => key.startsWith("googleAccessToken") && val)
      .map(([accessKey, accessToken]) => {
        const suffix = accessKey === "googleAccessToken" ? "" : accessKey.replace("googleAccessToken", "");
        return {
          accessToken,
          refreshToken: user[`googleRefreshToken${suffix}`],
          tokenKey: suffix || "0",
          calendarName: user[`calendarMeta${suffix}`] || `Calendar ${suffix || "1"}`
        };
      });
  
    return {
      user,
      tokens,
      assistantId,
      userId
    };
  }
  
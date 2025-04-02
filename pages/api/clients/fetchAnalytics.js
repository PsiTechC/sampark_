// // pages/api/clients/fetchAnalytics.js
  
export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
    try {
      // Step 1: Fetch all agents
      const agentsResponse = await fetch('https://api.bolna.dev/v2/agent/all', {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
  
      if (!agentsResponse.ok) {
        console.error("❌ Failed to fetch agents:", agentsResponse.statusText);
        return res.status(500).json({ message: 'Failed to fetch agents' });
      }
  
      const agents = await agentsResponse.json();
      console.log("✅ Agents fetched:", agents.length);
  
      // Step 2: For each agent, fetch executions and build analytics array
      const analytics = [];
  
      for (const agent of agents) {
        try {
          const execResponse = await fetch(`https://api.bolna.dev/agent/${agent.id}/executions`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          });
  
          if (!execResponse.ok) {
            console.warn(`⚠️ Failed to fetch executions for agent ${agent.id}:`, execResponse.statusText);
            continue;
          }
  
          const executions = await execResponse.json();
          if (!Array.isArray(executions)) continue;
  
          let totalCalls = executions.length;
          let successCalls = 0;
          let failedCalls = 0;
          let totalCostCents = 0;
  
          executions.forEach((call) => {
            const duration = call.conversation_duration || 0;
            const cost = call.total_cost || 0;
  
            if (duration > 0) {
              successCalls++;
            } else {
              failedCalls++;
            }
  
            totalCostCents += cost;
          });
  
          const totalCostDollars = (totalCostCents / 100).toFixed(2);
  
          analytics.push({
            id: agent.id,
            totalCalls,
            successCalls,
            failedCalls,
            totalCost: totalCostDollars,
          });
  
        } catch (err) {
          console.error(`❌ Error fetching executions for agent ${agent.id}:`, err);
        }
      }
  
      // ✅ Send analytics back to frontend
      return res.status(200).json({ analytics });
    } catch (error) {
      console.error("❌ Error fetching analytics:", error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
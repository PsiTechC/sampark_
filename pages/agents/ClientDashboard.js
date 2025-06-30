import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";

function ClientDashboard() {
  const [agents, setAgents] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [campaignSentiment, setCampaignSentiment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedAgentCost, setSelectedAgentCost] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("total");
  const [costBreakdown, setCostBreakdown] = useState(null);
  const [agentCallData, setAgentCallData] = useState({});
  const [overallCost, setOverallCost] = useState(0);



  // Fetch agents

  useEffect(() => {
    const fetchVapiAssistantsAndSentiment = async () => {
      try {
        const mapRes = await fetch("/api/map/getUserAgents");
        const { assistants } = await mapRes.json();

        const assistantDetails = await Promise.all(
          assistants.map(async (id) => {
            const res = await fetch(`https://api.vapi.ai/assistant/${id}`, {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_VAPI}`,
              },
            });
            if (!res.ok) throw new Error(`Failed to fetch assistant ${id}`);
            return await res.json();
          })
        );

        const cleanedAgents = assistantDetails.map((a) => ({
          id: a.id,
          agent_name: a.name,
        }));

        setAgents(cleanedAgents);
        setSelectedAgentId(cleanedAgents[0]?.id || "");

        // Fetch sentiment one by one
        const sentimentSummaries = await Promise.all(
          assistants.map(async (id) => {
            const res = await fetch(`${BASE_URL}/api/clients/sentimentAnalysis?assistantId=${id}`);
            if (!res.ok) return null;
            const data = await res.json();
            const summary = data.sentiment_summary?.[0]; // assuming it's an array
            return summary ? { ...summary, agent_id: id } : null;
          })
        );

        setSentimentData(sentimentSummaries.filter(Boolean));
        setLoading(false);
      } catch (err) {
        console.error("Failed to load Vapi agents or sentiment", err);
        setError("Error loading Vapi agents or sentiment");
        setLoading(false);
      }
    };

    fetchVapiAssistantsAndSentiment();
  }, []);


  useEffect(() => {
    const fetchAgentCallData = async () => {
      const assistantIds = JSON.parse(localStorage.getItem("assistant_ids") || "[]");

      if (!Array.isArray(assistantIds) || assistantIds.length === 0) {
        console.warn("⚠️ No assistant IDs found in localStorage.");
        return;
      }

      try {
        const queryParam = assistantIds.join(",");
        const res = await fetch(`/api/clients/spendData?ids=${queryParam}`);
        if (!res.ok) throw new Error("Failed to fetch calls");

        const data = await res.json();

        // Construct agent-wise map
        const callMap = {};
        for (const item of data.results || []) {
          callMap[item.assistantId] = {
            totalCalls: item.call_count,
            totalCost: item.total_cost_usd,
            costBreakdown: item.cost_breakdown || {},
          };
        }

        setAgentCallData(callMap);
        setOverallCost(data.overall_total_cost_usd || 0);
      } catch (err) {
        console.error("❌ Error fetching assistant call data:", err.message);
      }
    };

    fetchAgentCallData();
  }, []);


  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


  const fetchAgentSpend = async (agentId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/clients/spendData?agent_id=${agentId}`);
      const data = await res.json();
      setSelectedAgentCost(data.total_cost_usd);
      setCostBreakdown(data.cost_breakdown);
      setSelectedPeriod("total");
    } catch (err) {
      console.error("❌ Failed to fetch agent cost", err);
      setSelectedAgentCost(null);
      setCostBreakdown(null);
    }
  };

  const getDisplayedCost = () => {
    if (!selectedAgentId) return "Loading...";
  
    const value = selectedPeriod === "total"
      ? selectedAgentCost
      : costBreakdown?.[selectedPeriod];

    if (value === undefined || value === null) return "$0.00";
  
    return `$${value}`;
  };
  
  const PERIOD_OPTIONS = [
    { label: "Total Cost", key: "total" },
    { label: "Last 7D", key: "last_7_days" },
    { label: "Last 30D", key: "last_30_days" },
    { label: "Last 90D", key: "last_90_days" },
    { label: "Current Year", key: "current_year" },
  ];

  // Merge agent-wide analytics and sentiment
  const enrichedAgents = agents.map((agent) => {
    const analytics = agentCallData[agent.id] || {};

    const sentiment = sentimentData.find((s) => s.agent_id === agent.id) || {};
    const campaign = campaignSentiment.find((c) => c.agent_id === agent.id) || {
      total_batches: 0,
      batch_summaries: [],
    };

    // Aggregate sentiment from all batches
    const totalCampaignPos = campaign.batch_summaries.reduce((sum, b) => sum + (b.positive || 0), 0);
    const totalCampaignNeg = campaign.batch_summaries.reduce((sum, b) => sum + (b.negative || 0), 0);
    const totalCampaignNeu = campaign.batch_summaries.reduce((sum, b) => sum + (b.neutral || 0), 0);
    const totalCampaignNone = campaign.batch_summaries.reduce((sum, b) => sum + (b.no_response || 0), 0);

    return {
      ...agent,
      ...analytics,
      ...sentiment,
      total_batches: campaign.total_batches || 0,
      campaign_positive: totalCampaignPos,
      campaign_negative: totalCampaignNeg,
      campaign_neutral: totalCampaignNeu,
      campaign_no_response: totalCampaignNone,
    };
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-grow p-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Money Spent</h2>
          <div className="mb-4">
            <label className="text-sm text-gray-700 mr-2">Select Agent:</label>
            <select
              className="border border-gray-300 rounded px-3 py-1 text-sm"
              value={selectedAgentId}
              onChange={(e) => {
                const agentId = e.target.value;
                setSelectedAgentId(agentId);
                setSelectedPeriod("total");
              
                if (agentId && agentCallData[agentId]) {
                  const { totalCost, costBreakdown } = agentCallData[agentId];
                  setSelectedAgentCost(totalCost);
                  setCostBreakdown(costBreakdown || {});
                } else {
                  setSelectedAgentCost(null);
                  setCostBreakdown(null);
                }
              }}
              

            >
              <option value="">-- Select Agent --</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.agent_name || "Unnamed Agent"}
                </option>
              ))}
            </select>
          </div>

          <p className="text-lg text-gray-600 mb-4">
            {selectedAgentId
              ? `${PERIOD_OPTIONS.find(p => p.key === selectedPeriod)?.label || "Total"}: ${getDisplayedCost()}`
              : "Select an agent to view cost"}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {PERIOD_OPTIONS.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedPeriod(key);
                  if (selectedAgentId && agentCallData[selectedAgentId]) {
                    const { totalCost, costBreakdown } = agentCallData[selectedAgentId];
                    const cost =
                      key === "total"
                        ? totalCost
                        : costBreakdown?.[key] ?? 0;
              
                    setSelectedAgentCost(cost);
                  }
                }}
                
                
                className={`px-3 py-1 text-sm border rounded-md shadow-sm transition ${selectedPeriod === key ? "bg-blue-600 text-white" : "bg-white border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-300"></span> Positive</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Negative</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> Neutral</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-400"></span> No Sentiment Data</div>
          </div>
        </div>

        <div className="flex-1 overflow-auto border border-gray-300 bg-white shadow-md rounded-lg">
          {loading ? (
            <p className="text-gray-600 p-4">Loading data...</p>
          ) : error ? (
            <p className="text-red-500 p-4">Error: {error}</p>
          ) : enrichedAgents.length === 0 ? (
            <p className="text-gray-600 p-4">Fetching...</p>
          ) : (
            <>
              <h3 className="text-xl font-semibold px-4 pt-4 pb-2 text-gray-800">Agent Summary</h3>
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2">Agent</th>
                    <th className="px-4 py-2">Amount Spent</th>
                    <th className="px-4 py-2">Total Calls</th>
                    {/* <th className="px-4 py-2">Call Status</th> */}
                    <th className="px-4 py-2">Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedAgents.map((agent) => {
                    const totalCalls = agent.total_calls || agent.totalCalls || 0;

                    const answered = agent.successCalls || 0;
                    const unanswered = agent.failedCalls || 0;

                    const positive = agent.positive || 0;
                    const negative = agent.negative || 0;
                    const neutral = agent.neutral || 0;
                    const noResponse = agent.no_response || 0;
                    const totalSentiments = positive + negative + neutral + noResponse;

                    return (
                      <tr key={agent.id} className="border-t hover:bg-gray-50 transition">
                        <td className="px-4 py-2 font-medium text-gray-900">{agent.agent_name || "Unknown"}</td>
                        <td className="px-4 py-2 text-gray-700">${agent.totalCost || "0.00"}</td>
                        <td className="px-4 py-2 text-gray-700">{totalCalls}</td>

                        <td className="px-4 py-2">
                          <div className="flex justify-between text-[10px] text-gray-600 mb-1 px-1 flex-wrap gap-x-2">
                            <span>👍 {positive}</span>
                            <span>👎 {negative}</span>
                            <span>😐 {neutral}</span>
                            <span>🚫 {noResponse}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
                            <div
                              className="bg-green-300 transition duration-200 hover:brightness-110"
                              style={{ width: `${(positive / totalSentiments) * 100 || 0}%` }}
                              title={`Positive: ${positive}`}
                            />
                            <div
                              className="bg-red-500 transition duration-200 hover:brightness-110"
                              style={{ width: `${(negative / totalSentiments) * 100 || 0}%` }}
                              title={`Negative: ${negative}`}
                            />
                            <div
                              className="bg-yellow-400 transition duration-200 hover:brightness-110"
                              style={{ width: `${(neutral / totalSentiments) * 100 || 0}%` }}
                              title={`Neutral: ${neutral}`}
                            />
                            <div
                              className="bg-gray-400 transition duration-200 hover:brightness-110"
                              style={{ width: `${(noResponse / totalSentiments) * 100 || 0}%` }}
                              title={`No Response: ${noResponse}`}
                            />
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;

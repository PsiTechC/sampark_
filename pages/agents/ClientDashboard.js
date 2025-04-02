
import React from "react";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";

function ClientDashboard() {
  const [agents, setAgents] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1️⃣ Fetch agents (basic list)
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch('https://api.bolna.dev/v2/agent/all', {
          headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` },
        });
        const data = await res.json();
        setAgents(data);
      } catch (err) {
        console.error('Failed to fetch agents', err);
        setError('Failed to load agents');
      }
    };
    fetchAgents();
  }, []);

  // 2️⃣ Fetch analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/clients/fetchAnalytics');
        const data = await res.json();
        setAnalyticsData(data.analytics || []);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
        setError("Error fetching analytics");
      }
    };
    fetchAnalytics();
  }, []);

  // 3️⃣ Fetch sentiment data
  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/clients/sentimentAnalysis');
        const data = await res.json();
        setSentimentData(data.sentiment_summary || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch sentiment data", err);
        setError("Error fetching sentiment data");
        setLoading(false);
      }
    };
    fetchSentiment();
  }, []);

  // 🔗 Merge everything
  const enrichedAgents = agents.map((agent) => {
    const analytics = analyticsData.find((a) => a.id === agent.id) || {};
    const sentiment = sentimentData.find((s) => s.agent_id === agent.id) || {};

    return {
      ...agent,
      ...analytics,
      ...sentiment,
    };
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-grow p-6 flex flex-col">
        {/* --- Top Stats --- */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Money Spent</h2>
          <p className="text-lg text-gray-600 mb-4">$15,280 Avg cost</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {["Last 7D", "Last 30D", "Last 90D", "Current Year"].map((label) => (
              <button
                key={label}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition"
              >
                {label}
              </button>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Positive</div>
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
                    <th className="px-4 py-2">Call Status</th>
                    <th className="px-4 py-2">Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedAgents.map((agent) => {
                    const totalCalls = agent.totalCalls || 0;
                    const answered = agent.successCalls || 0;
                    const unanswered = agent.failedCalls || 0;

                    const positive = agent.positive || 0;
                    const negative = agent.negative || 0;
                    const neutral = agent.neutral || 0;
                    const noResponse = agent.no_response || 0;
                    const totalSentiments = positive + negative + neutral + noResponse;

                    return (
                      <tr key={agent.id} className="border-t hover:bg-gray-50 transition">
                        {/* Agent Name */}
                        <td className="px-4 py-2 font-medium text-gray-900">{agent.agent_name || "Unknown"}</td>

                        {/* Amount Spent */}
                        <td className="px-4 py-2 text-gray-700">${agent.totalCost || "0.00"}</td>

                        {/* Total Calls */}
                        <td className="px-4 py-2 text-gray-700">{totalCalls}</td>

                        {/* Calls Breakdown Bar with Labels */}
                        <td className="px-4 py-2">
                          <div className="flex justify-between text-[10px] text-gray-600 mb-1 px-1">
                            <span>Answered: {answered}</span>
                            <span>Unanswered: {unanswered}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
                            <div
                              className="bg-green-500 transition duration-200 hover:brightness-110"
                              style={{ width: `${(answered / totalCalls) * 100 || 0}%` }}
                              title={`Answered: ${answered}`}
                            />
                            <div
                              className="bg-red-500 transition duration-200 hover:brightness-110"
                              style={{ width: `${(unanswered / totalCalls) * 100 || 0}%` }}
                              title={`Unanswered: ${unanswered}`}
                            />
                          </div>
                        </td>

                        {/* Calls Breakdown Bar with Labels */}


                        {/* Sentiment Breakdown Bar with Labels */}
                        <td className="px-4 py-2">
                          <div className="flex justify-between text-[10px] text-gray-600 mb-1 px-1 flex-wrap gap-x-2">
                            <span>👍 {positive}</span>
                            <span>👎 {negative}</span>
                            <span>😐 {neutral}</span>
                            <span>🚫 {noResponse}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
                            <div
                              className="bg-blue-500 transition duration-200 hover:brightness-110"
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

        {/* --- Program Details --- */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold px-4 pb-2 text-gray-800">Program Details</h3>
          <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Program Name</th>
                <th className="px-4 py-2">Cost Spent</th>
                <th className="px-4 py-2"># Calls Completed</th>
                <th className="px-4 py-2"># Calls Answered</th>
                <th className="px-4 py-2"># Answered (Positive)</th>
                <th className="px-4 py-2"># Answered (Negative)</th>
                <th className="px-4 py-2"># Answered (Neutral)</th>
                <th className="px-4 py-2"># Answered (No Sentiment)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[
                { name: "Program A", cost: "$6.500", total: 190, answered: 180, pos: 150, neg: 65, neut: 30, none: 10 },
                { name: "Program B", cost: "$4.100", total: 140, answered: 140, pos: 90, neg: 20, neut: 25, none: 45 },
                { name: "Program C", cost: "$4.680", total: 110, answered: 100, pos: 100, neg: 10, neut: 30, none: 5 },
              ].map((program) => (
                <tr key={program.name} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{program.name}</td>
                  <td className="px-4 py-2">{program.cost}</td>
                  <td className="px-4 py-2">{program.total}</td>
                  <td className="px-4 py-2">{program.answered}</td>
                  <td className="px-4 py-2">{program.pos}</td>
                  <td className="px-4 py-2">{program.neg}</td>
                  <td className="px-4 py-2">{program.neut}</td>
                  <td className="px-4 py-2">{program.none}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </div>
    </div>
  );
}

export default ClientDashboard;

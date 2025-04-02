import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";

export default function analytics() {

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
          }
        };
        fetchAgents();
      }, []);
    
      const fetchExecutionIds = async () => {
        try {
          const response = await fetch(`https://api.bolna.dev/agent/${agentId}/executions`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          });
    
          if (!response.ok) {
            throw new Error("Failed to fetch execution IDs");
          }
    
          const data = await response.json();
          console.log(data);
          
          if (!Array.isArray(data) || data.length === 0) return [];
    
          return data.map((execution) => execution.id);
        } catch (error) {
          console.error("❌ Error fetching execution IDs:", error);
          return [];
        }
      };
    
      const fetchBatchCallDetails = async (executionIds) => {
        try {
          const callsData = await Promise.all(
            executionIds.map(async (executionId) => {
              const response = await fetch(`https://api.bolna.dev/executions/${executionId}`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                },
              });
              return response.ok ? response.json() : null;
            })
          );
    
          return callsData.filter((log) => log !== null);
        } catch (error) {
          console.error("❌ Error fetching call logs:", error);
          return [];
        }
      };
    
      const fetchCallDetails = async () => {
        setLoading(true);
        setError(null);
    
        try {
          let executionIds = await fetchExecutionIds();
          if (executionIds.length === 0) {
            setLoading(false);
            return;
          }
    
          executionIds = executionIds.reverse();
          const recentBatch = executionIds.slice(0, 5);
          const recentCalls = await fetchBatchCallDetails(recentBatch);
          const sortedRecent = recentCalls.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setExecutions(sortedRecent);
          setLoading(false);
    
          const remainingBatch = executionIds.slice(5);
          if (remainingBatch.length > 0) {
            const olderCalls = await fetchBatchCallDetails(remainingBatch);
            setExecutions((prev) =>
              [...prev, ...olderCalls].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            );
          }
        } catch (error) {
          console.error("❌ Error fetching call logs:", error);
          setError(error.message);
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchCallDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [agentId]);

    return {


    }
}
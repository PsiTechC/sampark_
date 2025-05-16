import { useEffect } from "react";

export default function useBatchSentimentPolling() {
  useEffect(() => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (typeof window === "undefined") return;
  
    console.log("✅ Sentiment polling started");
  
  
    const interval = setInterval(() => {
      console.log("📡 Pinging sentiment API...");
      fetch(`${BASE_URL}/api/clients/batchsentiment`)
        .then((res) => res.json())
        .then((data) => console.log())
        .catch((err) => console.error());
    }, 600_000);
  
    return () => clearInterval(interval);
  }, []);
  
}



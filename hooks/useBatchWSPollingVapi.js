import { useEffect } from "react";

export default function useBatchWSPolling() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (typeof window === "undefined") return;

    console.log("✅ Sentiment polling started");

    const interval = setInterval(() => {
      console.log("📡 Pinging sentiment API...");
      fetch(`${BASE_URL}/api/clients/forWSvapi`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch forWSvapi");
          }
          return res.json();
        })
        .then((data) => {
          console.log("✅ forWSBolna completed", data);
          return fetch(`${BASE_URL}/api/clients/sendWS`);
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch forWSvapi");
          }
          return res.json();
        })
        .then((sendData) => {
          console.log("🚀 sendWSBolna completed", sendData);
        })
        .catch((err) => {
          console.error("❌ Error in WS polling flow:", err);
        });
    }, 60_000);

    return () => clearInterval(interval);
  }, []);
}
